import { useState, useEffect } from "react";

const ReadingProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateProgress = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    setScrollProgress(progress);
  };

  useEffect(() => {
    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${scrollProgress}%`,
        height: "5px",
        backgroundColor: "#1dd1a1", // Updated color here
        zIndex: 1000,
      }}
    />
  );
};

export default ReadingProgressBar;
