import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Home";
import Work from "./Work";
import About from "./About";
import Contact from "./Contact";
import ProjectDetail from "./ProjectDetail";

function Portfolio() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const frame = requestAnimationFrame(() => {
      document.querySelector(location.hash)?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [location.hash]);

  return (
    <>
      <Home />
      <Work />
      <About />
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/project/:slug" element={<ProjectDetail />} />
    </Routes>
  );
}
