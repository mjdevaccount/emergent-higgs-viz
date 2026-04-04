import * as THREE from "three";

// Instanced particle system: matter falling into the black hole.
// Most particles spiral in and get trapped. 1.13% escape (gold).
const COUNT = 1500;
const TUNNEL_CHANCE = 0.0113;

export function createParticleSystem(scene) {
  const geo = new THREE.SphereGeometry(0.015, 4, 4);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  // Per-particle state
  const state = [];
  for (let i = 0; i < COUNT; i++) {
    state.push(resetParticle(i));
  }

  // Color buffer
  const colors = new Float32Array(COUNT * 3);
  mesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
  mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);

  scene.add(mesh);

  const dummy = new THREE.Object3D();

  return { mesh, state, dummy, geo, mat };
}

function resetParticle(i, escaped) {
  const angle = Math.random() * Math.PI * 2;
  const dist = 8 + Math.random() * 12; // start far out
  return {
    angle,
    dist,
    y: (Math.random() - 0.5) * 0.6,
    speed: 0.003 + Math.random() * 0.004,
    angSpeed: 0.002 + Math.random() * 0.003,
    size: 0.5 + Math.random() * 0.5,
    escaped: escaped || false,
    escapeSpeed: 0,
    alpha: 0.3 + Math.random() * 0.7,
  };
}

export function updateParticles(system, radialPos, delta) {
  const { mesh, state, dummy } = system;
  const colors = mesh.instanceColor.array;

  // How deep we are: 0 = far out, 1 = core
  const depth = Math.max(0, Math.min(1, (4.0 - radialPos) / 3.4));

  // Color blend: cyan outside → gold inside
  // horizon crossover at radialPos ≈ 1.0
  const goldMix = Math.max(0, Math.min(1, (1.0 - radialPos) / 0.8));

  for (let i = 0; i < COUNT; i++) {
    const p = state[i];

    if (p.escaped) {
      // Escaping particle — flies outward, gold, bright
      p.dist += p.escapeSpeed * delta * 60;
      p.escapeSpeed += 0.001 * delta * 60;
      p.angle += p.angSpeed * 0.3 * delta * 60;

      if (p.dist > 20) {
        state[i] = resetParticle(i);
        continue;
      }

      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.85;
      colors[i * 3 + 2] = 0.0;
    } else {
      // Falling inward — spiral
      p.dist -= p.speed * (1 + depth * 2) * delta * 60;
      p.angle += p.angSpeed * (1 + 3 / (p.dist + 0.5)) * delta * 60;
      p.y *= 0.998; // flatten toward disk plane

      if (p.dist < 0.3) {
        // Reached the core — 1.13% chance to escape
        if (Math.random() < TUNNEL_CHANCE) {
          state[i] = resetParticle(i, true);
          state[i].dist = 0.5;
          state[i].escapeSpeed = 0.02;
          state[i].escaped = true;
        } else {
          state[i] = resetParticle(i);
        }
        continue;
      }

      // Color: blend based on distance and depth
      const localGold = Math.max(0, Math.min(1, goldMix + (1 - p.dist / 8) * 0.3));
      const brightness = p.alpha * (0.4 + 0.6 * (1 - p.dist / 20));
      colors[i * 3] = (localGold * 1.0 + (1 - localGold) * 0.3) * brightness;
      colors[i * 3 + 1] = (localGold * 0.75 + (1 - localGold) * 0.7) * brightness;
      colors[i * 3 + 2] = (localGold * 0.0 + (1 - localGold) * 1.0) * brightness;
    }

    const x = Math.cos(p.angle) * p.dist;
    const z = Math.sin(p.angle) * p.dist;
    dummy.position.set(x, p.y, z);
    dummy.scale.setScalar(p.size * (p.escaped ? 2.0 : 0.8));
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }

  mesh.instanceMatrix.needsUpdate = true;
  mesh.instanceColor.needsUpdate = true;
}

export function disposeParticles(system) {
  system.geo.dispose();
  system.mat.dispose();
}
