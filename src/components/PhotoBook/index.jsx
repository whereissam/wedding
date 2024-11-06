import { useState, useRef, useEffect } from "react";
import "./styles.css";

const PhotoBook = () => {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const bookRef = useRef(null);
  const totalPages = 5;

  const nextPage = () => {
    if (isAnimating || currentPageNumber >= totalPages * 2) return;
    setIsAnimating(true);

    const pageToFlip =
      bookRef.current?.getElementsByClassName("page")[
        Math.floor((currentPageNumber - 1) / 2)
      ];
    if (pageToFlip) {
      pageToFlip.classList.add("flipped");
    }

    setTimeout(() => {
      setIsAnimating(false);
      setCurrentPageNumber((prev) => prev + 2);
    }, 1000);
  };

  const prevPage = () => {
    if (isAnimating || currentPageNumber <= 1) return;
    setIsAnimating(true);

    const pageToUnflip =
      bookRef.current?.getElementsByClassName("page")[
        Math.floor((currentPageNumber - 2) / 2)
      ];
    if (pageToUnflip) {
      pageToUnflip.classList.remove("flipped");
    }

    setTimeout(() => {
      setIsAnimating(false);
      setCurrentPageNumber((prev) => prev - 2);
    }, 1000);
  };

  useEffect(() => {
    const initializeBook = () => {
      if (!bookRef.current) return;

      // Create pages
      for (let i = 0; i < totalPages; i++) {
        const page = document.createElement("div");
        page.className = "page";
        page.style.zIndex = totalPages - i;

        const front = document.createElement("div");
        front.className = "front";
        front.innerHTML = `<img src="/api/placeholder/800/600" alt="Page ${
          i * 2 + 1
        }">`;

        const back = document.createElement("div");
        back.className = "back";
        back.innerHTML = `<img src="/api/placeholder/800/600" alt="Page ${
          i * 2 + 2
        }">`;

        page.appendChild(front);
        page.appendChild(back);

        page.addEventListener("click", () => {
          if (!isAnimating && !page.classList.contains("flipped")) {
            nextPage();
          }
        });

        bookRef.current.appendChild(page);
      }
    };

    // Initialize the book
    initializeBook();

    // Hide hint after 4 seconds
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 4000);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (bookRef.current) {
        const pages = bookRef.current.getElementsByClassName("page");
        while (pages.length > 0) {
          pages[0].remove();
        }
      }
    };
  }, []); // Empty dependency array since we only want to run this once

  return (
    <div className="container">
      <div className="top-gallery">
        <img
          src="/api/placeholder/800/600"
          alt="Main Photo"
          className="main-image"
        />
        <div className="sub-images">
          <img
            src="/api/placeholder/400/300"
            alt="Sub Photo 1"
            className="sub-image"
          />
          <img
            src="/api/placeholder/400/300"
            alt="Sub Photo 2"
            className="sub-image"
          />
        </div>
      </div>

      <div className="header">
        <h1>我們的故事</h1>
      </div>

      <div className="book" ref={bookRef}>
        <div className="controls">
          <button
            className="control-button prev-button"
            onClick={prevPage}
            disabled={currentPageNumber <= 1 || isAnimating}
          >
            <i className="arrow left"></i>
          </button>
          <button
            className="control-button next-button"
            onClick={nextPage}
            disabled={currentPageNumber >= totalPages * 2 || isAnimating}
          >
            <i className="arrow right"></i>
          </button>
        </div>
        {showHint && <div className="page-hint">點擊或使用箭頭按鈕翻頁</div>}
      </div>

      <div className="page-indicator">
        第 {currentPageNumber} 頁，共 {totalPages * 2} 頁
      </div>
    </div>
  );
};

export default PhotoBook;
