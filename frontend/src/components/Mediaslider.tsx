import React, { useState } from 'react';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';

const Mediaslider = ({ media }: { media: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isVideo = (url: string) => url.endsWith('.mp4') || url.includes('/video/');

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    media.length > 0 ? (
      <div className="relative mb-5 rounded-xl overflow-hidden w-full h-[340px] bg-black">
        {isVideo(media[currentIndex]) ? (
          <video
            key={media[currentIndex]}
            controls
            className="w-full h-full object-cover rounded-xl"
          >
            <source src={media[currentIndex]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={media[currentIndex]}
            alt={`media-${currentIndex}`}
            className="w-full h-full object-cover rounded-xl"
          />
        )}

        {media.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-[#2a2b3c]/60 hover:bg-[#2a2b3c]/80 text-white p-2 rounded-full"
            >
              <MdArrowBackIos size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-[#2a2b3c]/60 hover:bg-[#2a2b3c]/80 text-white p-2 rounded-full"
            >
              <MdArrowForwardIos size={20} />
            </button>
          </>
        )}
      </div>
    ) : <div>No media available</div>
  );
};

export default Mediaslider;
