import "katex/dist/katex.min.css";
import Header from "./paper/Header.jsx";
import Framework from "./paper/Framework.jsx";
import SymmetryBreaking from "./paper/SymmetryBreaking.jsx";
import BlackHole from "./paper/BlackHole.jsx";
import SombreroFamily from "./paper/SombreroFamily.jsx";
import Transition from "./paper/Transition.jsx";
import VevConservation from "./paper/VevConservation.jsx";
import Entropy from "./paper/Entropy.jsx";
import References from "./paper/References.jsx";

export default function Paper() {
  return (
    <div style={container}>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@300;400&display=swap"
        rel="stylesheet"
      />
      <Header />
      <Framework />
      <SymmetryBreaking />
      <BlackHole />
      <SombreroFamily />
      <Transition />
      <VevConservation />
      <Entropy />
      <References />
    </div>
  );
}

const container = {
  minHeight: "100vh",
  background: "radial-gradient(ellipse at 50% 0%, #0d1117 0%, #060610 50%, #020208 100%)",
  color: "#e0e8f0",
  fontFamily: "'Cormorant Garamond', Georgia, serif",
};
