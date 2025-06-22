import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  productName: string;
}

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  productName
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageIndex, setImageIndex] = useState(currentIndex);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => prev + 90);
  };

  const handlePrevious = () => {
    setImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
    setScale(1);
    setRotation(0);
  };

  const handleNext = () => {
    setImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
    setScale(1);
    setRotation(0);
  };

  const resetTransform = () => {
    setScale(1);
    setRotation(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] max-h-[95vh] p-2 sm:p-4 m-2">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center justify-between text-sm sm:text-lg">
            <span className="font-semibold truncate pr-2">{productName}</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs sm:text-sm text-gray-500">
                {imageIndex + 1} de {images.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-red-100 hover:text-red-600 p-1 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: 'calc(95vh - 160px)', minHeight: '300px' }}>
          {/* Close Button - Top Right Corner */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 z-20 bg-white/90 hover:bg-white shadow-lg p-2 h-auto rounded-full"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-gray-700" />
          </Button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg p-1 sm:p-2 h-auto"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg p-1 sm:p-2 h-auto"
                onClick={handleNext}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </>
          )}

          {/* Image */}
          <div className="w-full h-full flex items-center justify-center overflow-hidden p-2">
            <img
              src={images[imageIndex]}
              alt={`${productName} - ${imageIndex + 1}`}
              className="max-w-full max-h-full object-contain transition-transform duration-200 cursor-move"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
              }}
              draggable={false}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 pt-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="hover:bg-blue-50 p-1 sm:p-2 h-auto"
          >
            <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          
          <span className="px-2 py-1 bg-gray-100 rounded text-xs sm:text-sm font-medium min-w-12 sm:min-w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={scale >= 3}
            className="hover:bg-blue-50 p-1 sm:p-2 h-auto"
          >
            <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotate}
            className="hover:bg-green-50 p-1 sm:p-2 h-auto"
          >
            <RotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetTransform}
            className="hover:bg-gray-50 text-xs sm:text-sm px-2 sm:px-3 py-1 h-auto"
          >
            Reset
          </Button>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-1 sm:gap-2 justify-center pt-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded border-2 overflow-hidden transition-all ${
                  index === imageIndex 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                onClick={() => {
                  setImageIndex(index);
                  resetTransform();
                }}
              >
                <img
                  src={image}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
