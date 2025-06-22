
import { useState } from 'react';
import { Image, X, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

interface ProductPhotosModalProps {
  images: string[];
  productName: string;
  productPrice: string;
  productLink: string;
}

export const ProductPhotosModal = ({ images, productName, productPrice, productLink }: ProductPhotosModalProps) => {
  const [open, setOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBuyNow = () => {
    window.open(productLink, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full mb-2 bg-orange-500 hover:bg-orange-600 text-white border-orange-500 hover:border-orange-600"
        >
          <Image className="w-3 h-3 mr-1" />
          Ver Fotos ({images.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-4">
        <DialogTitle className="sr-only">Fotos do produto {productName}</DialogTitle>
        <div className="relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="aspect-square relative overflow-hidden rounded-lg bg-white mb-4">
            <img
              src={images[currentImageIndex]}
              alt={`${productName} - Foto ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex justify-center mb-4 space-x-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    index === currentImageIndex ? 'border-orange-500' : 'border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productName} - Miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Informações do produto e botão de compra */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-bold text-lg mb-2 line-clamp-2">{productName}</h3>
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-red-500">
                A partir de {productPrice}
              </div>
              <Button 
                onClick={handleBuyNow}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Comprar Agora
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
