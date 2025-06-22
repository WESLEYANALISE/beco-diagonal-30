
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Images, ExternalLink, Expand, GitCompare } from 'lucide-react';
import { ImageZoomModal } from '@/components/ImageZoomModal';
import { ProductComparisonModal } from '@/components/ProductComparisonModal';

interface ProductPhotosModalProps {
  images: string[];
  productName: string;
  productPrice: string;
  productLink: string;
  productId: number;
}

export const ProductPhotosModal: React.FC<ProductPhotosModalProps> = ({
  images,
  productName,
  productPrice,
  productLink,
  productId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsZoomOpen(true);
  };

  const handleCompareClick = () => {
    setShowComparison(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full border-gray-300 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
          >
            <Images className="w-3 h-3 mr-1" />
            Ver Fotos ({images.length})
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold line-clamp-2">{productName}</h3>
                <p className="text-xl font-bold text-red-500">{productPrice}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCompareClick}
                  variant="outline"
                  className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                >
                  <GitCompare className="w-4 h-4 mr-2" />
                  Comparar com outro modelo
                </Button>
                <Button 
                  onClick={() => window.open(productLink, '_blank')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Comprar
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {images.map((image, index) => (
                <div key={index} className="relative group cursor-pointer" onClick={() => handleImageClick(index)}>
                  <img 
                    src={image} 
                    alt={`${productName} - ${index + 1}`} 
                    className="w-full aspect-square object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
                    <Expand className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
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

      <ProductComparisonModal
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        currentProduct={{
          id: productId,
          name: productName,
          price: productPrice,
          images: images,
          link: productLink
        }}
      />
    </>
  );
};
