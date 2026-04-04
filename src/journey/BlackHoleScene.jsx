import { useRef, useEffect } from "react";
import * as THREE from "three";
import { R_MIN, R_H, R_0, R_A, sombreroHeight, couplingGround } from "../physics.js";
import { createParticleSystem, updateParticles, disposeParticles } from "./particles.js";

export default function BlackHoleScene({ radialPos, width, height, darkBeat }) {
  const mountRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || width === 0) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020208, 0.015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
    camera.position.set(0, 12, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020208, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mount.appendChild(renderer.domElement);

    // ── Lighting ──
    const ambient = new THREE.AmbientLight(0x0a1020, 0.3);
    scene.add(ambient);

    const coreLight = new THREE.PointLight(0x00d4ff, 0, 20);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const rimLight = new THREE.PointLight(0xffd700, 0, 15);
    rimLight.position.set(0, 2, 0);
    scene.add(rimLight);

    // ── Event Horizon (black sphere) ──
    const horizonGeo = new THREE.SphereGeometry(1.0, 64, 64);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const horizon = new THREE.Mesh(horizonGeo, horizonMat);
    scene.add(horizon);

    // Horizon edge glow
    const glowGeo = new THREE.SphereGeometry(1.05, 64, 64);
    const glowMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      uniforms: {
        glowColor: { value: new THREE.Color(0x00d4ff) },
        intensity: { value: 0.6 },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float intensity;
        varying vec3 vNormal;
        void main() {
          float glow = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          gl_FragColor = vec4(glowColor, glow * intensity);
        }
      `,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowMesh);

    // ── Accretion Disk ──
    const diskGeo = new THREE.RingGeometry(1.8, 5.0, 128, 1);
    const diskMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        colorMix: { value: 0.0 }, // 0 = cyan, 1 = gold
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vDist;
        void main() {
          vUv = uv;
          vDist = length(position.xz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float colorMix;
        varying vec2 vUv;
        varying float vDist;
        void main() {
          float ring = smoothstep(1.8, 2.2, vDist) * smoothstep(5.0, 3.5, vDist);
          float swirl = sin(vUv.x * 40.0 + time * 2.0) * 0.15 + 0.85;
          float brightness = ring * swirl;

          vec3 cyan = vec3(0.0, 0.7, 1.0);
          vec3 gold = vec3(1.0, 0.75, 0.0);
          vec3 col = mix(cyan, gold, colorMix);

          gl_FragColor = vec4(col * brightness, brightness * 0.7);
        }
      `,
    });
    const disk = new THREE.Mesh(diskGeo, diskMat);
    disk.rotation.x = -Math.PI / 2;
    scene.add(disk);

    // ── Sombrero (hidden initially, blooms at core) ──
    const somRes = 60;
    const somRange = 2.0;
    const somVerts = new Float32Array((somRes + 1) * (somRes + 1) * 3);
    const somIndices = [];
    for (let i = 0; i <= somRes; i++) {
      for (let j = 0; j <= somRes; j++) {
        const idx = i * (somRes + 1) + j;
        somVerts[idx * 3] = ((i / somRes) * 2 - 1) * somRange;
        somVerts[idx * 3 + 1] = 0;
        somVerts[idx * 3 + 2] = ((j / somRes) * 2 - 1) * somRange;
      }
    }
    for (let i = 0; i < somRes; i++) {
      for (let j = 0; j < somRes; j++) {
        const a = i * (somRes + 1) + j;
        somIndices.push(a, a + 1, a + somRes + 1, a + 1, a + somRes + 2, a + somRes + 1);
      }
    }
    const somGeo = new THREE.BufferGeometry();
    somGeo.setAttribute("position", new THREE.BufferAttribute(somVerts, 3));
    somGeo.setIndex(somIndices);
    somGeo.computeVertexNormals();

    const somMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffd700,
      emissiveIntensity: 0.2,
      roughness: 0.5,
      metalness: 0.3,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const sombrero = new THREE.Mesh(somGeo, somMat);
    sombrero.visible = false;
    scene.add(sombrero);

    // ── Particles ──
    const particles = createParticleSystem(scene);

    // ── Stars background ──
    const starGeo = new THREE.BufferGeometry();
    const starVerts = new Float32Array(3000);
    for (let i = 0; i < 3000; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 60 + Math.random() * 40;
      starVerts[i] = r * Math.sin(phi) * Math.cos(theta);
      starVerts[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starVerts[i + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starVerts, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x8899bb, size: 0.15, sizeAttenuation: true });
    scene.add(new THREE.Points(starGeo, starMat));

    stateRef.current = {
      scene, camera, renderer,
      horizon, glowMat, disk, diskMat,
      sombrero, somGeo, somMat, somRes, somRange,
      coreLight, rimLight,
      particles,
      clock: new THREE.Clock(),
    };

    let raf;
    const animate = () => {
      const s = stateRef.current;
      if (!s) return;
      const delta = s.clock.getDelta();
      s.diskMat.uniforms.time.value += delta;
      s.disk.rotation.z += delta * 0.15;

      updateParticles(s.particles, s._radialPos || 4.0, delta);
      s.renderer.render(s.scene, s.camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      horizonGeo.dispose(); horizonMat.dispose();
      glowGeo.dispose(); glowMat.dispose();
      diskGeo.dispose(); diskMat.dispose();
      somGeo.dispose(); somMat.dispose();
      starGeo.dispose(); starMat.dispose();
      disposeParticles(particles);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [width, height]);

  // ── Update scene on scroll (radialPos changes) ──
  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;
    s._radialPos = radialPos;

    const { camera, coreLight, rimLight, diskMat, glowMat,
            sombrero, somGeo, somMat, somRes, somRange } = s;

    // Depth: 0 = far, 1 = core
    const depth = Math.max(0, Math.min(1, (4.0 - radialPos) / 3.4));
    // Gold mix: 0 = outside (cyan), 1 = deep inside (gold)
    const goldMix = Math.max(0, Math.min(1, (1.0 - radialPos) / 0.6));

    // ── Camera spiral ──
    const angle = depth * Math.PI * 3; // 1.5 full rotations
    const camDist = 18 - depth * 14; // 18 → 4
    const camHeight = 12 - depth * 10; // 12 → 2
    camera.position.set(
      Math.sin(angle) * camDist,
      camHeight,
      Math.cos(angle) * camDist,
    );
    camera.lookAt(0, -depth * 1.5, 0);

    // ── Lighting shifts ──
    coreLight.intensity = depth * 3;
    coreLight.color.setHex(goldMix > 0.5 ? 0xffd700 : 0x00d4ff);
    rimLight.intensity = goldMix * 2;

    // ── Accretion disk color ──
    diskMat.uniforms.colorMix.value = goldMix;

    // ── Horizon glow color shift ──
    const glowColor = new THREE.Color().lerpColors(
      new THREE.Color(0x00d4ff),
      new THREE.Color(0xffd700),
      goldMix,
    );
    glowMat.uniforms.glowColor.value = glowColor;
    glowMat.uniforms.intensity.value = 0.4 + depth * 0.8;

    // ── Fog density ──
    s.scene.fog.density = 0.015 + goldMix * 0.03;

    // ── Tone mapping exposure ──
    s.renderer.toneMappingExposure = darkBeat ? 0.1 : (1.0 - goldMix * 0.3);

    // ── Sombrero bloom at core ──
    const somThreshold = 0.15; // radialPos below which sombrero appears
    const somProgress = Math.max(0, Math.min(1, (somThreshold - (radialPos - R_H)) / somThreshold));

    if (somProgress > 0) {
      sombrero.visible = true;
      somMat.opacity = somProgress * 0.8;

      const pos = somGeo.attributes.position.array;
      for (let i = 0; i <= somRes; i++) {
        for (let j = 0; j <= somRes; j++) {
          const idx = i * (somRes + 1) + j;
          const phi1 = ((i / somRes) * 2 - 1) * somRange;
          const phi2 = ((j / somRes) * 2 - 1) * somRange;
          const y = sombreroHeight(phi1, phi2, radialPos) * somProgress * 3;
          pos[idx * 3 + 1] = y;
        }
      }
      somGeo.attributes.position.needsUpdate = true;
      somGeo.computeVertexNormals();
    } else {
      sombrero.visible = false;
    }
  }, [radialPos, darkBeat]);

  return <div ref={mountRef} style={{ width, height }} />;
}
