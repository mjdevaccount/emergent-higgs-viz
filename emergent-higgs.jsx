import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import * as THREE from "three";

// ── Physics helpers ──────────────────────────────────────────────
const LAMBDA_SM = 0.13; // SM quartic coupling (approximate)
const VEV = 246; // GeV

function spatialPotential(r) {
  // Physically motivated V(r) near Schwarzschild BH
  // Deep well inside r_s, barrier at r_s, shallow well at ~1.6 r_s (accretion disk)
  const wellInner = -2.8 * Math.exp(-Math.pow((r - 0.35) / 0.22, 2));
  const barrier = 1.2 * Math.exp(-Math.pow((r - 1.0) / 0.15, 2));
  const wellOuter = -0.45 * Math.exp(-Math.pow((r - 1.6) / 0.25, 2));
  const asymptotic = 0.1 / (1 + Math.pow(r - 1, 2));
  return wellInner + barrier + wellOuter + asymptotic;
}

function effectiveLambda(r) {
  // Lambda varies with radial position, hits lambda/5 at potential minima
  const vr = spatialPotential(r);
  const vMin = -2.8;
  const vMax = 1.2;
  const normalized = (vr - vMin) / (vMax - vMin);
  const factor = 0.2 + 0.8 * Math.pow(normalized, 0.6);
  return LAMBDA_SM * Math.max(0.2, Math.min(1.0, factor));
}

function sombreroHeight(phi1, phi2, lambda) {
  const phiSq = phi1 * phi1 + phi2 * phi2;
  const mu2 = 2 * lambda * VEV * VEV;
  return (-mu2 * phiSq + lambda * phiSq * phiSq) / (VEV * VEV * VEV * VEV) * 0.5;
}

