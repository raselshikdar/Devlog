import { useState, useEffect } from "react";

export default function ReadingProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateProgress);

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div
      style={{
        width: `${scrollProgress}%`,
        height: "5px", // Adjust the height for the bar
        backgroundColor: "#1dd1a1", // The progress bar color
        position: "fixed",
        top: "60px", // Adjust to position below the navbar
        left: "0",
        zIndex: "9999", // Make sure it's above content
        transition: "width 0.2s ease-out",
      }}
    ></div>
  );
}
