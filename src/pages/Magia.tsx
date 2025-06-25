
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Grid2X2, LayoutList, Camera, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LazyImage } from '@/components/LazyImage';
import { logger } from '@/utils/logger';

interface FlickrPhoto {
  id: string;
  title: string;
  url_m: string;
  url_l?: string;
  url_o?: string;
  owner: string;
}

const Magia = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<FlickrPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Simulated Harry Potter photos data (in real implementation, this would fetch from Flickr API)
  const harryPotterPhotos = [
    {
      id: '1',
      title: 'Castelo de Hogwarts ao Entardecer',
      url_m: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      url_l: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      owner: 'Wizarding World'
    },
    {
      id: '2',
      title: 'Biblioteca de Hogwarts',
      url_m: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
      url_l: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
      owner: 'Magic Photos'
    },
    {
      id: '3',
      title: 'Floresta Proibida',
      url_m: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
      url_l: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      owner: 'Magical Creatures'
    },
    {
      id: '4',
      title: 'Plataforma 9¾',
      url_m: 'https://images.unsplash.com/photo-1474314170901-f351b68f544f?w=400',
      url_l: 'https://images.unsplash.com/photo-1474314170901-f351b68f544f?w=800',
      owner: 'Kings Cross'
    },
    {
      id: '5',
      title: 'Poções Mágicas',
      url_m: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
      url_l: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
      owner: 'Potions Master'
    },
    {
      id: '6',
      title: 'Coruja de Hogwarts',
      url_m: 'https://images.unsplash.com/photo-1551158876-3f2d4a30309d?w=400',
      url_l: 'https://images.unsplash.com/photo-1551158876-3f2d4a30309d?w=800',
      owner: 'Owl Post'
    },
    {
      id: '7',
      title: 'Varinha Mágica',
      url_m: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      url_l: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      owner: 'Ollivanders'
    },
    {
      id: '8',
      title: 'Grande Salão',
      url_m: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
      url_l: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
      owner: 'Hogwarts Staff'
    }
  ];

  useEffect(() => {
    // Simulate loading delay for better UX
    const loadPhotos = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPhotos(harryPotterPhotos);
        logger.info('Harry Potter photos loaded successfully');
      } catch (error) {
        logger.error('Error loading Harry Potter photos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-magical-gold to-magical-bronze rounded-full flex items-center justify-center mx-auto mb-4 animate-magical-glow">
            <Camera className="w-8 h-8 text-magical-midnight" />
          </div>
          <div className="text-magical-starlight text-xl font-magical">Carregando Magia de Hogwarts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-magical-deepPurple/90 via-magical-mysticalPurple/90 to-magical-deepPurple/90 backdrop-blur-md border-b border-magical-gold/30">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-magical-starlight hover:bg-magical-gold/20 hover:text-magical-gold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>

          <h1 className="text-magical-starlight font-bold text-xl font-magical flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-magical-gold" />
            Magia de Hogwarts
          </h1>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-magical-mysticalPurple hover:bg-magical-deepPurple text-magical-starlight' : 'text-magical-starlight hover:bg-magical-gold/20'}
            >
              <Grid2X2 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-magical-mysticalPurple hover:bg-magical-deepPurple text-magical-starlight' : 'text-magical-starlight hover:bg-magical-gold/20'}
            >
              <LayoutList className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-magical-starlight/80 font-enchanted mb-4">
              Explore as imagens mágicas do universo Harry Potter
            </p>
            <div className="text-sm text-magical-gold font-magical">
              {photos.length} fotos mágicas encontradas
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <Card
                  key={photo.id}
                  className="overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-magical-deepPurple/80 to-magical-mysticalPurple/60 border border-magical-gold/30 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative aspect-square">
                    <LazyImage
                      src={photo.url_m}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-magical-midnight/80 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="text-magical-starlight text-sm font-semibold line-clamp-2 font-enchanted">
                        {photo.title}
                      </h3>
                      <p className="text-magical-gold text-xs font-magical">
                        por {photo.owner}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {photos.map((photo, index) => (
                <Card
                  key={photo.id}
                  className="overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-gradient-to-r from-magical-deepPurple/80 to-magical-mysticalPurple/60 border border-magical-gold/30 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex">
                    <div className="relative w-32 h-24 flex-shrink-0">
                      <LazyImage
                        src={photo.url_m}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-center">
                      <h3 className="text-magical-starlight font-semibold mb-1 font-enchanted">
                        {photo.title}
                      </h3>
                      <p className="text-magical-gold text-sm font-magical">
                        Fotografia por {photo.owner}
                      </p>
                      <p className="text-magical-starlight/60 text-xs mt-1 font-enchanted">
                        Galeria Mágica de Hogwarts
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Magia;
