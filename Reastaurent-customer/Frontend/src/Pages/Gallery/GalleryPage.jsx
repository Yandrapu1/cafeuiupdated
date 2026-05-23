import { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "../../config/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/gallery`);
        const data = await response.json();
        if (data.success) {
          setImages(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch gallery images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback((e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-theme-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="mb-4 font-sans text-sm font-bold uppercase tracking-[0.2em] text-theme-accent">
            Atmosphere
          </h2>
          <h1 className="font-serif text-4xl font-bold text-theme-text md:text-5xl">
            Inside <span className="italic text-theme-accent">Bagel Cafe</span>
          </h1>
          <p className="mt-4 mx-auto max-w-xl text-theme-text-muted">
            Take a look at our cozy interiors, freshly baked goods, and the passionate team behind your daily coffee.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-theme-accent border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <motion.div
                key={img.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setSelectedIndex(i)}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-theme-surface shadow-sm border border-theme-border cursor-pointer"
              >
                <img
                  src={img.url}
                  alt={img.title || "Gallery Image"}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-theme-border opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-4">
                  <span className="text-white font-sans text-sm font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {img.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-theme-border backdrop-blur-sm">
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute right-6 top-6 z-50 text-white/50 hover:text-white transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            
            <button
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-50 p-4 text-white/50 hover:text-white transition-colors hidden sm:block"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>
            
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-h-[80vh] max-w-[90vw] outline-none"
            >
              <img
                src={images[selectedIndex].url}
                alt={images[selectedIndex].title || "Gallery Image"}
                className="max-h-[80vh] w-auto max-w-full rounded-lg shadow-2xl"
              />
              {images[selectedIndex].title && (
                <div className="absolute -bottom-10 left-0 text-white/80 font-sans text-sm">
                  {images[selectedIndex].title}
                </div>
              )}
            </motion.div>

            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-50 p-4 text-white/50 hover:text-white transition-colors hidden sm:block"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
