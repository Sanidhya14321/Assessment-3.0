import { useEffect, useRef, useState } from "react";
import React from "react";

export default function VideoBackground() {
  const [frameIndex, setFrameIndex] = useState(0);
  const totalFrames = 500;
  const frames = useRef([]);

  // Preload the first frame
  useEffect(() => {
    const img = new Image();
    img.src = `/VideoBG1/x %281%29.jpg`; // removed space before %
    frames.current[0] = img;
    setFrameIndex(0);
  }, []);

  // Lazy load a specific frame
  const loadFrame = (index) => {
    if (!frames.current[index]) {
      const img = new Image();
      img.src = `/VideoBG1/x %28${index + 1}%29.jpg`; // +1 because index starts at 0
      frames.current[index] = img;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;

      // Map scroll position to frame index
      const scrollFraction = scrollTop / maxScroll;
      const newFrameIndex = Math.min(
        totalFrames - 1,
        Math.floor(scrollFraction * totalFrames)
      );

      loadFrame(newFrameIndex);
      setFrameIndex(newFrameIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className=" overflow-x-hidden overflow-y-hidden relative h-[600vh]"
      style={{ backgroundColor: "black" }}
    >
      {frames.current[frameIndex] && (
        <img
          src={frames.current[frameIndex].src}
          alt="background"
          className="fixed top-0 left-0 w-full h-full object-cover blur-[2px]"
          draggable="false"
          style={{
            imageRendering: "high-quality",
          }}
        />
      )}
    </div>
  );
}
