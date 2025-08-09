import { useEffect, useRef, useState } from "react";
import React from "react";

export default function VideoBackground() {
  const [frameIndex, setFrameIndex] = useState(0);
  const totalFrames = 200;
  const frames = useRef([]);
  const lastScrollY = useRef(0); // store previous scroll position

  // Preload frames
  useEffect(() => {
    const loadedFrames = [];
    for (let i = 1; i <= totalFrames; i++) {
      const frameNum = String(i).padStart(3, "0");
      const img = new Image();
      img.src = `/VideoBG/ezgif-frame-${frameNum}.jpg`;
      loadedFrames.push(img);
    }
    frames.current = loadedFrames;
    setFrameIndex(0); // show first frame immediately
  }, []);

  // Scroll velocity-based frame control
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (scrollDelta > 0) {
        // scrolling down → next frame
        setFrameIndex((prev) => (prev + 1) % totalFrames);
      } else if (scrollDelta < 0) {
        // scrolling up → previous frame
        setFrameIndex((prev) =>
          prev === 0 ? totalFrames - 1 : prev - 1
        );
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalFrames]);

  return (
    <div
      className="w-screen  overflow-hidden relative"
      style={{ backgroundColor: "black" }}
    >
      {frames.current.length > 0 && (
        <img
          src={frames.current[frameIndex]?.src}
          alt="background"
          className="fixed top-0 left-0 w-full h-full object-cover blur-sm"
          draggable="false"
        />
      )}

      {/* Minimal scrollable space */}
      <div style={{ height: "500vh" }}></div>
    </div>
  );
}
