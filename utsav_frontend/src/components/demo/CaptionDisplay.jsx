import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CaptionDisplay({ caption, position, size, highContrast }) {
  if (!caption) return null;

  const positionStyles = {
    bottom: "bottom-8",
    top: "top-8",
    middle: "top-1/2 -translate-y-1/2"
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={caption}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`absolute left-0 right-0 ${positionStyles[position] || positionStyles.bottom} px-4 z-10 flex justify-center`}
      >
        <div 
          className={`max-w-4xl px-6 py-3 rounded-lg shadow-2xl ${
            highContrast 
              ? 'bg-black text-white border-2 border-white' 
              : 'bg-black/90 text-white backdrop-blur-sm'
          }`}
          style={{ fontSize: `${size}px` }}
        >
          <p className="text-center font-medium leading-relaxed">
            {caption}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}