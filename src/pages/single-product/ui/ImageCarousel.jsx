import { useState, useRef } from 'react';
import './imageCarousel.scss';

export default function ImageCarousel({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // No images fallback
  if (!images || images.length === 0) {
    return (
      <div className="image-carousel">
        <div className="image-carousel__placeholder">
          <p>이미지 없음</p>
        </div>
      </div>
    );
  }

  // Navigation
  const goToSlide = (index) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  const goToNext = () => {
    const nextIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const goToPrev = () => {
    const prevIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    setActiveIndex(prevIndex);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(distance) > threshold) {
      if (distance > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div
      className="image-carousel"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Image */}
      <div className="image-carousel__main">
        <img
          src={images[activeIndex]}
          alt={`Product ${activeIndex + 1}`}
          onError={(e) => {
            e.target.src =
              'https://placeholder.pics/svg/800/CCCCCC/000000/No%20Image';
          }}
        />

        {/* Image counter */}
        {images.length > 1 && (
          <div className="image-carousel__counter">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Pagination dots */}
      {images.length > 1 && (
        <div className="image-carousel__pagination">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`image-carousel__dot ${
                index === activeIndex ? 'image-carousel__dot--active' : ''
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
