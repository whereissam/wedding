import { useState, useEffect } from "react";

const PhotoBook = () => {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const totalPages = 19;

  const defaultPhotoUrl = "/api/placeholder/800/600?text=Memory";

  const pages = Array.from({ length: totalPages * 2 }, (_, i) => {
    const photoNumber = i + 1;
    return {
      id: photoNumber,
      src: photoNumber <= 38 ? `/images/${photoNumber}.jpg` : defaultPhotoUrl,
    };
  });

  const nextPage = () => {
    if (isAnimating || currentPageNumber >= totalPages) return;
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
      setCurrentPageNumber((prev) => Math.min(prev + 2, totalPages));
    }, 600);
  };

  const prevPage = () => {
    if (isAnimating || currentPageNumber <= 1) return;
    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
      setCurrentPageNumber((prev) => Math.max(prev - 2, 1));
    }, 600);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <style>{`
        .book {
          perspective: 3000px;
          transform-style: preserve-3d;
        }
        
        .page-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s ease-in-out;
          will-change: transform;
        }
        
        .page {
          position: absolute;
          width: 50%;
          height: 100%;
          right: 0;
          transform-origin: left center;
          transform-style: preserve-3d;
          transition: all 0.6s ease-in-out;
          cursor: pointer;
          background: white;
          will-change: transform;
        }

        .page.flipped {
          transform: rotateY(-180deg);
        }
        
        .page-front,
        .page-back {
          position: absolute;
          width: 100%;
          height: 100%;
          padding: 0;
          backface-visibility: hidden;
          background: white;
          transform-style: preserve-3d;
          overflow: hidden;
          will-change: transform;
        }

        .page-front {
          transform: rotateY(0deg);
          z-index: 1;
          box-shadow: inset -5px 0 25px rgba(0,0,0,0.1);
        }

        .page-back {
          transform: rotateY(180deg);
          box-shadow: inset 5px 0 25px rgba(0,0,0,0.1);
        }

        .page-content {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: white;
        }

        .page-content img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      `}</style>

      <div className="mb-8">
        <div className="w-full h-64 relative">
          <img
            src="/images/1.jpg"
            alt="Main Photo"
            className="absolute inset-0 w-full h-full object-contain rounded-lg shadow-lg"
            onError={(e) => {
              e.target.src = defaultPhotoUrl;
              e.target.onerror = null;
            }}
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">我們的故事</h1>
      </div>

      <div className="relative bg-white rounded-lg shadow-xl p-4">
        <div className="relative aspect-[3/2] book">
          <div className="absolute inset-0">
            {Array.from({ length: Math.ceil(totalPages / 2) }).map(
              (_, index) => {
                const pageNumber = index * 2 + 1;
                const isVisible = Math.abs(pageNumber - currentPageNumber) <= 4;

                return (
                  <div
                    key={pageNumber}
                    className="page-wrapper"
                    style={{
                      zIndex:
                        pageNumber < currentPageNumber
                          ? index
                          : totalPages - index,
                      display: isVisible ? "block" : "none",
                      pointerEvents: isAnimating ? "none" : "auto",
                    }}
                  >
                    <div
                      className={`page ${pageNumber < currentPageNumber ? "flipped" : ""}`}
                      onClick={
                        pageNumber >= currentPageNumber ? nextPage : prevPage
                      }
                    >
                      <div className="page-front">
                        <div className="page-content">
                          <img
                            src={pages[pageNumber - 1].src}
                            alt={`Page ${pageNumber}`}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = defaultPhotoUrl;
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                      </div>
                      <div className="page-back">
                        <div className="page-content">
                          <img
                            src={pages[pageNumber].src}
                            alt={`Page ${pageNumber + 1}`}
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
                );
              }
            )}
          </div>

          {/* Navigation controls */}
          <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-4 z-20">
            <button
              className="p-2 bg-white rounded-full border border-gray-700 shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={prevPage}
              disabled={currentPageNumber <= 1 || isAnimating}
            >
              ←
            </button>
            <button
              className="p-2 bg-white rounded-full border border-gray-700 shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={nextPage}
              disabled={currentPageNumber >= totalPages || isAnimating}
            >
              →
            </button>
          </div>

          {showHint && (
            <div className="absolute inset-x-0 top-4 text-center text-gray-600 bg-white bg-opacity-75 py-2">
              點擊或使用箭頭按鈕翻頁
            </div>
          )}
        </div>

        <div className="text-center mt-4 text-gray-600">
          第 {currentPageNumber}-{Math.min(currentPageNumber + 1, totalPages)}{" "}
          頁，共 {totalPages} 頁
        </div>
      </div>
    </div>
  );
};

export default PhotoBook;
