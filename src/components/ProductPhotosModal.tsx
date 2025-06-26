
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Images, ShoppingCart, Play, X, Sparkles, Star } from 'lucide-react';
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs bg-gradient-to-r from-magical-mysticalPurple/20 to-magical-deepPurple/20 text-magical-starlight border-magical-gold/50 hover:bg-gradient-to-r hover:from-magical-gold/20 hover:to-magical-bronze/20 hover:text-magical-gold hover:border-magical-gold transition-all duration-300 hover:scale-105 backdrop-blur-sm font-enchanted"
          >
            <Images className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Ver Fotos Mágicas</span>
            <span className="sm:hidden">Fotos</span>
            <span className="ml-1">({images.length})</span>
            <Sparkles className="w-3 h-3 ml-1 animate-pulse" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0 bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple border-2 border-magical-gold/50 shadow-2xl shadow-magical-gold/20">
          {/* Header mágico com informações do produto */}
          <div className="bg-gradient-to-r from-magical-deepPurple via-magical-mysticalPurple to-magical-deepPurple border-b-2 border-magical-gold/30 p-4 sticky top-0 z-20 flex items-center justify-between backdrop-blur-lg">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-magical-gold animate-pulse" />
                <h3 className="text-lg font-bold text-magical-starlight font-magical line-clamp-2">
                  {productName}
                </h3>
                <Star className="w-5 h-5 text-magical-gold animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-magical-gold font-enchanted">Menos de</span>
                <p className="text-xl font-bold text-magical-gold bg-gradient-to-r from-magical-gold to-magical-bronze bg-clip-text text-transparent font-magical">
                  {productPrice}
                </p>
                <Sparkles className="w-4 h-4 text-magical-gold animate-pulse" />
              </div>
            </div>
            
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              size="sm"
              className="flex-shrink-0 bg-gradient-to-r from-magical-crimson/20 to-magical-crimson/30 text-magical-starlight border-magical-crimson/50 hover:bg-gradient-to-r hover:from-magical-crimson/40 hover:to-magical-crimson/50 hover:text-magical-starlight hover:border-magical-crimson font-enchanted"
            >
              <X className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Fechar Portal</span>
            </Button>
          </div>

          {/* Botões de ação mágicos */}
          <div className="px-4 py-3 bg-gradient-to-r from-magical-mysticalPurple/30 via-magical-deepPurple/30 to-magical-mysticalPurple/30 border-b border-magical-gold/20 flex gap-2 flex-wrap backdrop-blur-sm">
            {videoUrl && (
              <Button 
                onClick={handleVideoClick}
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-magical-emerald/20 to-magical-emerald/30 text-magical-starlight border-magical-emerald/50 hover:bg-gradient-to-r hover:from-magical-emerald/40 hover:to-magical-emerald/50 flex-1 sm:flex-none font-enchanted"
              >
                <Play className="w-4 h-4 mr-2" />
                Ver Vídeo Mágico
              </Button>
            )}
            <Button 
              onClick={handleBuyClick}
              size="sm"
              className="bg-gradient-to-r from-magical-gold to-magical-bronze hover:from-magical-bronze hover:to-magical-gold text-magical-midnight font-bold transition-all duration-300 hover:scale-105 flex-1 sm:flex-none border-0 shadow-lg hover:shadow-xl shadow-magical-gold/25 font-enchanted"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Adquirir Artefato
              <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
            </Button>
          </div>
          
          {/* Layout principal com imagem destacada e miniaturas */}
          <div className="flex flex-col lg:flex-row overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            {/* Imagem principal - mais mágica */}
            <div className="flex-1 p-4 bg-gradient-to-br from-magical-midnight/50 to-magical-deepPurple/50">
              <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-magical-starlight/10 to-magical-mysticalPurple/10 rounded-xl shadow-2xl shadow-magical-gold/20 overflow-hidden border-2 border-magical-gold/30 backdrop-blur-sm relative">
                <img 
                  src={images[selectedImageIndex]} 
                  alt={`${productName} - ${selectedImageIndex + 1}`} 
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                />
                {/* Efeito mágico overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-magical-gold/10 via-transparent to-magical-mysticalPurple/10 pointer-events-none"></div>
                <div className="absolute top-2 right-2">
                  <Sparkles className="w-6 h-6 text-magical-gold animate-pulse opacity-70" />
                </div>
                <div className="absolute bottom-2 left-2">
                  <Star className="w-5 h-5 text-magical-bronze animate-pulse opacity-60" />
                </div>
              </div>
              
              {/* Info da imagem selecionada */}
              <div className="text-center mt-3">
                <p className="text-sm text-magical-starlight/80 font-enchanted">
                  Imagem Mágica {selectedImageIndex + 1} de {images.length}
                </p>
              </div>
            </div>

            {/* Sidebar com miniaturas mágicas */}
            <div className="lg:w-64 p-4 bg-gradient-to-b from-magical-deepPurple/30 to-magical-mysticalPurple/30 border-l border-magical-gold/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-magical-gold" />
                <h4 className="text-sm font-bold text-magical-starlight font-magical">
                  Galeria de Artefatos
                </h4>
                <Sparkles className="w-4 h-4 text-magical-gold" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 relative group ${
                      index === selectedImageIndex 
                        ? 'border-magical-gold ring-2 ring-magical-gold/50 shadow-lg shadow-magical-gold/25' 
                        : 'border-magical-starlight/30 hover:border-magical-gold/60 hover:shadow-md hover:shadow-magical-gold/20'
                    }`}
                    onClick={() => handleImageSelect(index)}
                  >
                    <img
                      src={image}
                      alt={`${productName} - ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Overlay mágico nas miniaturas */}
                    <div className="absolute inset-0 bg-gradient-to-t from-magical-gold/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {index === selectedImageIndex && (
                      <div className="absolute top-1 right-1">
                        <Star className="w-3 h-3 text-magical-gold animate-pulse" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Efeitos de partículas mágicas */}
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-magical-gold rounded-full animate-pulse opacity-30"></div>
          <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-magical-silver rounded-full animate-pulse opacity-25" style={{
            animationDelay: '1s'
          }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-0.5 h-0.5 bg-magical-bronze rounded-full animate-pulse opacity-20" style={{
            animationDelay: '2s'
          }}></div>
        </DialogContent>
      </Dialog>

      {videoUrl && (
        <ProductVideoModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          videoUrl={videoUrl}
          productName={productName}
          productPrice={productPrice}
          productLink={productLink}
        />
      )}
    </>
  );
};