// ── Background Stars ─────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate stars
    const stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.0008 + 0.0002,
        phase: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = stars;

    let raf;
    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const a = s.alpha * (0.5 + 0.5 * Math.sin(time * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,210,255,${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

// ── V(r) Spatial Potential Plot ──────────────────────────────────
function SpatialPlot({ radialPos, width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const pad = { top: 30, right: 20, bottom: 50, left: 55 };
    const w = width - pad.left - pad.right;
    const h = height - pad.top - pad.bottom;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = "rgba(0,212,255,0.08)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = pad.top + (h * i) / 5;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + w, y);
      ctx.stroke();
    }
    for (let i = 0; i <= 5; i++) {
      const x = pad.left + (w * i) / 5;
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + h);
      ctx.stroke();
    }

    // Schwarzschild radius line
    const rsX = pad.left + (1.0 / 4.0) * w;
    ctx.strokeStyle = "rgba(255,80,80,0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(rsX, pad.top);
    ctx.lineTo(rsX, pad.top + h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Label r_s
    ctx.fillStyle = "rgba(255,100,100,0.8)";
    ctx.font = "italic 11px 'Cormorant Garamond', Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("r = rₛ", rsX, pad.top + h + 30);

    // Accretion disk line
    const adX = pad.left + (1.6 / 4.0) * w;
    ctx.strokeStyle = "rgba(255,200,50,0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(adX, pad.top);
    ctx.lineTo(adX, pad.top + h);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(255,200,50,0.7)";
    ctx.fillText("accretion", adX, pad.top + h + 20);
    ctx.fillText("disk", adX, pad.top + h + 33);

    // Compute potential
    const rMin = 0.05;
    const rMax = 4.0;
    const steps = 300;
    const points = [];
    let vMin = Infinity,
      vMax = -Infinity;
    for (let i = 0; i <= steps; i++) {
      const r = rMin + ((rMax - rMin) * i) / steps;
      const v = spatialPotential(r);
      points.push({ r, v });
      if (v < vMin) vMin = v;
      if (v > vMax) vMax = v;
    }
    vMin -= 0.3;
    vMax += 0.3;

    const toX = (r) => pad.left + ((r - rMin) / (rMax - rMin)) * w;
    const toY = (v) => pad.top + h - ((v - vMin) / (vMax - vMin)) * h;

    // Glow effect for curve
    ctx.shadowColor = "rgba(0,212,255,0.6)";
    ctx.shadowBlur = 12;
    ctx.strokeStyle = "#00d4ff";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = toX(p.r);
      const y = toY(p.v);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Fill under curve with gradient
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + h);
    grad.addColorStop(0, "rgba(0,212,255,0.05)");
    grad.addColorStop(1, "rgba(0,212,255,0.0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = toX(p.r);
      const y = toY(p.v);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(toX(points[points.length - 1].r), pad.top + h);
    ctx.lineTo(toX(points[0].r), pad.top + h);
    ctx.closePath();
    ctx.fill();

    // Current position marker
    const curV = spatialPotential(radialPos);
    const mx = toX(radialPos);
    const my = toY(curV);

    // Pulse ring
    ctx.strokeStyle = "rgba(255,215,0,0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(mx, my, 10, 0, Math.PI * 2);
    ctx.stroke();

    // Dot
    ctx.shadowColor = "rgba(255,215,0,0.8)";
    ctx.shadowBlur = 15;
    ctx.fillStyle = "#ffd700";
    ctx.beginPath();
    ctx.arc(mx, my, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Axis labels
    ctx.fillStyle = "rgba(180,200,220,0.6)";
    ctx.font = "12px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("r / rₛ", pad.left + w / 2, pad.top + h + 46);

    ctx.save();
    ctx.translate(14, pad.top + h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("V(r)", 0, 0);
    ctx.restore();

    // Tick labels
    ctx.fillStyle = "rgba(180,200,220,0.4)";
    ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    for (let r = 0; r <= 4; r++) {
      ctx.fillText(r.toString(), toX(r), pad.top + h + 16);
    }

    // Region labels
    ctx.font = "italic 11px 'Cormorant Garamond', Georgia, serif";
    ctx.fillStyle = "rgba(0,212,255,0.5)";
    ctx.fillText("inside BH", pad.left + w * 0.1, pad.top + 18);
    ctx.fillStyle = "rgba(180,200,220,0.3)";
    ctx.fillText("exterior", pad.left + w * 0.65, pad.top + 18);
  }, [radialPos, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
    />
  );
}

// ── 3D Sombrero ─────────────────────────────────────────────────
function SombreroViz({ radialPos, width, height }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const meshRef = useRef(null);
  const wireRef = useRef(null);
  const rendererRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(3.5, 2.8, 3.5);
    camera.lookAt(0, -0.3, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const amb = new THREE.AmbientLight(0x334466, 0.6);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0x00d4ff, 0.8);
    dir.position.set(3, 5, 3);
    scene.add(dir);
    const dir2 = new THREE.DirectionalLight(0xffd700, 0.4);
    dir2.position.set(-3, 3, -2);
    scene.add(dir2);
    const point = new THREE.PointLight(0x8844ff, 0.5, 10);
    point.position.set(0, 2, 0);
    scene.add(point);

    // Create parametric geometry
    const res = 80;
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    const indices = [];

    const phiRange = 2.0;
    for (let i = 0; i <= res; i++) {
      for (let j = 0; j <= res; j++) {
        const u = (i / res) * 2 - 1;
        const v = (j / res) * 2 - 1;
        const phi1 = u * phiRange;
        const phi2 = v * phiRange;
        const y = sombreroHeight(phi1, phi2, LAMBDA_SM);
        vertices.push(phi1, y, phi2);
        colors.push(0, 0, 0); // placeholder
      }
    }

    for (let i = 0; i < res; i++) {
      for (let j = 0; j < res; j++) {
        const a = i * (res + 1) + j;
        const b = a + 1;
        const c = (i + 1) * (res + 1) + j;
        const d = c + 1;
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
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

    // Wireframe
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

    // Rotation
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

    const lambda = effectiveLambda(radialPos);
    const res = 80;
    const phiRange = 2.0;
    const pos = mesh.geometry.attributes.position.array;
    const col = mesh.geometry.attributes.color.array;

    let yMin = Infinity, yMax = -Infinity;
    const yVals = [];
    
    for (let i = 0; i <= res; i++) {
      for (let j = 0; j <= res; j++) {
        const idx = i * (res + 1) + j;
        const u = (i / res) * 2 - 1;
        const v = (j / res) * 2 - 1;
        const phi1 = u * phiRange;
        const phi2 = v * phiRange;
        const y = sombreroHeight(phi1, phi2, lambda);
        pos[idx * 3 + 1] = y;
        yVals.push(y);
        if (y < yMin) yMin = y;
        if (y > yMax) yMax = y;
      }
    }

    // Color by height
    for (let i = 0; i < yVals.length; i++) {
      const t = (yVals[i] - yMin) / (yMax - yMin + 0.001);
      // Deep blue at bottom, cyan in middle, gold at top
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

    // Update wireframe too
    if (wire) {
      const wPos = wire.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i++) {
        wPos[i] = pos[i];
      }
      wire.geometry.attributes.position.needsUpdate = true;
    }
  }, [radialPos]);

  return <div ref={mountRef} style={{ width, height }} />;
}

// ── Lambda Gauge ─────────────────────────────────────────────────
function LambdaGauge({ radialPos }) {
  const lambda = effectiveLambda(radialPos);
  const ratio = lambda / LAMBDA_SM;
  const isMinimum = ratio < 0.35;

  return (
    <div style={{ textAlign: "center", padding: "0 16px" }}>
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: "rgba(180,200,220,0.5)",
          letterSpacing: 2,
          marginBottom: 8,
          textTransform: "uppercase",
        }}
      >
        Quartic Coupling
      </div>
      <div
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 36,
          fontWeight: 300,
          color: isMinimum ? "#ffd700" : "#00d4ff",
          transition: "color 0.5s ease",
          lineHeight: 1,
        }}
      >
        λ{ratio < 0.35 ? (
          <span style={{ fontSize: 20, verticalAlign: "super" }}>/5</span>
        ) : (
          <span style={{ fontSize: 20, verticalAlign: "super" }}>
            ×{ratio.toFixed(2)}
          </span>
        )}
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: 200,
          height: 3,
          background: "rgba(0,212,255,0.1)",
          borderRadius: 2,
          margin: "12px auto 0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${ratio * 100}%`,
            height: "100%",
            background: isMinimum
              ? "linear-gradient(90deg, #ffd700, #ffaa00)"
              : "linear-gradient(90deg, #00d4ff, #0088ff)",
            borderRadius: 2,
            transition: "width 0.3s ease, background 0.5s ease",
          }}
        />
      </div>
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10,
          color: isMinimum ? "rgba(255,215,0,0.7)" : "rgba(180,200,220,0.3)",
          marginTop: 6,
          transition: "color 0.5s ease",
          height: 14,
        }}
      >
        {isMinimum ? "AT POTENTIAL MINIMUM — SM DEVIATION" : ""}
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────
export default function EmergentHiggs() {
  const [radialPos, setRadialPos] = useState(2.0);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDims({
          w: containerRef.current.clientWidth,
          h: window.innerHeight,
        });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const isMobile = dims.w < 768;
  const panelW = isMobile ? dims.w - 32 : Math.min((dims.w - 80) / 2, 560);
  const panelH = isMobile ? 260 : 340;

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 50% 20%, #0d1117 0%, #060610 50%, #020208 100%)",
        color: "#e0e8f0",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@300;400&display=swap"
        rel="stylesheet"
      />

      <StarField />

      {/* Subtle radial glow */}
      <div
        style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          width: 800,
          height: 800,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(0,50,120,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {/* ── Header ── */}
        <header
          style={{
            textAlign: "center",
            padding: isMobile ? "40px 20px 20px" : "60px 40px 30px",
            borderBottom: "1px solid rgba(0,212,255,0.08)",
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: 4,
              color: "rgba(0,212,255,0.5)",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Interactive Visualization
          </div>
          <h1
            style={{
              fontSize: isMobile ? 28 : 44,
              fontWeight: 300,
              lineHeight: 1.15,
              margin: "0 auto",
              maxWidth: 700,
              letterSpacing: -0.5,
            }}
          >
            Emergent Higgs Field
            <br />
            <span style={{ color: "#00d4ff" }}>
              & the Schwarzschild Black Hole
            </span>
          </h1>
          <div
            style={{
              marginTop: 16,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              color: "rgba(180,200,220,0.5)",
            }}
          >
            Dragana Pilipović &nbsp;·&nbsp; Particles 2026, 9(2), 37
            &nbsp;·&nbsp; CERN CMS Collaboration
          </div>
          <p
            style={{
              maxWidth: 640,
              margin: "20px auto 0",
              fontSize: isMobile ? 15 : 17,
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.6,
              color: "rgba(200,210,220,0.65)",
            }}
          >
            The electroweak potential mapped simultaneously in physical space
            near a Schwarzschild black hole and across electroweak field space —
            revealing that the sombrero hat potential is position-dependent, with
            the quartic coupling λ reduced to λ/5 at the spatial potential
            minima.
          </p>
        </header>

        {/* ── Visualization ── */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: isMobile ? 16 : 32,
            padding: isMobile ? "24px 16px" : "40px 32px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* Left: V(r) */}
          <div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                letterSpacing: 3,
                color: "rgba(0,212,255,0.6)",
                textTransform: "uppercase",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Spatial Potential V(r)
            </div>
            <div
              style={{
                background: "rgba(8,12,24,0.7)",
                border: "1px solid rgba(0,212,255,0.1)",
                borderRadius: 8,
                padding: 8,
                backdropFilter: "blur(10px)",
              }}
            >
              {panelW > 0 && (
                <SpatialPlot
                  radialPos={radialPos}
                  width={panelW}
                  height={panelH}
                />
              )}
            </div>
            <div
              style={{
                textAlign: "center",
                marginTop: 10,
                fontSize: 13,
                fontStyle: "italic",
                color: "rgba(180,200,220,0.4)",
              }}
            >
              Deep well inside rₛ &nbsp;·&nbsp; Shallow well at accretion disk
            </div>
          </div>

          {/* Right: Sombrero */}
          <div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                letterSpacing: 3,
                color: "rgba(0,212,255,0.6)",
                textTransform: "uppercase",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Electroweak Sombrero Potential
            </div>
            <div
              style={{
                background: "rgba(8,12,24,0.7)",
                border: "1px solid rgba(0,212,255,0.1)",
                borderRadius: 8,
                padding: 8,
                backdropFilter: "blur(10px)",
              }}
            >
              {panelW > 0 && (
                <SombreroViz
                  radialPos={radialPos}
                  width={panelW}
                  height={panelH}
                />
              )}
            </div>
            <div
              style={{
                textAlign: "center",
                marginTop: 10,
                fontSize: 13,
                fontStyle: "italic",
                color: "rgba(180,200,220,0.4)",
              }}
            >
              Shape morphs with radial position — VEV conserved
            </div>
          </div>
        </div>

        {/* ── Slider & Metrics ── */}
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
            padding: isMobile ? "16px 20px 0" : "16px 32px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: "rgba(180,200,220,0.4)",
              marginBottom: 6,
            }}
          >
            <span>r = 0</span>
            <span style={{ color: "rgba(255,215,0,0.7)", fontSize: 13 }}>
              r / rₛ = {radialPos.toFixed(2)}
            </span>
            <span>r = 4rₛ</span>
          </div>

          {/* Custom slider */}
          <div style={{ position: "relative", height: 32 }}>
            <div
              style={{
                position: "absolute",
                top: 14,
                left: 0,
                right: 0,
                height: 3,
                background: "rgba(0,212,255,0.12)",
                borderRadius: 2,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 14,
                left: 0,
                width: `${((radialPos - 0.05) / 3.95) * 100}%`,
                height: 3,
                background: "linear-gradient(90deg, #00d4ff, #ffd700)",
                borderRadius: 2,
                transition: "width 0.05s ease",
              }}
            />
            <input
              type="range"
              min={0.05}
              max={4.0}
              step={0.01}
              value={radialPos}
              onChange={(e) => setRadialPos(parseFloat(e.target.value))}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 32,
                opacity: 0,
                cursor: "pointer",
                zIndex: 10,
              }}
            />
            {/* Thumb indicator */}
            <div
              style={{
                position: "absolute",
                top: 8,
                left: `calc(${((radialPos - 0.05) / 3.95) * 100}% - 8px)`,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#ffd700",
                boxShadow: "0 0 16px rgba(255,215,0,0.5), 0 0 4px rgba(255,215,0,0.8)",
                pointerEvents: "none",
                transition: "left 0.05s ease",
              }}
            />
          </div>

          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "rgba(180,200,220,0.35)",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Drag to traverse radial distance from black hole center
          </div>
        </div>

        {/* ── Metrics Row ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: isMobile ? 24 : 64,
            padding: isMobile ? "32px 16px" : "48px 32px",
            flexWrap: "wrap",
          }}
        >
          <LambdaGauge radialPos={radialPos} />

          <div style={{ textAlign: "center", padding: "0 16px" }}>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                color: "rgba(180,200,220,0.5)",
                letterSpacing: 2,
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              Higgs VEV
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 36,
                fontWeight: 300,
                color: "#e0e8f0",
                lineHeight: 1,
              }}
            >
              246
              <span style={{ fontSize: 16, marginLeft: 4, color: "rgba(180,200,220,0.5)" }}>
                GeV
              </span>
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: "rgba(0,212,255,0.5)",
                marginTop: 12,
              }}
            >
              CONSERVED ACROSS ALL r
            </div>
          </div>

          <div style={{ textAlign: "center", padding: "0 16px" }}>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                color: "rgba(180,200,220,0.5)",
                letterSpacing: 2,
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              Spatial Potential
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 36,
                fontWeight: 300,
                color:
                  spatialPotential(radialPos) < -0.3
                    ? "#00d4ff"
                    : spatialPotential(radialPos) > 0.3
                    ? "#ff6666"
                    : "#e0e8f0",
                lineHeight: 1,
                transition: "color 0.5s ease",
              }}
            >
              {spatialPotential(radialPos) > 0 ? "+" : ""}
              {spatialPotential(radialPos).toFixed(3)}
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: "rgba(180,200,220,0.3)",
                marginTop: 12,
              }}
            >
              V(r) AT CURRENT POSITION
            </div>
          </div>
        </div>

        {/* ── Key Insight ── */}
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            padding: isMobile ? "24px 20px 40px" : "32px 40px 60px",
            textAlign: "center",
            borderTop: "1px solid rgba(0,212,255,0.08)",
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: 3,
              color: "rgba(255,215,0,0.5)",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Central Result
          </div>
          <p
            style={{
              fontSize: isMobile ? 16 : 19,
              fontWeight: 300,
              lineHeight: 1.7,
              color: "rgba(200,210,220,0.75)",
              margin: 0,
            }}
          >
            The Schwarzschild metric emerges as a purely statistical structure
            from stochastic spacetime. At the potential minima — inside the black
            hole and at the accretion disk — the electroweak quartic coupling
            shifts from{" "}
            <span style={{ color: "#00d4ff", fontStyle: "italic" }}>λ</span> to{" "}
            <span style={{ color: "#ffd700", fontStyle: "italic" }}>λ/5</span>,
            a consequence of VEV conservation when scalar field perturbations
            dominate. The Higgs field itself relates directly to stochastic
            spacetime fields normalized by the Schwarzschild radius.
          </p>
          <div
            style={{
              marginTop: 24,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: "rgba(180,200,220,0.3)",
            }}
          >
            doi:10.3390/particles9020037 &nbsp;·&nbsp; Published April 3, 2026
          </div>
        </div>
      </div>
    </div>
  );
}
