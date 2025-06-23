
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

  // Calculate responsive modal dimensions
  const getModalDimensions = () => {
    const padding = 32; // 16px padding on each side
    const headerHeight = 120; // Approximate header height
    const controlsHeight = 120; // Approximate controls height
    
    const maxWidth = Math.min(screenSize.width - padding, 1200);
    const maxHeight = Math.min(screenSize.height - headerHeight - controlsHeight, 800);
    
    return { maxWidth, maxHeight };
  };

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

  const { maxWidth, maxHeight } = getModalDimensions();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="p-0 bg-white m-2 overflow-hidden"
        style={{ 
          width: `min(${maxWidth}px, 98vw)`,
          maxHeight: `min(${maxHeight + 200}px, 95vh)`
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
              className="flex-shrink-0 bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600 transition-all duration-300 hover:scale-110 shadow-lg p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Container da imagem - Responsivo com altura dinâmica baseada no tamanho da tela */}
        <div 
          className="relative bg-gray-100 overflow-hidden cursor-move select-none flex items-center justify-center"
          style={{ 
            height: `${maxHeight}px`,
            minHeight: '300px'
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

          {/* Imagem principal - Responsiva baseada no tamanho da tela */}
          <div className="w-full h-full flex items-center justify-center p-2">
            <img
              ref={imageRef}
              src={images[imageIndex]}
              alt={`${productName} - ${imageIndex + 1}`}
              className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x / scale}px, ${position.y / scale}px)`,
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                maxWidth: `${maxWidth - 40}px`,
                maxHeight: `${maxHeight - 40}px`
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
          <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="hover:bg-blue-50 transition-colors"
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
              className="hover:bg-blue-50 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
              className="hover:bg-green-50 transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetTransform}
              className="hover:bg-gray-50 transition-colors text-sm px-3"
            >
              Reset
            </Button>
          </div>

          {/* Miniaturas responsivas */}
          {images.length > 1 && (
            <div className="flex gap-2 justify-center overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded border-2 overflow-hidden transition-all ${
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
