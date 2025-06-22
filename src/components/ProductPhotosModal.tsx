
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Images, ExternalLink, Expand, ShoppingCart } from 'lucide-react';
import { ImageZoomModal } from '@/components/ImageZoomModal';

interface ProductPhotosModalProps {
  images: string[];
  productName: string;
  productPrice: string;
  productLink: string;
}

export const ProductPhotosModal: React.FC<ProductPhotosModalProps> = ({
  images,
  productName,
  productPrice,
  productLink
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsZoomOpen(true);
  };

  const handleBuyClick = () => {
    window.open(productLink, '_blank');
    setIsOpen(false); // Fecha o modal após clicar em comprar
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 hover:text-purple-700 hover:border-purple-300 transition-all duration-300 hover:scale-105"
          >
            <Images className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Ver Fotos</span>
            <span className="sm:hidden">Fotos</span>
            <span className="ml-1">({images.length})</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden p-0">
          {/* Header com informações do produto */}
          <div className="bg-white border-b p-4 sticky top-0 z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold line-clamp-2 text-gray-900">
                  {productName}
                </h3>
                <p className="text-lg sm:text-xl font-bold text-red-500 mt-1">
                  {productPrice}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button 
                  onClick={handleBuyClick}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold transition-all duration-300 hover:scale-105"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Comprar na Shopee
                </Button>
              </div>
            </div>
          </div>
          
          {/* Grid de imagens */}
          <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 140px)' }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className="relative group cursor-pointer aspect-square" 
                  onClick={() => handleImageClick(index)}
                >
                  <img 
                    src={image} 
                    alt={`${productName} - ${index + 1}`} 
                    className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300 shadow-sm hover:shadow-md"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
                    <Expand className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                  </div>
                  
                  {/* Indicador de número da imagem */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {index + 1}/{images.length}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Botão fixo para comprar (versão mobile-friendly) */}
            <div className="mt-6 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-4">
              <Button 
                onClick={handleBuyClick}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 text-base transition-all duration-300 hover:scale-[1.02] shadow-lg"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Comprar na Shopee por {productPrice}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        images={images}
        currentIndex={selectedImageIndex}
        productName={productName}
      />
    </>
  );
};
