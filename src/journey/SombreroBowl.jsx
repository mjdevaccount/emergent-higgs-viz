import { useRef, useEffect } from "react";
import * as THREE from "three";
import { sombreroHeight } from "../physics.js";

// Physical ceramic-looking bowl with a ball bearing in the rim.
// Bowl shape warps in real-time as r changes.
export default function SombreroBowl({ radialPos, width, height }) {
  const mountRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || width === 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(3.2, 2.5, 3.2);
    camera.lookAt(0, -0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // Warm lighting for ceramic look
    scene.add(new THREE.AmbientLight(0x2a2030, 0.5));
    const key = new THREE.DirectionalLight(0xffeedd, 0.8);
    key.position.set(4, 6, 3);
    key.castShadow = true;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x4466aa, 0.3);
    fill.position.set(-3, 4, -2);
    scene.add(fill);

    // Bowl geometry
    const res = 60;
    const geometry = new THREE.BufferGeometry();
    const verts = new Float32Array((res + 1) * (res + 1) * 3);
    const norms = new Float32Array((res + 1) * (res + 1) * 3);
    const indices = [];
    const phiRange = 2.0;

    for (let i = 0; i <= res; i++) {
      for (let j = 0; j <= res; j++) {
        const idx = i * (res + 1) + j;
        verts[idx * 3] = ((i / res) * 2 - 1) * phiRange;
        verts[idx * 3 + 1] = 0;
        verts[idx * 3 + 2] = ((j / res) * 2 - 1) * phiRange;
      }
    }
    for (let i = 0; i < res; i++) {
      for (let j = 0; j < res; j++) {
        const a = i * (res + 1) + j;
        indices.push(a, a + 1, a + res + 1, a + 1, a + res + 2, a + res + 1);
      }
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    // Ceramic material — matte with slight sheen
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1a2a3a,
      roughness: 0.65,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const bowl = new THREE.Mesh(geometry, mat);
    bowl.receiveShadow = true;
    scene.add(bowl);

    // Ball bearing (marble)
    const marbleGeo = new THREE.SphereGeometry(0.08, 24, 24);
    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 0.1,
      metalness: 0.9,
    });
    const marble = new THREE.Mesh(marbleGeo, marbleMat);
    marble.castShadow = true;
    scene.add(marble);

    stateRef.current = { scene, camera, renderer, bowl, marble, res, phiRange };

    let angle = 0;
    let raf;
    const animate = () => {
      angle += 0.002;
      bowl.rotation.y = angle;
      marble.position.x = Math.cos(angle) * 1.0; // orbit in the rim
      marble.position.z = Math.sin(angle) * 1.0;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      geometry.dispose();
      mat.dispose();
      marbleGeo.dispose();
      marbleMat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [width, height]);

  // Update bowl shape when r changes
  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;

    const { bowl, marble, res, phiRange } = s;
    const pos = bowl.geometry.attributes.position.array;

    let yMin = Infinity;
    let rimY = 0;

    for (let i = 0; i <= res; i++) {
      for (let j = 0; j <= res; j++) {
        const idx = i * (res + 1) + j;
        const phi1 = ((i / res) * 2 - 1) * phiRange;
        const phi2 = ((j / res) * 2 - 1) * phiRange;
        const y = sombreroHeight(phi1, phi2, radialPos);
        pos[idx * 3 + 1] = y;
        if (y < yMin) yMin = y;
      }
    }

    // Find rim height (at phi = 1, 0) for marble placement
    const rimIdx = Math.round(((1.0 / phiRange + 1) / 2) * res) * (res + 1) + Math.round(res / 2);
    rimY = pos[rimIdx * 3 + 1];
    marble.position.y = rimY + 0.1;

    bowl.geometry.attributes.position.needsUpdate = true;
    bowl.geometry.computeVertexNormals();
  }, [radialPos]);

  return <div ref={mountRef} style={{ width, height }} />;
}
