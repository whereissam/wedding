import { useState, useEffect } from "react";
const fontStyle = { fontFamily: "Dancing Script, cursive" };

const PhotoBook = () => {
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const totalImages = 38;
  const totalPages = totalImages;
  const defaultPhotoUrl = "/api/placeholder/800/600?text=Memory";

  // Generate array of pages
  const pages = Array.from({ length: totalPages }, (_, i) => ({
    id: i,
    src: `/images/${i + 1}.jpg`,
  }));

  const nextPage = () => {
    if (isAnimating || currentPageNumber >= totalPages - 1) return;
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
      setCurrentPageNumber((prev) => Math.min(prev + 1, totalPages - 1));
    }, 600);
  };

  const prevPage = () => {
    if (isAnimating || currentPageNumber <= 0) return;
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
      setCurrentPageNumber((prev) => Math.max(prev - 1, 0));
    }, 600);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const preloadImages = () => {
      // Create array of image URLs
      const imageUrls = [
        "/images/6.jpg", // Cover
        "/images/14.jpg", // Top image
        ...Array.from({ length: 38 }, (_, i) => `/images/${i + 1}.jpg`),
      ];

      // Preload each image
      imageUrls.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    };

    preloadImages();
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imageUrls = [
          "/images/6.jpg",
          "/images/14.jpg",
          ...Array.from({ length: 38 }, (_, i) => `/images/${i + 1}.jpg`),
        ];

        await Promise.all(
          imageUrls.map(
            (url) =>
              new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = resolve; // Still resolve on error to not block loading
                img.src = url;
              })
          )
        );

        setImagesLoaded(true);
      } catch (error) {
        console.error("Error preloading images:", error);
        setImagesLoaded(true); // Set to true even on error to show content
      }
    };

    loadImages();
  }, []);

  if (!imagesLoaded) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={{ background: "#cef1f0" }}
      >
        <style>{`
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid var(--lighter-shade);
            border-top: 5px solid var(--accent-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div className="loading-spinner"></div>
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
        }

        .page-back {
          transform: rotateY(180deg);
          backface-visibility: hidden;
        }

        .image-container {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .responsive-image {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;  /* Reduced from 44px */
            height: 32px; /* Reduced from 44px */
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
  border-width: 0 2px 2px 0;  /* Reduced from 3px */
  display: inline-block;
  padding: 3px;  /* Reduced from 4px */
}

        .arrow-left { transform: rotate(135deg); }
        .arrow-right { transform: rotate(-45deg); }

        .page-hint {
          background: var(--accent-color) !important;
          color: white !important;
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
      `}</style>

      <div className="main-container">
        <div className="book-header">
          <div className="mb-8 main-image-container">
            <div className="w-full h-64 relative main-image">
              <img
                src="/images/14.jpg"
                alt="Main Photo"
                className="responsive-image"
                onError={(e) => {
                  e.target.src = defaultPhotoUrl;
                  e.target.onerror = null;
                }}
              />
            </div>
          </div>

          <div className="text-center mb-8">
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
                    src="/images/6.jpg"
                    alt="Cover"
                    className="responsive-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = defaultPhotoUrl;
                      e.target.onerror = null;
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Pages */}
            {pages.map((page, index) => {
              const isVisible = Math.abs(index - currentPageNumber) <= 2;

              return (
                isVisible && (
                  <div
                    key={page.id}
                    className={`page ${index < currentPageNumber ? "flipped" : ""}`}
                    style={{
                      zIndex: totalPages - Math.abs(currentPageNumber - index),
                      display: isVisible ? "block" : "none",
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
                            className="responsive-image"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = defaultPhotoUrl;
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className="page-back"
                        onClick={() => index < currentPageNumber && prevPage()}
                      >
                        <div className="image-container">
                          <img
                            src={pages[index + 1]?.src || defaultPhotoUrl}
                            alt={`Page ${index + 2}`}
                            className="responsive-image"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = defaultPhotoUrl;
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
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
