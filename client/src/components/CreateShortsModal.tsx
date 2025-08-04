import { useState, useEffect } from 'react';
import CreatePage from '@/pages/CreatePage';

interface CreateShortsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateShortsModal({ 
  isOpen, 
  onClose 
}: CreateShortsModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Handle entrance animation
  useEffect(() => {
    if (isOpen) {
      // Start from below screen
      setIsVisible(false);
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onClose();
      setIsAnimating(false);
    }, 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />
      
      {/* YouTube Shorts Style Modal */}
      <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 transition-all duration-700 ease-out ${
        isAnimating ? 'translate-y-full scale-95 opacity-0' : 
        isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-full scale-95 opacity-0'
      }`}>
        <div className="bg-white rounded-t-[32px] shadow-2xl overflow-hidden h-[90vh]">
          {/* Handle */}
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1 bg-unalon-300 rounded-full"></div>
          </div>
          
          {/* Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleClose}
              className="w-8 h-8 bg-unalon-100 rounded-full flex items-center justify-center hover:bg-unalon-200 transition-colors duration-200"
            >
              <span className="material-icons text-unalon-600 text-sm">close</span>
            </button>
          </div>
          
          {/* Create Page Content */}
          <div className="h-full overflow-y-auto">
            <CreatePage />
          </div>
        </div>
      </div>
    </>
  );
} 