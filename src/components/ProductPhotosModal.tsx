
import { useState } from 'react';
import { Images, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ProductPhotosModalProps {
  images: string[];
  productName: string;
  productPrice: string;
  productLink: string;
}

export const ProductPhotosModal = ({ images, productName, productPrice, productLink }: ProductPhotosModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBuyClick = () => {
    window.open(productLink, '_blank');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-full text-xs bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700 hover:border-green-300">
          <Images className="w-3 h-3 mr-1" />
          Ver Fotos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-white border-0">
        <div className="space-y-4">
          {/* Image Viewer */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={`${productName} - ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {images.length > 1 && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
            
            {/* Image Counter */}
            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productName} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Product Info */}
          <div className="space-y-3">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
