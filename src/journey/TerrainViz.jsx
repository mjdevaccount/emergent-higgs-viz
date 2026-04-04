import { useRef, useEffect } from "react";
import * as THREE from "three";
import { R_MIN, R_0, R_A, groundState } from "../physics.js";

// 3D cross-section landscape of U(r) rendered as physical terrain.
// The deep well is a pit, the barrier at r₀ is a ridge,
// the accretion disk is a shallow moat.
export default function TerrainViz({ radialPos, width, height }) {
  const mountRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || width === 0) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020208, 0.06);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200);
    camera.position.set(0, 8, 18);
    camera.lookAt(0, -1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020208, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Lighting — dramatic, directional
    const ambient = new THREE.AmbientLight(0x0a1628, 0.4);
    scene.add(ambient);

    const mainLight = new THREE.DirectionalLight(0x00d4ff, 0.6);
    mainLight.position.set(-5, 12, 8);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.set(1024, 1024);
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xffd700, 0.3);
    rimLight.position.set(5, 8, -5);
    scene.add(rimLight);

    const coreGlow = new THREE.PointLight(0x00d4ff, 0, 15);
    coreGlow.position.set(-6, -2, 0);
    scene.add(coreGlow);

    // Build terrain geometry — U(r) extruded along z
    const rSteps = 200;
    const zSteps = 40;
    const rMin = R_MIN + 0.01;
    const rMax = 4.5;
    const zExtent = 8;

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    const indices = [];

    // Precompute potential values and normalize
    const potVals = [];
    let pMin = Infinity, pMax = -Infinity;
    for (let i = 0; i <= rSteps; i++) {
      const r = rMin + ((rMax - rMin) * i) / rSteps;
      const p = groundState(r);
      const val = isNaN(p) ? 10 : p;
      potVals.push(val);
      if (val < pMin) pMin = val;
      if (val > pMax) pMax = val;
    }
    const pRange = pMax - pMin || 1;

    // Map potential to terrain height: low potential = deep pit
    for (let i = 0; i <= rSteps; i++) {
      const r = rMin + ((rMax - rMin) * i) / rSteps;
      const x = ((r - rMin) / (rMax - rMin)) * 30 - 15; // map to [-15, 15]
      const yBase = ((potVals[i] - pMin) / pRange) * 6 - 3; // map to [-3, 3]

      for (let j = 0; j <= zSteps; j++) {
        const z = ((j / zSteps) * 2 - 1) * zExtent;

        // Cross-section: terrain is constant along z but fades at edges
        const zFade = 1.0 - Math.pow(Math.abs(z) / zExtent, 4);
        const y = yBase * zFade;

        vertices.push(x, y, z);

        // Color by depth: deep = cyan, ridge = red, plateau = dim
        const norm = (potVals[i] - pMin) / pRange;
        let cr, cg, cb;
        if (norm < 0.3) {
          // Deep well — bright cyan
          const t = norm / 0.3;
          cr = 0.0;
          cg = 0.5 + (1 - t) * 0.3;
          cb = 0.8 + (1 - t) * 0.2;
        } else if (norm > 0.8) {
          // Ridge/barrier — warm red
          const t = (norm - 0.8) / 0.2;
          cr = 0.6 + t * 0.4;
          cg = 0.1;
          cb = 0.1;
        } else {
          // Mid — dark blue-grey
          const t = (norm - 0.3) / 0.5;
          cr = 0.05 + t * 0.15;
          cg = 0.08 + t * 0.05;
          cb = 0.2 - t * 0.1;
        }
        colors.push(cr * zFade, cg * zFade, cb * zFade);
      }
    }

    for (let i = 0; i < rSteps; i++) {
      for (let j = 0; j < zSteps; j++) {
        const a = i * (zSteps + 1) + j;
        const b = a + 1;
        const c = (i + 1) * (zSteps + 1) + j;
        const d = c + 1;
        indices.push(a, b, c, b, d, c);
      }
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.7,
      metalness: 0.3,
    });

    const terrain = new THREE.Mesh(geometry, material);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Glowing particle (ball that rolls on the terrain)
    const ballGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffd700,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.castShadow = true;
    scene.add(ball);

    // Ball glow
    const glowLight = new THREE.PointLight(0xffd700, 1, 5);
    scene.add(glowLight);

    stateRef.current = {
      scene, camera, renderer, terrain, ball, glowLight, coreGlow,
      rMin, rMax, potVals, pMin, pRange, rSteps, zSteps,
    };

    let raf;
    const animate = () => {
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      ballGeo.dispose();
      ballMat.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [width, height]);

  // Update ball position and camera when radialPos changes
  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;

    const { camera, ball, glowLight, coreGlow, rMin, rMax, potVals, pMin, pRange, rSteps } = s;

    // Map radialPos to terrain x and y
    const rClamped = Math.max(rMin, Math.min(rMax, radialPos));
    const t = (rClamped - rMin) / (rMax - rMin);
    const x = t * 30 - 15;
    const idx = Math.round(t * rSteps);
    const pot = potVals[Math.min(idx, potVals.length - 1)];
    const y = ((pot - pMin) / pRange) * 6 - 3 + 0.3; // slight offset above terrain

    ball.position.set(x, y, 0);
    glowLight.position.set(x, y + 0.5, 0);

    // Core glow intensifies near the deep well
    const depth = Math.max(0, 1 - (radialPos - 0.6) / 1.0);
    coreGlow.intensity = depth * 2;

    // Camera follows — subtle lateral tracking
    camera.position.x = x * 0.3;
    camera.position.y = 6 + (1 - t) * 4; // higher when deeper
    camera.lookAt(x, y - 1, 0);
  }, [radialPos]);

  return <div ref={mountRef} style={{ width, height }} />;
}
