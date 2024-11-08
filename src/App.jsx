import React, { useRef, useEffect } from "react";
import PhotoBook from "./components/PhotoBook";
import Navbar from "./components/ui/Navbar";
import MessageBoard from "./components/MessageBoard";
import music from "./assets/music.mp3";

function App() {
  const audioRef = useRef(null);

  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error);
        });
      }
      window.removeEventListener("click", handleUserInteraction);
    };

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
      {/* <MessageBoard /> */}
    </>
  );
}

export default App;
