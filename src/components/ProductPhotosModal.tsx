import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Images, ShoppingCart, Play, X } from 'lucide-react';
import { ProductVideoModal } from '@/components/ProductVideoModal';
interface ProductPhotosModalProps {
  images: string[];
  productName: string;
  productPrice: string;
  productLink: string;
  videoUrl?: string;
}
export const ProductPhotosModal: React.FC<ProductPhotosModalProps> = ({
  images,
  productName,
  productPrice,
  productLink,
  videoUrl
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const handleBuyClick = () => {
    window.open(productLink, '_blank');
    setIsOpen(false);
  };
  const handleVideoClick = () => {
    setIsVideoOpen(true);
  };
  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };
  return <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="text-xs border-purple-200 hover:border-purple-300 transition-all duration-300 hover:scale-105 bg-zinc-300 hover:bg-zinc-200 text-purple-950">
            <Images className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Ver Fotos</span>
            <span className="sm:hidden">Fotos</span>
            <span className="ml-1">({images.length})</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0 bg-white">
          {/* Header com informações do produto */}
          <div className="bg-white border-b p-4 sticky top-0 z-20 flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="text-lg font-semibold line-clamp-2 text-gray-900 mb-1">
                {productName}
              </h3>
              <p className="text-xl font-bold text-red-500">
                {productPrice}
              </p>
            </div>
            
            <Button onClick={() => setIsOpen(false)} variant="outline" size="sm" className="flex-shrink-0 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 hover:border-red-300">
              <X className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Fechar</span>
            </Button>
          </div>

          {/* Botões de ação */}
          <div className="px-4 py-3 bg-gray-50 border-b flex gap-2 flex-wrap">
            {videoUrl && <Button onClick={handleVideoClick} variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700 flex-1 sm:flex-none">
                <Play className="w-4 h-4 mr-2" />
                Ver Vídeo
              </Button>}
            <Button onClick={handleBuyClick} size="sm" className="bg-gradient-to-r from-magical-mysticalPurple to-magical-deepPurple hover:from-magical-deepPurple hover:to-magical-mysticalPurple text-white font-semibold transition-all duration-300 hover:scale-105 flex-1 sm:flex-none border-0 shadow-lg hover:shadow-xl">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Adquirir Artefato
            </Button>
          </div>
          
          {/* Layout principal com imagem destacada e miniaturas */}
          <div className="flex flex-col lg:flex-row overflow-y-auto" style={{
          maxHeight: 'calc(90vh - 180px)'
        }}>
            {/* Imagem principal - mais apresentável */}
            <div className="flex-1 p-4 bg-gray-50">
              <div className="aspect-square max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <img src={images[selectedImageIndex]} alt={`${productName} - ${selectedImageIndex + 1}`} className="w-full h-full object-cover transition-all duration-300" />
              </div>
              
              {/* Info da imagem selecionada */}
              <div className="text-center mt-3">
                <p className="text-sm text-gray-600">
                  Imagem {selectedImageIndex + 1} de {images.length}
                </p>
              </div>
            </div>

            {/* Sidebar com miniaturas */}
            <div className="lg:w-64 p-4 bg-white border-l">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Todas as Fotos
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {images.map((image, index) => <button key={index} className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${index === selectedImageIndex ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'}`} onClick={() => handleImageSelect(index)}>
                    <img src={image} alt={`${productName} - ${index + 1}`} className="w-full h-full object-cover transition-transform duration-200 hover:scale-105" />
                  </button>)}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {videoUrl && <ProductVideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} videoUrl={videoUrl} productName={productName} productPrice={productPrice} productLink={productLink} />}
    </>;
};