
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw, X, ChevronLeft, ChevronRight, Move } from 'lucide-react';

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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.5, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.5, 0.5);
      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  }, []);

  const handleRotate = useCallback(() => {
    setRotation(prev => prev + 90);
  }, []);

  const handlePrevious = useCallback(() => {
    setImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
    resetTransform();
  }, [images.length]);

  const handleNext = useCallback(() => {
    setImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
    resetTransform();
  }, [images.length]);

  const resetTransform = useCallback(() => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [scale, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, scale, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  }, [scale, position]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && scale > 1 && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  }, [isDragging, scale, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    setImageIndex(currentIndex);
  }, [currentIndex]);

  // Reset transform when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetTransform();
    }
  }, [isOpen, resetTransform]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[98vw] max-h-[98vh] p-0 bg-white m-2">
        {/* Header mais compacto para mobile */}
        <DialogHeader className="p-2 sm:p-4 border-b bg-white flex-shrink-0">
          <DialogTitle className="flex items-center justify-between text-sm sm:text-base">
            <div className="flex-1 min-w-0 pr-2">
              <span className="font-semibold truncate block text-xs sm:text-sm">{productName}</span>
              <span className="text-xs text-gray-500 mt-1 block">
                Imagem {imageIndex + 1} de {images.length}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-shrink-0 bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600 transition-all duration-300 hover:scale-110 shadow-lg p-1 sm:p-2"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Fechar</span>
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Container da imagem - Responsivo e com altura dinâmica */}
        <div 
          className="relative bg-gray-100 overflow-hidden cursor-move select-none flex items-center justify-center flex-1"
          style={{ 
            height: 'calc(100vh - 200px)',
            maxHeight: '70vh',
            minHeight: '200px'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Botões de navegação mais visíveis */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0"
                onClick={handleNext}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </>
          )}

          {/* Imagem principal - Completamente responsiva */}
          <div className="w-full h-full flex items-center justify-center p-1 sm:p-2">
            <img
              ref={imageRef}
              src={images[imageIndex]}
              alt={`${productName} - ${imageIndex + 1}`}
              className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x / scale}px, ${position.y / scale}px)`,
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              draggable={false}
            />
          </div>

          {/* Indicador de zoom para mobile */}
          {scale > 1 && (
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
              <Move className="w-3 h-3" />
              <span className="hidden sm:inline">Arraste para mover</span>
            </div>
          )}
        </div>

        {/* Controles mais compactos para mobile */}
        <div className="p-2 sm:p-4 bg-white border-t flex-shrink-0">
          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="hover:bg-blue-50 transition-colors p-1 sm:p-2"
            >
              <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            
            <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium min-w-12 text-center">
              {Math.round(scale * 100)}%
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={scale >= 4}
              className="hover:bg-blue-50 transition-colors p-1 sm:p-2"
            >
              <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
              className="hover:bg-green-50 transition-colors p-1 sm:p-2"
            >
              <RotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetTransform}
              className="hover:bg-gray-50 transition-colors text-xs px-2 py-1"
            >
              Reset
            </Button>
          </div>

          {/* Miniaturas mais compactas */}
          {images.length > 1 && (
            <div className="flex gap-1 sm:gap-2 justify-center overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded border-2 overflow-hidden transition-all ${
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
                    alt={`${productName} - Mini ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
