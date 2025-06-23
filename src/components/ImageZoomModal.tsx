
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
  const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const imageRef = useRef<HTMLImageElement>(null);

  // Update screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate responsive dimensions
  const getModalDimensions = () => {
    const margin = 32; // 16px on each side
    const headerHeight = 80; // Approximate header height
    const controlsHeight = 120; // Approximate controls height
    
    const maxWidth = Math.min(screenSize.width - margin, 1400);
    const maxHeight = Math.min(screenSize.height - headerHeight - controlsHeight - margin, 800);
    
    return { maxWidth, maxHeight };
  };

  const { maxWidth, maxHeight } = getModalDimensions();

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.3, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.3, 0.5);
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
      e.preventDefault();
    }
  }, [scale, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Limit dragging to prevent image from going too far off screen
      const maxOffset = 200;
      setPosition({
        x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
        y: Math.max(-maxOffset, Math.min(maxOffset, newY))
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
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;
      
      const maxOffset = 200;
      setPosition({
        x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
        y: Math.max(-maxOffset, Math.min(maxOffset, newY))
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
      <DialogContent 
        className="p-0 bg-white border-0 shadow-2xl"
        style={{ 
          width: `${maxWidth}px`, 
          maxWidth: `${maxWidth}px`,
          height: `${maxHeight + 200}px`,
          maxHeight: '95vh'
        }}
      >
        {/* Header compacto */}
        <DialogHeader className="p-3 border-b bg-white flex-shrink-0">
          <DialogTitle className="flex items-center justify-between text-sm">
            <div className="flex-1 min-w-0 pr-2">
              <span className="font-semibold truncate block text-sm">{productName}</span>
              <span className="text-xs text-gray-500 mt-1 block">
                Imagem {imageIndex + 1} de {images.length}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-shrink-0 bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Container da imagem - Responsivo */}
        <div 
          className="relative bg-gray-50 overflow-hidden cursor-move select-none flex items-center justify-center flex-1"
          style={{ 
            height: `${maxHeight}px`,
            maxHeight: `${maxHeight}px`
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Botões de navegação */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full w-10 h-10 p-0"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full w-10 h-10 p-0"
                onClick={handleNext}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Imagem principal */}
          <div className="w-full h-full flex items-center justify-center p-2">
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

          {/* Indicador de zoom */}
          {scale > 1 && (
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
              <Move className="w-3 h-3" />
              <span className="hidden sm:inline">Arraste para mover</span>
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="p-3 bg-white border-t flex-shrink-0">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="hover:bg-blue-50"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <div className="px-3 py-1 bg-gray-100 rounded text-sm font-medium min-w-16 text-center">
              {Math.round(scale * 100)}%
            </div>
            
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
              className="hover:bg-gray-50 text-xs px-3"
            >
              Reset
            </Button>
          </div>

          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="flex gap-1 justify-center overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all ${
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
