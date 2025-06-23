
import { useState, useEffect } from 'react';
import { Play, Maximize, ShoppingCart, X, Expand } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProductVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  productName: string;
  productPrice: string;
  productLink: string;
  productImages?: string[];
}

export const ProductVideoModal = ({
  isOpen,
  onClose,
  videoUrl,
  productName,
  productPrice,
  productLink,
  productImages = []
}: ProductVideoModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoHorizontal, setIsVideoHorizontal] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleBuyClick = () => {
    window.open(productLink, '_blank');
  };

  // Check if video is horizontal/landscape
  useEffect(() => {
    if (isOpen && videoUrl) {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.addEventListener('loadedmetadata', () => {
        const isHorizontal = video.videoWidth > video.videoHeight;
        setIsVideoHorizontal(isHorizontal);
      });
    }
  }, [isOpen, videoUrl]);

  // Auto-rotate images carousel only for horizontal videos
  useEffect(() => {
    if (isOpen && productImages.length > 1 && isVideoHorizontal && !isFullscreen) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % productImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, productImages.length, isVideoHorizontal, isFullscreen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-full h-full p-0' : 'max-w-4xl'} bg-black border-0`}>
        <div className="relative w-full h-full flex flex-col">
          {/* Video Container */}
          <div className="relative flex-1 bg-black">
            {/* Image Carousel - Only for horizontal videos and positioned above video */}
            {!isFullscreen && productImages.length > 0 && isVideoHorizontal && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 bg-black/60 p-3 rounded-lg backdrop-blur-sm">
                {productImages.slice(0, 5).map((image, index) => (
                  <div 
                    key={index} 
                    className={`w-16 h-16 rounded border-2 overflow-hidden transition-all duration-500 ${
                      index === currentImageIndex 
                        ? 'border-white opacity-100 scale-110 shadow-lg' 
                        : 'border-gray-400 opacity-70'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${productName} - ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
                {productImages.length > 5 && (
                  <div className="w-16 h-16 rounded border-2 border-gray-400 bg-black/70 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">+{productImages.length - 5}</span>
                  </div>
                )}
              </div>
            )}

            <video 
              src={videoUrl} 
              controls 
              autoPlay 
              muted={false} 
              loop 
              className="w-full h-full object-contain" 
              playsInline 
            />
            
            {/* Controls Container */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={toggleFullscreen} 
                className="bg-black/70 hover:bg-black/90 text-white border-2 border-white/50 hover:border-white/70 transition-all duration-300 hover:scale-110 rounded-lg p-2" 
                title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
              >
                <Expand className="w-5 h-5" />
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onClose} 
                className="bg-red-600/90 hover:bg-red-700 text-white border-2 border-red-400/50 hover:border-red-300 transition-all duration-300 hover:scale-110 rounded-lg p-2" 
                title="Fechar vídeo"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Product Info - Hidden in fullscreen */}
          {!isFullscreen && (
            <div className="bg-white p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {productName}
              </h3>
              <div className="text-lg font-bold text-red-500">
                Menos de {productPrice}
              </div>
              <Button 
                onClick={handleBuyClick} 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Comprar na Shopee
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
