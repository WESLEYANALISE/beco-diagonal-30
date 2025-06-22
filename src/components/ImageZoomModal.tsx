
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
      <DialogContent className="max-w-6xl max-h-[90vh] p-2">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center justify-between">
            <span className="text-lg font-semibold truncate">{productName}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {imageIndex + 1} de {images.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-red-100 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '70vh' }}>
          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-lg"
                onClick={handleNext}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Image */}
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
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
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="hover:bg-blue-50"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          
          <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium min-w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={scale >= 3}
            className="hover:bg-blue-50"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotate}
            className="hover:bg-green-50"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetTransform}
            className="hover:bg-gray-50"
          >
            Resetar
          </Button>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 justify-center pt-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
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
