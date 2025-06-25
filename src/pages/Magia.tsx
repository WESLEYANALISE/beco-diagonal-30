
import React, { useState, useEffect } from 'react';
import { Grid, List, Search, Heart, Download, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MagicalParticles } from '@/components/MagicalParticles';
import { useIsMobile } from "@/hooks/use-mobile";

interface FlickrPhoto {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  author: string;
  tags: string[];
}

const Magia = () => {
  const [photos, setPhotos] = useState<FlickrPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPhotos, setFilteredPhotos] = useState<FlickrPhoto[]>([]);
  const isMobile = useIsMobile();

  // Simulated Harry Potter photos data (since we can't directly access Flickr API)
  const harryPotterPhotos: FlickrPhoto[] = [
    {
      id: '1',
      title: 'Hogwarts Castle at Sunset',
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      author: 'Magic Photographer',
      tags: ['hogwarts', 'castle', 'sunset', 'magic']
    },
    {
      id: '2',
      title: 'Platform 9¾ at King\'s Cross',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      author: 'Railway Magic',
      tags: ['platform', 'train', 'kings cross', 'london']
    },
    {
      id: '3',
      title: 'The Forbidden Forest',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop',
      author: 'Forest Explorer',
      tags: ['forest', 'dark', 'mysterious', 'trees']
    },
    {
      id: '4',
      title: 'Diagon Alley Shops',
      url: 'https://images.unsplash.com/photo-1520637836862-4d197d17c3a4?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1520637836862-4d197d17c3a4?w=300&h=200&fit=crop',
      author: 'Wizard Shopper',
      tags: ['diagon alley', 'shops', 'cobblestone', 'magic']
    },
    {
      id: '5',
      title: 'Quidditch Pitch',
      url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=300&h=200&fit=crop',
      author: 'Quidditch Fan',
      tags: ['quidditch', 'pitch', 'sport', 'flying']
    },
    {
      id: '6',
      title: 'Great Hall Feast',
      url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=300&h=200&fit=crop',
      author: 'Feast Master',
      tags: ['great hall', 'feast', 'candles', 'dinner']
    },
    {
      id: '7',
      title: 'Potions Classroom',
      url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=200&fit=crop',
      author: 'Potion Brewer',
      tags: ['potions', 'classroom', 'bottles', 'brewing']
    },
    {
      id: '8',
      title: 'Library of Magic',
      url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
      author: 'Book Collector',
      tags: ['library', 'books', 'knowledge', 'ancient']
    },
    {
      id: '9',
      title: 'Magic Wands Collection',
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      author: 'Wandmaker',
      tags: ['wands', 'magic', 'collection', 'ollivanders']
    }
  ];

  useEffect(() => {
    // Simulate loading from Flickr API
    const loadPhotos = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPhotos(harryPotterPhotos);
      setFilteredPhotos(harryPotterPhotos);
      setLoading(false);
    };

    loadPhotos();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = photos.filter(photo =>
        photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPhotos(filtered);
    } else {
      setFilteredPhotos(photos);
    }
  }, [searchTerm, photos]);

  const handleViewPhoto = (photo: FlickrPhoto) => {
    window.open(photo.url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple pb-20 relative">
        <MagicalParticles />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-magical-gold/20 rounded-2xl animate-shimmer backdrop-blur-sm border border-magical-gold/30"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-48 bg-magical-gold/20 rounded-2xl backdrop-blur-sm animate-shimmer"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple pb-20 relative overflow-hidden">
      <MagicalParticles />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-magical-starlight mb-4 animate-slide-in-left font-magical">
            ✨ Galeria Mágica do Universo Harry Potter
          </h1>
          <p className="text-magical-starlight/80 text-lg animate-slide-in-right font-enchanted">
            Explore as imagens mais encantadoras do mundo bruxo
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-magical-starlight/60 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar fotos mágicas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-magical-starlight/10 border-magical-gold/30 text-magical-starlight placeholder:text-magical-starlight/60 focus:border-magical-gold focus:ring-magical-gold/20"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' 
                ? 'bg-magical-gold text-magical-midnight'
                : 'border-magical-gold/30 text-magical-starlight hover:bg-magical-gold/20'
              }
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' 
                ? 'bg-magical-gold text-magical-midnight'
                : 'border-magical-gold/30 text-magical-starlight hover:bg-magical-gold/20'
              }
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <Badge className="bg-magical-gold/20 text-magical-gold border-magical-gold/30">
            {filteredPhotos.length} fotos encontradas
          </Badge>
        </div>

        {/* Photo Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
            {filteredPhotos.map((photo, index) => (
              <Card 
                key={photo.id} 
                className="group relative bg-gradient-to-br from-magical-deepPurple/80 to-magical-mysticalPurple/80 border-magical-gold/30 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleViewPhoto(photo)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={photo.thumbnail}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-magical-midnight/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button size="sm" className="bg-magical-gold/20 hover:bg-magical-gold/30 backdrop-blur-sm border border-magical-gold/30">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="p-3">
                  <h3 className="text-sm font-semibold text-magical-starlight line-clamp-2 font-enchanted">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-magical-starlight/60 mt-1">
                    por {photo.author}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {filteredPhotos.map((photo, index) => (
              <Card 
                key={photo.id} 
                className="bg-gradient-to-r from-magical-deepPurple/80 to-magical-mysticalPurple/80 border-magical-gold/30 hover:shadow-xl transition-all duration-300 cursor-pointer animate-slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleViewPhoto(photo)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={photo.thumbnail}
                      alt={photo.title}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-magical-starlight mb-2 font-enchanted">
                        {photo.title}
                      </h3>
                      <p className="text-magical-starlight/60 text-sm mb-2">
                        por {photo.author}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {photo.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-xs bg-magical-gold/20 text-magical-gold border-magical-gold/30"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-magical-gold/30 text-magical-starlight hover:bg-magical-gold/20"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-magical-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-magical-gold" />
            </div>
            <h3 className="text-xl font-semibold text-magical-starlight mb-2 font-enchanted">
              Nenhuma foto encontrada
            </h3>
            <p className="text-magical-starlight/60">
              Tente buscar por outros termos mágicos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Magia;
