import React, { useState, useEffect, useCallback, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import PropTypes from "prop-types";

const Page = React.forwardRef((props, ref) => {
  return (
    <div className="relative demoPage" ref={ref}>
      <div className="h-full w-full bg-white p-2">
        <img
          src={props.src}
          alt={`Page ${props.number}`}
          className={`w-full h-full object-contain ${
            props.loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={props.onLoad}
          onError={props.onError}
        />
      </div>
    </div>
  );
});

Page.displayName = "Page";

Page.propTypes = {
  src: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  loaded: PropTypes.bool.isRequired,
  onLoad: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

const PhotoBook = () => {
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const bookRef = useRef();
  const isMobileRef = useRef(window.innerWidth <= 768);

  const totalImages = 38;
  const defaultPhotoUrl = "/api/placeholder/800/600?text=Memory";

  const pages = useRef(
    Array.from({ length: totalImages }, (_, i) => ({
      id: i,
      src: `/images/webp/${i + 1}.webp`,
    }))
  ).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mainImageLoaded = loadedImages.has("/images/webp/14.webp");
    const allPagesLoaded = pages.every(
      (page) => loadedImages.has(page.src) || loadedImages.has(defaultPhotoUrl)
    );

    if (mainImageLoaded && allPagesLoaded) {
      setImagesLoaded(true);
    }
  }, [loadedImages, defaultPhotoUrl]);

  const handleImageLoad = useCallback((src) => {
    setLoadedImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(src);
      return newSet;
    });
  }, []);

  const onFlip = useCallback((e) => {
    setCurrentPageNumber(e.data);
  }, []);

  const handleNext = (e) => {
    e.preventDefault();
    bookRef.current.pageFlip().flipNext();
  };

  const handlePrev = (e) => {
    e.preventDefault();
    bookRef.current.pageFlip().flipPrev();
  };

  useEffect(() => {
    const handlePageFlip = (e) => {
      e.preventDefault();
      const currentScroll = window.scrollY;
      requestAnimationFrame(() => {
        window.scrollTo(0, currentScroll);
      });
    };

    document.addEventListener("click", handlePageFlip, { passive: false });

    return () => {
      document.removeEventListener("click", handlePageFlip);
    };
  }, []);

  // if (!imagesLoaded) {
  //   return (
  //     <div
  //       className="min-h-screen w-full flex items-center justify-center"
  //       style={{ background: "#cef1f0" }}
  //     >
  //       <div className="text-center">
  //         <div className="loading-spinner mb-4"></div>
  //         <div className="text-teal-700">載入中...</div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen w-full" style={{ background: "#cef1f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

        .book-title {
          color: var(--text-color);
          font-size: 3.5rem;
          font-weight: bold;
          font-family: 'Dancing Script', cursive;
          text-shadow: 2px 2px 4px rgba(44, 126, 124, 0.2);
          letter-spacing: 2px;
          background: linear-gradient(45deg, var(--text-color), var(--accent-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          padding: 0.5rem;
          margin: 0;
          line-height: 1.2;
          background-clip: text;
        }

        .main-image-container {
          aspect-ratio: 9/12;
          width: 100%;
          overflow: hidden;
          border-radius: 0.5rem;
          background: white;
        }

        :root {
          --base-color: #cef1f0;
          --darker-shade: #9ed4d3;
          --lighter-shade: #e5f8f7;
          --accent-color: #7fc7c5;
          --text-color: #2c7e7c;
        }
      `}</style>

      <div className="main-container p-4 md:p-8 max-w-6xl mx-auto">
        <div className="book-header bg-white rounded-lg p-4 md:p-8 mb-8 shadow-lg">
          <div className="mb-4 main-image-container">
            <div className="main-image relative w-full h-full">
              <img
                src="/images/webp/14.webp"
                alt="Main Photo"
                className={`absolute inset-0 w-full h-full object-contain ${
                  loadedImages.has("/images/webp/14.webp") ? "loaded" : ""
                }`}
                onLoad={() => handleImageLoad("/images/webp/14.webp")}
                onError={(e) => {
                  e.target.src = defaultPhotoUrl;
                  handleImageLoad(defaultPhotoUrl);
                }}
              />
            </div>
          </div>

          <div className="text-center mb-2">
            <h1 className="book-title">Merry Story</h1>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-teal-500 hover:bg-teal-600 text-white rounded-r-lg shadow-lg transition-all duration-200 focus:outline-none"
            aria-label="Previous page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-teal-500 hover:bg-teal-600 text-white rounded-l-lg shadow-lg transition-all duration-200 focus:outline-none"
            aria-label="Next page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <HTMLFlipBook
            width={isMobileRef.current ? 300 : 500}
            height={isMobileRef.current ? 400 : 600}
            size="fixed"
            showCover={false}
            maxShadowOpacity={0.5}
            mobileScrollSupport={true}
            onFlip={onFlip}
            className="mx-auto"
            ref={bookRef}
            usePortrait={true}
            startPage={0}
            drawShadow={true}
            flippingTime={1000}
            useMouseEvents={true}
            swipeDistance={30}
            clickEventForward={true}
          >
            {pages.map((page) => (
              <Page
                key={page.id}
                number={page.id + 1}
                src={page.src}
                loaded={loadedImages.has(page.src)}
                onLoad={() => handleImageLoad(page.src)}
                onError={(e) => {
                  e.target.src = defaultPhotoUrl;
                  handleImageLoad(defaultPhotoUrl);
                }}
              />
            ))}
          </HTMLFlipBook>

          {showHint && (
            <div className="absolute inset-x-0 top-4 text-center bg-teal-500 text-white py-2 rounded-md mx-4">
              點擊或拖曳翻頁
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <span className="bg-teal-500 text-white px-6 py-2 rounded-full inline-block">
            {currentPageNumber === 0
              ? "封面"
              : `第 ${currentPageNumber} 頁，共 ${totalImages} 頁`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PhotoBook;
