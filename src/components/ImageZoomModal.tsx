
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
      <DialogContent className="w-full max-w-[95vw] max-h-[95vh] p-0 bg-white">
        {/* Header otimizado */}
        <DialogHeader className="p-3 sm:p-4 border-b bg-white">
          <DialogTitle className="flex items-center justify-between text-sm sm:text-base lg:text-lg">
            <div className="flex-1 min-w-0 pr-4">
              <span className="font-semibold truncate block">{productName}</span>
              <span className="text-xs sm:text-sm text-gray-500 mt-1 block">
                Imagem {imageIndex + 1} de {images.length}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-shrink-0 bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600 transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <X className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Fechar</span>
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Container da imagem - Otimizado para mobile */}
        <div 
          className="relative bg-gray-100 overflow-hidden cursor-move select-none flex items-center justify-center w-full"
          style={{ height: 'min(60vh, 400px)' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Botões de navegação otimizados */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 p-0"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 p-0"
                onClick={handleNext}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Imagem principal - Completamente responsiva */}
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

          {/* Indicador de zoom otimizado */}
          {scale > 1 && (
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2">
              <Move className="w-4 h-4" />
              <span className="hidden sm:inline">Arraste para mover</span>
            </div>
          )}
        </div>

        {/* Controles otimizados */}
        <div className="p-3 sm:p-4 bg-white border-t">
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
              disabled={scale >= 4}
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

          {/* Miniaturas otimizadas */}
          {images.length > 1 && (
            <div className="flex gap-2 justify-center overflow-x-auto pb-2">
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
