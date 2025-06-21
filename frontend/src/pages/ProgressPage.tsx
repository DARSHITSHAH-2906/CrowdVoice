// src/pages/InProgressPage.tsx
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import inProgressAnimation from '../assets/animations/inProgress.json';

const InProgressPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white px-4">
            <div className="w-full max-w-md">
                {/* <Lottie animationData={inProgressAnimation} loop={true} /> */}
                 <DotLottieReact
      src="https://lottie.host/73a67fda-2768-4118-ba8c-d5841d8bf81e/qK6bP7bu0H.json"
      loop
      autoplay
    />
            </div>
            <h1 className="text-4xl font-bold mt-6 mb-3 text-white animate-pulse">In Progress</h1>
            <p className="text-gray-400 text-center max-w-xl text-lg">
                We’re currently working on this section. Hang tight, it’ll be worth the wait!
            </p>
            <button
                onClick={() => window.history.back()}
                className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 cursor-pointer transition-all duration-200 rounded-lg text-white text-sm"
            >
                Go Back
            </button>
        </div>
    );
};

export default InProgressPage;
