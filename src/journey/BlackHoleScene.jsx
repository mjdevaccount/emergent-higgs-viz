import { useRef, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { R_MIN, R_H, R_0, R_A, sombreroHeight } from "../physics.js";
import { createParticleSystem, updateParticles, disposeParticles } from "./particles.js";
import { LensingShader } from "./LensingPass.js";

// Phases: cosmos | accretion | approach | crossing | interior | core
function getPhase(r) {
  if (r > 3.5) return "cosmos";
  if (r > 2.8) return "accretion";
  if (r > 1.05) return "approach";
  if (r > 0.95) return "crossing";
  if (r > R_H + 0.05) return "interior";
  return "core";
}

export default function BlackHoleScene({ radialPos, width, height, darkBeat }) {
  const mountRef = useRef(null);
  const sRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || width === 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 500);
    camera.position.set(0, 5, 40);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020208, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mount.appendChild(renderer.domElement);

    // ── Post-processing: gravitational lensing ──
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const lensingPass = new ShaderPass(LensingShader);
    lensingPass.uniforms.resolution.value.set(width, height);
    composer.addPass(lensingPass);

    // ── Lighting ──
    const ambient = new THREE.AmbientLight(0x0a1020, 0.3);
    scene.add(ambient);
    const coreLight = new THREE.PointLight(0x00d4ff, 0, 30);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // ── Event Horizon (black sphere) ──
    const horizonGeo = new THREE.SphereGeometry(1, 64, 64);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const horizon = new THREE.Mesh(horizonGeo, horizonMat);
    scene.add(horizon);

    // Horizon edge glow
    const glowGeo = new THREE.SphereGeometry(1.06, 64, 64);
    const glowMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        glowColor: { value: new THREE.Color(0x00d4ff) },
        intensity: { value: 0.5 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float intensity;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float rim = 1.0 - max(0.0, dot(vNormal, vViewDir));
          float glow = pow(rim, 2.5);
          gl_FragColor = vec4(glowColor, glow * intensity);
        }
      `,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowMesh);

    // ── Accretion Disk ──
    const diskGeo = new THREE.RingGeometry(1.5, 4.5, 128, 3);
    const diskMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms: {
        time: { value: 0 },
        colorMix: { value: 0.0 },
        brightness: { value: 0.5 },
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
        uniform float brightness;
        varying vec2 vUv;
        varying float vDist;
        void main() {
          float ring = smoothstep(1.5, 2.0, vDist) * smoothstep(4.5, 3.0, vDist);
          float swirl = sin(vUv.x * 50.0 + time * 3.0) * 0.2 + 0.8;
          float hot = smoothstep(3.5, 1.8, vDist); // brighter near center
          float b = ring * swirl * (0.5 + hot * 0.5) * brightness;

          vec3 cyan = vec3(0.0, 0.7, 1.0);
          vec3 gold = vec3(1.0, 0.75, 0.0);
          vec3 col = mix(cyan, gold, colorMix);
          gl_FragColor = vec4(col * b, b * 0.8);
        }
      `,
    });
    const disk = new THREE.Mesh(diskGeo, diskMat);
    disk.rotation.x = -Math.PI * 0.47; // slight tilt
    scene.add(disk);

    // ── Stars ──
    const STAR_COUNT = 2000;
    const starPositions = new Float32Array(STAR_COUNT * 3);
    const starOriginal = new Float32Array(STAR_COUNT * 3); // original positions
    for (let i = 0; i < STAR_COUNT * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 80 + Math.random() * 120;
      starPositions[i] = starOriginal[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = starOriginal[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = starOriginal[i + 2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xaabbdd, size: 0.3, sizeAttenuation: true, transparent: true, opacity: 1 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Sombrero (blooms at core) ──
    const somRes = 50;
    const somRange = 1.8;
    const somVerts = new Float32Array((somRes + 1) * (somRes + 1) * 3);
    const somIdx = [];
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
        somIdx.push(a, a + 1, a + somRes + 1, a + 1, a + somRes + 2, a + somRes + 1);
      }
    }
    const somGeo = new THREE.BufferGeometry();
    somGeo.setAttribute("position", new THREE.BufferAttribute(somVerts, 3));
    somGeo.setIndex(somIdx);
    const somMat = new THREE.MeshStandardMaterial({
      color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 0.3,
      roughness: 0.4, metalness: 0.3, side: THREE.DoubleSide,
      transparent: true, opacity: 0,
    });
    const sombrero = new THREE.Mesh(somGeo, somMat);
    sombrero.visible = false;
    scene.add(sombrero);

    // ── Particles ──
    const particles = createParticleSystem(scene);

    sRef.current = {
      scene, camera, renderer, composer, lensingPass,
      horizon, glowMesh, glowMat,
      disk, diskMat,
      stars, starMat, starGeo, starOriginal,
      sombrero, somGeo, somMat, somRes, somRange,
      coreLight, particles,
      clock: new THREE.Clock(),
    };

    let raf;
    const animate = () => {
      const s = sRef.current;
      if (!s) return;
      const delta = s.clock.getDelta();
      s.diskMat.uniforms.time.value += delta;
      s.disk.rotation.z += delta * 0.12;
      updateParticles(s.particles, s._r || 4.0, delta);
      s.composer.render();
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      [horizonGeo, horizonMat, glowGeo, glowMat, diskGeo, diskMat, somGeo, somMat, starGeo, starMat].forEach(d => d.dispose());
      disposeParticles(particles);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [width, height]);

  // ── Drive everything from radialPos ──
  useEffect(() => {
    const s = sRef.current;
    if (!s) return;
    s._r = radialPos;

    const phase = getPhase(radialPos);
    const { camera, horizon, glowMesh, glowMat, disk, diskMat,
            stars, starMat, starGeo, starOriginal,
            sombrero, somGeo, somMat, somRes, somRange, coreLight,
            lensingPass } = s;

    // ── Depth & gold mix ──
    const depth = Math.max(0, Math.min(1, (4.0 - radialPos) / 3.4));
    const goldMix = Math.max(0, Math.min(1, (1.0 - radialPos) / 0.6));
    const pastHorizon = radialPos < R_0;

    // ── Black hole scale: 5% of view at r=4, 80% at r=r₀ ──
    const bhScale = 0.3 + depth * 6;
    horizon.scale.setScalar(bhScale);
    glowMesh.scale.setScalar(bhScale * 1.06);

    // ── Camera ──
    const spiralAngle = depth * Math.PI * 2.5;
    let camDist, camY;
    if (phase === "cosmos") {
      camDist = 40; camY = 5;
    } else if (phase === "interior" || phase === "core") {
      camDist = 3 - depth * 1.5;
      camY = 1 - depth * 2;
    } else {
      camDist = 40 - depth * 34;
      camY = 5 - depth * 4;
    }
    camera.position.set(
      Math.sin(spiralAngle) * camDist,
      camY,
      Math.cos(spiralAngle) * camDist,
    );
    camera.lookAt(0, pastHorizon ? -1 : 0, 0);

    // ── Stars: bright in cosmos, stretch in approach, vanish at crossing ──
    const starPos = starGeo.attributes.position.array;
    if (phase === "cosmos" || phase === "accretion") {
      starMat.opacity = phase === "cosmos" ? 1.0 : 0.6;
      for (let i = 0; i < starPos.length; i++) starPos[i] = starOriginal[i];
    } else if (phase === "approach") {
      starMat.opacity = 0.7;
      const stretch = ((2.8 - radialPos) / 1.75); // 0→1 through approach
      for (let i = 0; i < starPos.length; i += 3) {
        const ox = starOriginal[i], oy = starOriginal[i+1], oz = starOriginal[i+2];
        // Stretch radially toward camera
        const dx = ox - camera.position.x;
        const dy = oy - camera.position.y;
        const dz = oz - camera.position.z;
        const len = Math.sqrt(dx*dx + dy*dy + dz*dz);
        const factor = 1 + stretch * 0.4;
        starPos[i] = camera.position.x + dx * factor;
        starPos[i+1] = camera.position.y + dy * factor;
        starPos[i+2] = camera.position.z + dz * factor;
      }
    } else {
      starMat.opacity = 0; // vanish at crossing and beyond
    }
    starGeo.attributes.position.needsUpdate = true;

    // ── Disk brightness & color ──
    if (phase === "cosmos") {
      diskMat.uniforms.brightness.value = 0.3;
      diskMat.uniforms.colorMix.value = 0;
    } else if (phase === "accretion") {
      diskMat.uniforms.brightness.value = 1.2; // dramatic brightening
      diskMat.uniforms.colorMix.value = 0.15;
    } else if (phase === "approach") {
      diskMat.uniforms.brightness.value = 1.0;
      diskMat.uniforms.colorMix.value = 0.1 + goldMix * 0.3;
    } else {
      // Fade disk out inside horizon — avoid confusing geometry from below
      const interiorFade = pastHorizon ? Math.max(0, 1 - goldMix * 2) : 1;
      diskMat.uniforms.brightness.value = (pastHorizon ? 0.3 : 0.8) * interiorFade;
      diskMat.uniforms.colorMix.value = goldMix;
    }

    // ── Glow color ──
    const gc = new THREE.Color().lerpColors(new THREE.Color(0x00d4ff), new THREE.Color(0xffd700), goldMix);
    glowMat.uniforms.glowColor.value = gc;
    glowMat.uniforms.intensity.value = phase === "crossing" ? 1.5 : (0.4 + depth * 0.6);

    // ── Core light — dim, only gold particles should be bright inside ──
    coreLight.intensity = pastHorizon ? 0.5 + goldMix * 1.5 : depth * 1.5;
    coreLight.color.setHex(goldMix > 0.3 ? 0xffd700 : 0x00d4ff);

    // ── Fog — heavy inside, claustrophobic ──
    s.scene.fog = pastHorizon
      ? new THREE.FogExp2(0x020304, 0.06 + goldMix * 0.08)
      : new THREE.FogExp2(0x020208, 0.008);

    // ── Exposure — dark interior ──
    s.renderer.toneMappingExposure = darkBeat ? 0.05 : (pastHorizon ? 0.35 : 1.0);

    // ── Background — near-black inside ──
    const bg = pastHorizon ? 0x020304 : 0x020208;
    s.renderer.setClearColor(bg, 1);

    // ── Sombrero bloom ──
    const somT = Math.max(0, Math.min(1, (R_H + 0.1 - radialPos) / 0.1));
    if (somT > 0 && !darkBeat) {
      sombrero.visible = true;
      somMat.opacity = somT * 0.7;
      const pos = somGeo.attributes.position.array;
      for (let i = 0; i <= somRes; i++) {
        for (let j = 0; j <= somRes; j++) {
          const idx = i * (somRes + 1) + j;
          const p1 = ((i / somRes) * 2 - 1) * somRange;
          const p2 = ((j / somRes) * 2 - 1) * somRange;
          pos[idx * 3 + 1] = sombreroHeight(p1, p2, radialPos) * somT * 4;
        }
      }
      somGeo.attributes.position.needsUpdate = true;
      somGeo.computeVertexNormals();
    } else {
      sombrero.visible = false;
    }

    // ── Gravitational lensing uniforms ──
    // Project black hole center to screen space
    const bhScreen = new THREE.Vector3(0, 0, 0).project(camera);
    lensingPass.uniforms.bhScreenPos.value.set(
      (bhScreen.x + 1) / 2,
      (bhScreen.y + 1) / 2,
    );
    // Screen radius scales with bhScale
    lensingPass.uniforms.bhScreenRadius.value = bhScale * 0.015;
    // Strength ramps up as you approach, fades inside
    lensingPass.uniforms.strength.value = pastHorizon
      ? Math.max(0, 0.5 - goldMix * 0.5)
      : Math.min(1.5, depth * 2);
  }, [radialPos, darkBeat]);

  return <div ref={mountRef} style={{ width, height }} />;
}
