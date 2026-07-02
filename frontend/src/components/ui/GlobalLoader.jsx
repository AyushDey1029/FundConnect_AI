import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import loadingVideo from '../../assets/Loading page.mp4';

const GlobalLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loading screen for 2.5 seconds to let the video play
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <video
              src={loadingVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-90"
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Render children immediately underneath, so they load in background */}
      {children}
    </>
  );
};

export default GlobalLoader;
