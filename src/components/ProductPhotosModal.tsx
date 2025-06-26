import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Images, ShoppingCart, Play, X, Sparkles, Crown, Wand2 } from 'lucide-react';
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
          <Button size="sm" variant="outline" className="text-xs bg-gradient-to-r from-magical-mysticalPurple/20 to-magical-deepPurple/20 border-magical-gold/30 hover:bg-gradient-to-r hover:from-magical-mysticalPurple/30 hover:to-magical-deepPurple/30 hover:border-magical-gold/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-lg hover:shadow-magical-gold/20 bg-violet-700 hover:bg-violet-600 text-white">
            <Images className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Ver Fotos Mágicas</span>
            <span className="sm:hidden">Fotos</span>
            <span className="ml-1">({images.length})</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0 bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple border-2 border-magical-gold/40 shadow-2xl">
          {/* Magical background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-4 left-4 w-2 h-2 bg-magical-gold rounded-full animate-sparkle opacity-60"></div>
            <div className="absolute top-12 right-8 w-1 h-1 bg-magical-bronze rounded-full animate-sparkle opacity-40" style={{
            animationDelay: '0.5s'
          }}></div>
            <div className="absolute bottom-12 left-8 w-1.5 h-1.5 bg-magical-silver rounded-full animate-sparkle opacity-70" style={{
            animationDelay: '1s'
          }}></div>
            <div className="absolute bottom-4 right-4 w-2 h-2 bg-magical-gold rounded-full animate-sparkle opacity-50" style={{
            animationDelay: '1.5s'
          }}></div>
          </div>

          {/* Header com informações do produto - Tema mágico */}
          <div className="bg-gradient-to-r from-magical-deepPurple/90 to-magical-mysticalPurple/90 border-b-2 border-magical-gold/30 p-4 sticky top-0 z-20 flex items-center justify-between backdrop-blur-xl">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-magical-gold animate-pulse" />
                <h3 className="text-lg font-semibold line-clamp-2 text-magical-starlight mb-1 font-magical">
                  {productName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-magical-bronze animate-sparkle" />
                <p className="text-xl font-bold text-magical-gold font-magical">
                  {productPrice}
                </p>
              </div>
            </div>
            
            <Button onClick={() => setIsOpen(false)} variant="outline" size="sm" className="flex-shrink-0 bg-gradient-to-r from-magical-mysticalPurple/30 to-magical-deepPurple/30 text-magical-starlight border-magical-gold/40 hover:bg-gradient-to-r hover:from-magical-mysticalPurple/50 hover:to-magical-deepPurple/50 hover:text-magical-gold hover:border-magical-gold/60 backdrop-blur-sm">
              <X className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Fechar</span>
            </Button>
          </div>

          {/* Botões de ação - Tema mágico */}
          <div className="px-4 py-3 bg-gradient-to-r from-magical-mysticalPurple/20 to-magical-deepPurple/20 border-b border-magical-gold/20 flex gap-2 flex-wrap backdrop-blur-sm">
            {videoUrl && <Button onClick={handleVideoClick} variant="outline" size="sm" className="bg-gradient-to-r from-magical-deepPurple/30 to-magical-mysticalPurple/30 text-magical-starlight border-magical-gold/40 hover:bg-gradient-to-r hover:from-magical-deepPurple/50 hover:to-magical-mysticalPurple/50 hover:text-magical-gold hover:border-magical-gold/60 flex-1 sm:flex-none backdrop-blur-sm">
                <Play className="w-4 h-4 mr-2" />
                Ver Vídeo Mágico
              </Button>}
            <Button onClick={handleBuyClick} size="sm" className="bg-gradient-to-r from-magical-gold to-magical-bronze hover:from-magical-darkGold hover:to-magical-bronze text-magical-midnight font-semibold transition-all duration-300 hover:scale-105 flex-1 sm:flex-none border-0 shadow-xl hover:shadow-magical-gold/30 font-magical">
              <ShoppingCart className="w-4 h-4 mr-2" />
              <Wand2 className="w-4 h-4 mr-1" />
              Adquirir Artefato
            </Button>
          </div>
          
          {/* Layout principal com imagem destacada e miniaturas - Tema mágico */}
          <div className="flex flex-col lg:flex-row overflow-y-auto" style={{
          maxHeight: 'calc(90vh - 180px)'
        }}>
            {/* Imagem principal - mais mágica */}
            <div className="flex-1 p-4 bg-gradient-to-br from-magical-midnight/50 to-magical-deepPurple/30 backdrop-blur-sm">
              <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-magical-starlight/10 to-magical-mysticalPurple/20 rounded-2xl shadow-2xl overflow-hidden border-2 border-magical-gold/30 backdrop-blur-sm">
                <img src={images[selectedImageIndex]} alt={`${productName} - ${selectedImageIndex + 1}`} className="w-full h-full object-cover transition-all duration-500 hover:scale-110" />
              </div>
              
              {/* Info da imagem selecionada - Tema mágico */}
              <div className="text-center mt-3">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-magical-gold animate-sparkle" />
                  <p className="text-sm text-magical-starlight font-enchanted">
                    Imagem {selectedImageIndex + 1} de {images.length}
                  </p>
                  <Sparkles className="w-4 h-4 text-magical-bronze animate-sparkle" />
                </div>
              </div>
            </div>

            {/* Sidebar com miniaturas - Tema mágico */}
            <div className="lg:w-64 p-4 bg-gradient-to-b from-magical-deepPurple/30 to-magical-mysticalPurple/30 border-l-2 border-magical-gold/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-4 h-4 text-magical-gold" />
                <h4 className="text-sm font-medium text-magical-starlight font-magical">
                  Galeria Mágica
                </h4>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {images.map((image, index) => <button key={index} className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${index === selectedImageIndex ? 'border-magical-gold ring-2 ring-magical-gold/50 shadow-lg shadow-magical-gold/30' : 'border-magical-gold/30 hover:border-magical-gold/60 hover:shadow-md hover:shadow-magical-gold/20'} bg-gradient-to-br from-magical-starlight/10 to-magical-mysticalPurple/20 backdrop-blur-sm`} onClick={() => handleImageSelect(index)}>
                    <img src={image} alt={`${productName} - ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                  </button>)}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {videoUrl && <ProductVideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} videoUrl={videoUrl} productName={productName} productPrice={productPrice} productLink={productLink} />}
    </>;
};