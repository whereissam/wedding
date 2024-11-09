import { useState, useEffect, useCallback, useRef } from "react";

const PhotoBook = () => {
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const animationRef = useRef(null);
  const isMobileRef = useRef(window.innerWidth <= 768);

  const totalImages = 38;
  const totalPages = totalImages;
  const defaultPhotoUrl = "/api/placeholder/800/600?text=Memory";

  // Generate array of pages with memoization
  const pages = useRef(
    Array.from({ length: totalPages }, (_, i) => ({
      id: i,
      src: `/images/webp/${i + 1}.webp`,
    }))
  ).current;

  const nextPage = useCallback(() => {
    if (isAnimating || currentPageNumber >= totalPages - 1) return;
    setIsAnimating(true);

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(() => {
      setTimeout(() => {
        setIsAnimating(false);
        setCurrentPageNumber((prev) => Math.min(prev + 1, totalPages - 1));
      }, 600);
    });
  }, [isAnimating, currentPageNumber, totalPages]);

  const prevPage = useCallback(() => {
    if (isAnimating || currentPageNumber <= 0) return;
    setIsAnimating(true);

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(() => {
      setTimeout(() => {
        setIsAnimating(false);
        setCurrentPageNumber((prev) => Math.max(prev - 1, 0));
      }, 600);
    });
  }, [isAnimating, currentPageNumber]);

  const handleImageLoad = useCallback((src) => {
    requestAnimationFrame(() => {
      setLoadedImages((prev) => {
        const newSet = new Set(prev);
        newSet.add(src);
        return newSet;
      });
    });
  }, []);

  const createImagePromise = useCallback(
    (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          handleImageLoad(src);
          resolve(src);
        };
        img.onerror = () => {
          handleImageLoad(defaultPhotoUrl);
          resolve(defaultPhotoUrl);
        };
        img.src = src;
      });
    },
    [handleImageLoad]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const preloadImages = async () => {
      const essentialImages = [
        "/images/webp/6.webp", // Cover
        "/images/webp/14.webp", // Header
        ...Array.from({ length: 3 }, (_, i) => `/images/webp/${i + 1}.webp`),
      ];

      try {
        await Promise.all(essentialImages.map(createImagePromise));
        setImagesLoaded(true);

        const remainingImages = Array.from(
          { length: totalImages - 3 },
          (_, i) => `/images/webp/${i + 4}.webp`
        );

        const chunkSize = isMobileRef.current ? 3 : 6;
        for (let i = 0; i < remainingImages.length; i += chunkSize) {
          const chunk = remainingImages.slice(i, i + chunkSize);
          await new Promise((resolve) => setTimeout(resolve, 100));
          await Promise.all(chunk.map(createImagePromise));
        }
      } catch (error) {
        console.error("Error loading images:", error);
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, [createImagePromise, totalImages]);

  const preloadNearbyImages = useCallback(
    (currentPage) => {
      const preloadRange = isMobileRef.current ? 2 : 3;
      const start = Math.max(0, currentPage - preloadRange);
      const end = Math.min(totalPages - 1, currentPage + preloadRange);

      requestAnimationFrame(() => {
        for (let i = start; i <= end; i++) {
          const src = `/images/webp/${i + 1}.webp`;
          if (!loadedImages.has(src)) {
            createImagePromise(src);
          }
        }
      });
    },
    [loadedImages, totalPages, createImagePromise]
  );

  useEffect(() => {
    preloadNearbyImages(currentPageNumber);
  }, [currentPageNumber, preloadNearbyImages]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (!imagesLoaded) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ background: "#cef1f0" }}
      >
        <div className="text-center">
          <div className="loading-spinner mb-4"></div>
          <div className="text-teal-700">載入中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ background: "#cef1f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

        :root {
          --base-color: #cef1f0;
          --darker-shade: #9ed4d3;
          --lighter-shade: #e5f8f7;
          --accent-color: #7fc7c5;
          --text-color: #2c7e7c;
        }

        body {
          background: var(--base-color);
          margin: 0;
          padding: 0;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .main-container {
          background: var(--lighter-shade);
          border-radius: 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
          padding: 2rem;
          margin: 0 auto;
          max-width: 1200px;
        }

        .book {
          perspective: 3000px;
          transform-style: preserve-3d;
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 10px 30px rgba(44, 126, 124, 0.1);
          height: auto;
          aspect-ratio: 3/2;
          transform: translateZ(0);
          will-change: transform;
        }

        .book-header {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(44, 126, 124, 0.05);
        }

        .book-content {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform-origin: left center;
        }

        .cover {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform-origin: left center;
          transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
          cursor: pointer;
          background: white;
          backface-visibility: hidden;
          box-shadow: -5px 0 25px rgba(44, 126, 124, 0.1);
        }

        .page {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform-origin: left center;
          transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
          cursor: pointer;
          background: white;
          backface-visibility: hidden;
        }

        .page.flipped {
          transform: rotateY(-180deg);
        }

        .page-content {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          transform-style: preserve-3d;
          background: white;
          box-shadow: -5px 0 25px rgba(44, 126, 124, 0.1);
          overflow: hidden;
        }

        .page-front,
        .page-back {
          position: absolute;
          width: 100%;
          height: 100%;
          padding: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          background: white;
          overflow: hidden;
          border: 1px solid var(--lighter-shade);
          box-sizing: border-box;
        }

        .page-back {
          transform: rotateY(180deg);
          backface-visibility: hidden;
        }

        .image-container {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .image-container img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: 100%;
          max-height: 100%;
          width: 100%;
          height: 100%;
          object-fit: contain;
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
          will-change: opacity;
        }

        .image-container img.loaded {
          opacity: 1;
        }

        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent-color);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(44, 126, 124, 0.15);
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .nav-button:disabled {
          background: var(--darker-shade);
          opacity: 0.5;
          cursor: not-allowed;
        }

        .nav-button:hover:not(:disabled) {
          background: var(--text-color);
          transform: translateY(-50%) scale(1.05);
        }

        .nav-button.prev { left: 20px; }
        .nav-button.next { right: 20px; }

        .arrow {
          border: solid white;
          border-width: 0 2px 2px 0;
          display: inline-block;
          padding: 3px;
        }

        .arrow-left { transform: rotate(135deg); }
        .arrow-right { transform: rotate(-45deg); }

        .page-hint {
          background: var(--accent-color);
          color: white;
          font-weight: 500;
          border-radius: 0.5rem;
          padding: 0.5rem;
        }

        .page-number {
          background: var(--accent-color);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 1rem;
          font-weight: 500;
          display: inline-block;
          box-shadow: 0 4px 15px rgba(44, 126, 124, 0.1);
        }

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

        .main-image {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5f8f7;
          border-top: 3px solid #7fc7c5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .main-container {
            padding: 1rem;
          }

          .book {
            aspect-ratio: 4/3;
          }

          .book-header {
            padding: 1rem;
          }

          .page-front,
          .page-back {
            padding: 0.5rem;
          }

          .nav-button {
            width: 28px;
            height: 28px;
          }

          .nav-button.prev {
            left: 10px;
          }

          .nav-button.next {
            right: 10px;
          }

          .book-title {
            font-size: 2.5rem;
          }
        }
      `}</style>

      <div className="main-container">
        <div className="book-header">
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

        <div className="relative aspect-[3/2] book">
          <div className="book-content">
            {/* Cover */}
            <div
              className="cover"
              style={{
                transform:
                  currentPageNumber > 0 ? "rotateY(-180deg)" : "rotateY(0)",
                zIndex: currentPageNumber === 0 ? totalPages + 1 : 0,
              }}
              onClick={() => currentPageNumber === 0 && nextPage()}
            >
              <div className="page-front">
                <div className="image-container">
                  <img
                    src="/images/webp/6.webp"
                    alt="Cover"
                    className={`responsive-image ${loadedImages.has("/images/webp/6.webp") ? "loaded" : ""}`}
                    onLoad={() => handleImageLoad("/images/webp/6.webp")}
                    onError={(e) => {
                      e.target.src = defaultPhotoUrl;
                      handleImageLoad(defaultPhotoUrl);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Pages */}
            {pages.map((page, index) => {
              const isVisible = Math.abs(index - currentPageNumber) <= 2;
              const shouldPreload = Math.abs(index - currentPageNumber) <= 3;

              if (!isVisible) return null;

              return (
                <div
                  key={page.id}
                  className={`page ${index < currentPageNumber ? "flipped" : ""}`}
                  style={{
                    zIndex: totalPages - Math.abs(currentPageNumber - index),
                    visibility: isVisible ? "visible" : "hidden",
                  }}
                >
                  <div className="page-content">
                    <div
                      className="page-front"
                      onClick={() => index >= currentPageNumber && nextPage()}
                    >
                      <div className="image-container">
                        <img
                          src={page.src}
                          alt={`Page ${index + 1}`}
                          className={`responsive-image ${loadedImages.has(page.src) ? "loaded" : ""}`}
                          loading={shouldPreload ? "eager" : "lazy"}
                          onLoad={() => handleImageLoad(page.src)}
                          onError={(e) => {
                            e.target.src = defaultPhotoUrl;
                            handleImageLoad(defaultPhotoUrl);
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className="page-back"
                      onClick={() => index < currentPageNumber && prevPage()}
                    >
                      <div className="image-container">
                        {pages[index + 1] && (
                          <img
                            src={pages[index + 1].src}
                            alt={`Page ${index + 2}`}
                            className={`responsive-image ${loadedImages.has(pages[index + 1].src) ? "loaded" : ""}`}
                            loading={shouldPreload ? "eager" : "lazy"}
                            onLoad={() => handleImageLoad(pages[index + 1].src)}
                            onError={(e) => {
                              e.target.src = defaultPhotoUrl;
                              handleImageLoad(defaultPhotoUrl);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <button
            className="nav-button prev"
            onClick={prevPage}
            disabled={currentPageNumber <= 0 || isAnimating}
            aria-label="Previous page"
          >
            <i className="arrow arrow-left"></i>
          </button>
          <button
            className="nav-button next"
            onClick={nextPage}
            disabled={currentPageNumber >= totalPages - 1 || isAnimating}
            aria-label="Next page"
          >
            <i className="arrow arrow-right"></i>
          </button>

          {showHint && (
            <div className="absolute inset-x-0 top-4 text-center page-hint py-2 mx-4">
              點擊或使用箭頭按鈕翻頁
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <span className="page-number">
            {currentPageNumber === 0
              ? "封面"
              : `第 ${currentPageNumber} 頁，共 ${totalPages} 頁`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PhotoBook;
