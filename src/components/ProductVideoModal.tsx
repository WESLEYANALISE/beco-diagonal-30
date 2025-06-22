
import { useState, useEffect } from 'react';
import { Play, Maximize, ShoppingCart, X, Expand } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ProductVideoModalProps {
  videoUrl: string;
  productName: string;
  productPrice: string;
  productLink: string;
}

export const ProductVideoModal = ({ videoUrl, productName, productPrice, productLink }: ProductVideoModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleBuyClick = () => {
    window.open(productLink, '_blank');
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-full text-xs bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300">
          <Play className="w-3 h-3 mr-1" />
          Ver Vídeo
        </Button>
      </DialogTrigger>
      <DialogContent className={`${isFullscreen ? 'max-w-full h-full p-0' : 'max-w-4xl'} bg-black border-0`}>
        <div className="relative w-full h-full flex flex-col">
          {/* Video Container */}
          <div className="relative flex-1 bg-black">
            <video
              src={videoUrl}
              controls
              autoPlay
              muted={false} // Áudio ligado por padrão
              loop
              className="w-full h-full object-contain"
              playsInline
            />
            
            {/* Controls Container - mais visível */}
            <div className="absolute top-4 right-4 flex gap-2">
              {/* Expand button for horizontal videos */}
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleFullscreen}
                className="bg-black/70 hover:bg-black/90 text-white border-2 border-white/50 hover:border-white/70 transition-all duration-300 hover:scale-110 rounded-lg p-2"
                title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
              >
                <Expand className="w-5 h-5" />
              </Button>
              
              {/* Close/Minimize Button - mais visível */}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClose}
                className="bg-red-600/90 hover:bg-red-700 text-white border-2 border-red-400/50 hover:border-red-300 transition-all duration-300 hover:scale-110 rounded-lg p-2"
                title="Fechar vídeo"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* ESC hint - only show when not fullscreen */}
            {!isFullscreen && (
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-xs">
                Pressione ESC para fechar
              </div>
            )}
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
