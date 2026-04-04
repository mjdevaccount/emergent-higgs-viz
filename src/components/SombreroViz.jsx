import { useRef, useEffect } from "react";
import * as THREE from "three";
import { sombreroHeight } from "../physics.js";

export default function SombreroViz({ radialPos, width, height }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const meshRef = useRef(null);
  const wireRef = useRef(null);
  const rendererRef = useRef(null);
  const rafRef = useRef(null);

  // Initial setup
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(3.5, 2.8, 3.5);
    camera.lookAt(0, -0.3, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    scene.add(new THREE.AmbientLight(0x334466, 0.6));
    const dir1 = new THREE.DirectionalLight(0x00d4ff, 0.8);
    dir1.position.set(3, 5, 3);
    scene.add(dir1);
    const dir2 = new THREE.DirectionalLight(0xffd700, 0.4);
    dir2.position.set(-3, 3, -2);
    scene.add(dir2);
    const point = new THREE.PointLight(0x8844ff, 0.5, 10);
    point.position.set(0, 2, 0);
    scene.add(point);

    // Geometry
    const res = 80;
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array((res + 1) * (res + 1) * 3);
    const colors = new Float32Array((res + 1) * (res + 1) * 3);
    const indices = [];

    const phiRange = 2.0;
    for (let i = 0; i <= res; i++) {
      for (let j = 0; j <= res; j++) {
        const idx = i * (res + 1) + j;
        const phi1 = ((i / res) * 2 - 1) * phiRange;
        const phi2 = ((j / res) * 2 - 1) * phiRange;
        vertices[idx * 3] = phi1;
        vertices[idx * 3 + 1] = 0;
        vertices[idx * 3 + 2] = phi2;
        colors[idx * 3] = 0;
        colors[idx * 3 + 1] = 0;
        colors[idx * 3 + 2] = 0;
      }
    }

    for (let i = 0; i < res; i++) {
      for (let j = 0; j < res; j++) {
        const a = i * (res + 1) + j;
        const b = a + 1;
        const c = (i + 1) * (res + 1) + j;
        const d = c + 1;
        indices.push(a, b, c, b, d, c);
      }
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const mat = new THREE.MeshPhongMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      shininess: 60,
      transparent: true,
      opacity: 0.85,
    });

    const mesh = new THREE.Mesh(geometry, mat);
    scene.add(mesh);
    meshRef.current = mesh;

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const wire = new THREE.Mesh(geometry.clone(), wireMat);
    scene.add(wire);
    wireRef.current = wire;

    sceneRef.current = { scene, camera, renderer };

    let angle = 0;
    const animate = () => {
      angle += 0.003;
      mesh.rotation.y = angle;
      wire.rotation.y = angle;
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      geometry.dispose();
      mat.dispose();
      wireMat.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [width, height]);

  // Update geometry when radialPos changes
  useEffect(() => {
    const mesh = meshRef.current;
    const wire = wireRef.current;
    if (!mesh) return;

    const res = 80;
    const phiRange = 2.0;
    const pos = mesh.geometry.attributes.position.array;
    const col = mesh.geometry.attributes.color.array;

    let yMin = Infinity, yMax = -Infinity;
    const yVals = [];

    for (let i = 0; i <= res; i++) {
      for (let j = 0; j <= res; j++) {
        const idx = i * (res + 1) + j;
        const phi1 = ((i / res) * 2 - 1) * phiRange;
        const phi2 = ((j / res) * 2 - 1) * phiRange;
        const y = sombreroHeight(phi1, phi2, radialPos);
        pos[idx * 3 + 1] = y;
        yVals.push(y);
        if (y < yMin) yMin = y;
        if (y > yMax) yMax = y;
      }
    }

    // Color by height: deep blue → cyan → gold
    for (let i = 0; i < yVals.length; i++) {
      const t = (yVals[i] - yMin) / (yMax - yMin + 0.001);
      if (t < 0.5) {
        const s = t * 2;
        col[i * 3] = 0.05 + s * 0.0;
        col[i * 3 + 1] = 0.05 + s * 0.6;
        col[i * 3 + 2] = 0.4 + s * 0.6;
      } else {
        const s = (t - 0.5) * 2;
        col[i * 3] = 0.0 + s * 1.0;
        col[i * 3 + 1] = 0.65 + s * 0.2;
        col[i * 3 + 2] = 1.0 - s * 0.6;
      }
    }

    mesh.geometry.attributes.position.needsUpdate = true;
    mesh.geometry.attributes.color.needsUpdate = true;
    mesh.geometry.computeVertexNormals();

    if (wire) {
      const wPos = wire.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i++) wPos[i] = pos[i];
      wire.geometry.attributes.position.needsUpdate = true;
    }
  }, [radialPos]);

  return <div ref={mountRef} style={{ width, height }} />;
}
