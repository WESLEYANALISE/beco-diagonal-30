
import { useState } from 'react';
import { Play, Maximize, ShoppingCart, X } from 'lucide-react';
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleBuyClick = () => {
    window.open(productLink, '_blank');
  };

  return (
    <Dialog>
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
              muted
              className="w-full h-full object-contain"
              playsInline
            />
            
            {/* Fullscreen Toggle Button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-0 p-2"
            >
              {isFullscreen ? <X className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
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
