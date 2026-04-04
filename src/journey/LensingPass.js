import * as THREE from "three";

// Screen-space gravitational lensing shader.
// For each pixel, compute UV displacement based on the Schwarzschild
// deflection angle θ = 2r_s / b where b is impact parameter (pixel
// distance from the black hole center). Rays inside the event horizon
// return black. Rays near the photon sphere (1.5 r_s) get wrapped
// dramatically, creating Einstein ring effects.

export const LensingShader = {
  uniforms: {
    tDiffuse: { value: null },
    bhScreenPos: { value: new THREE.Vector2(0.5, 0.5) },
    bhScreenRadius: { value: 0.05 },
    strength: { value: 1.0 },
    resolution: { value: new THREE.Vector2(1, 1) },
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 bhScreenPos;
    uniform float bhScreenRadius;
    uniform float strength;
    uniform vec2 resolution;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      vec2 aspect = vec2(resolution.x / resolution.y, 1.0);

      // Vector from pixel to black hole center (aspect-corrected)
      vec2 delta = (uv - bhScreenPos) * aspect;
      float dist = length(delta);

      // Schwarzschild radius in screen space
      float rs = bhScreenRadius;

      // Inside event horizon — pure black
      if (dist < rs * 0.95) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }

      // Impact parameter b = dist (in screen units)
      // Deflection angle: θ ≈ 2*rs/b for weak field, stronger near photon sphere
      // Photon sphere at 1.5*rs — rays here orbit and produce Einstein rings
      float b = dist;

      // Deflection with enhancement near photon sphere
      float photonSphere = 1.5 * rs;
      float deflection = strength * 2.0 * rs / (b + 0.001);

      // Extra bending near photon sphere (1.5 rs)
      float psProximity = exp(-pow((b - photonSphere) / (rs * 0.3), 2.0));
      deflection += strength * psProximity * 0.8;

      // Apply deflection: bend UV toward the black hole
      vec2 dir = normalize(delta);
      vec2 displaced = uv + dir * deflection / aspect;

      // Clamp to valid UV range
      displaced = clamp(displaced, 0.0, 1.0);

      vec4 color = texture2D(tDiffuse, displaced);

      // Einstein ring glow at photon sphere
      float ringGlow = psProximity * 0.3 * strength;
      color.rgb += vec3(0.0, 0.5, 1.0) * ringGlow;

      // Darken close to horizon for smooth transition
      float horizonFade = smoothstep(rs * 0.95, rs * 1.3, dist);
      color.rgb *= horizonFade;

      gl_FragColor = color;
    }
  `,
};
