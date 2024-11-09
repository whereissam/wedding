import React, { useState, useEffect, useRef } from "react";
import PhotoBook from "./components/PhotoBook";
import {
  MessageBoard,
  MessageList,
  MessageForm,
} from "./components/MessageBoard";
import Navbar from "./components/ui/Navbar";
import music from "./assets/music.mp3";

const App = () => {
  const { messages, loading, handleSubmit } = MessageBoard();
  const audioRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化音樂播放
  useEffect(() => {
    const initMusic = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = 0.5; // 設置適當的音量
          await audioRef.current.play();
          setIsMusicPlaying(true);
          setIsLoading(false);
        } catch (error) {
          console.log("Initial autoplay failed - waiting for user interaction");
          // 添加點擊事件來開始播放
          const startPlayback = async () => {
            try {
              await audioRef.current.play();
              setIsMusicPlaying(true);
              document.removeEventListener("click", startPlayback);
            } catch (err) {
              console.error("Playback failed:", err);
            }
          };
          document.addEventListener("click", startPlayback);
        }
      }
    };

    initMusic();

    // 清理函數
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // 監聽音樂播放狀態
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplay = () => {
        console.log("Music started playing");
        setIsMusicPlaying(true);
      };

      audioRef.current.onpause = () => {
        console.log("Music paused");
        setIsMusicPlaying(false);
      };

      audioRef.current.onended = () => {
        console.log("Music ended");
        setIsMusicPlaying(false);
      };
    }
  }, []);

  // 音樂控制函數
  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch((error) => {
          console.error("Play failed:", error);
        });
    } else {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#cef1f0" }}>
      <Navbar />

      {/* 音樂播放器 */}
      <audio ref={audioRef} src={music} loop preload="auto" />

      {/* 音樂控制按鈕 */}
      <button
        onClick={toggleMusic}
        className={`fixed bottom-4 left-4 z-50 bg-white p-3 rounded-full shadow-lg 
          hover:bg-gray-100 transition-all duration-200 flex items-center space-x-2
          ${isLoading ? "opacity-50" : "opacity-100"}`}
        disabled={isLoading}
      >
        <svg
          className={`w-6 h-6 ${isMusicPlaying ? "animate-pulse" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {!isMusicPlaying ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072M12 6c.34 0 .668.036.99.103M12 6a4.995 4.995 0 00-3.536 1.464M12 6v12m0 0c.34 0 .668-.036.99-.103m-.99.103a4.995 4.995 0 01-3.536-1.464M12 18c.34 0 .668-.036.99-.103"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M21.192 2.808a13 13 0 010 18.384"
            />
          )}
        </svg>
        <span className="text-sm">
          {isLoading
            ? "載入中..."
            : isMusicPlaying
              ? "背景音樂開啟"
              : "背景音樂關閉"}
        </span>
      </button>

      <PhotoBook />
      <div className="py-8" style={{ background: "#cef1f0" }}>
        <MessageForm onSubmit={handleSubmit} loading={loading} />
        <div className="mt-8">
          <MessageList messages={messages} />
        </div>
      </div>
    </div>
  );
};

export default App;
