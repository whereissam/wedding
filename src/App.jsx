import React, { useRef, useEffect } from "react";
import PhotoBook from "./components/PhotoBook";
import Navbar from "./components/ui/Navbar";
import music from "./assets/music.mp3";

function App() {
  const audioRef = useRef(null);

  useEffect(() => {
    // Attempt to play the audio after a user interaction (e.g., a button click)
    const handleUserInteraction = () => {
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error);
        });
      }
      // Remove the event listener after initial interaction
      window.removeEventListener("click", handleUserInteraction);
    };

    // Add an event listener to detect user interaction
    window.addEventListener("click", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
    };
  }, []);

  return (
    <>
      <Navbar />
      <audio ref={audioRef} src={music} loop />
      <PhotoBook />
    </>
  );
}

export default App;
