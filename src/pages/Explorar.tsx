
import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Heart, Share2, Grid3X3, List, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '@/components/ProductCard';
import { VideoPlayer } from '@/components/VideoPlayer';
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: number;
  produto: string;
  valor: string;
  video: string;
  imagem1: string;
  imagem2: string;
  imagem3: string;
  imagem4: string;
  imagem5: string;
  link: string;
  categoria: string;
}

const Explorar = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'video'>('video');
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('*')
        .order('id');

      if (error) throw error;

      const productsWithVideos = (data || []).filter(product => product.video);
      setProducts(productsWithVideos);

      const uniqueCategories = [...new Set((data || []).map(product => product.categoria).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'todas' 
    ? products 
    : products.filter(product => product.categoria === selectedCategory);

  const formatPrice = (price: string) => {
    if (price.includes('R$')) return price;
    return `R$ ${price}`;
  };

  const VideoFeedView = () => (
    <div className="h-screen overflow-hidden bg-black">
      <div className="h-full flex flex-col">
        {filteredProducts.length > 0 && (
          <div className="relative flex-1">
            <VideoPlayer
              videoUrl={filteredProducts[currentVideoIndex]?.video}
              autoPlay={true}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay com informações do produto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
              <div className="absolute bottom-20 left-4 right-20 text-white">
                <h3 className="text-lg font-bold mb-2 line-clamp-2">
                  {filteredProducts[currentVideoIndex]?.produto}
                </h3>
                <p className="text-2xl font-bold text-green-400 mb-4">
                  {formatPrice(filteredProducts[currentVideoIndex]?.valor)}
                </p>
                <Badge className="bg-white/20 text-white border-white/30">
                  {filteredProducts[currentVideoIndex]?.categoria}
                </Badge>
              </div>
              
              {/* Botões laterais */}
              <div className="absolute right-4 bottom-32 flex flex-col space-y-6">
                <Button size="icon" variant="ghost" className="rounded-full bg-white/20 text-white hover:bg-white/30">
                  <Heart className="w-6 h-6" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full bg-white/20 text-white hover:bg-white/30">
                  <Share2 className="w-6 h-6" />
                </Button>
                <Button 
                  size="sm" 
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-6"
                  onClick={() => window.open(filteredProducts[currentVideoIndex]?.link, '_blank')}
                >
                  Comprar
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Navegação entre vídeos */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-4 flex space-x-2">
          {filteredProducts.slice(0, 5).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentVideoIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 text-white sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20 p-2 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold">Explorar Produtos</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white/20 text-white border-white/30 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* View Mode Selector - Only on mobile/tablet */}
        <div className="px-4 pb-3 md:hidden">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={viewMode === 'video' ? 'secondary' : 'ghost'}
              onClick={() => setViewMode('video')}
              className="text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Vídeos
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              onClick={() => setViewMode('grid')}
              className="text-white"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grade
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="text-white"
            >
              <List className="w-4 h-4 mr-2" />
              Lista
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      {viewMode === 'video' ? (
        <VideoFeedView />
      ) : (
        <div className="container mx-auto px-4 py-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  compact={true}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg p-4 flex items-center space-x-4">
                  <img
                    src={product.imagem1}
                    alt={product.produto}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.produto}</h3>
                    <p className="text-red-500 font-bold">{formatPrice(product.valor)}</p>
                    <Badge variant="secondary" className="mt-1">
                      {product.categoria}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => window.open(product.link, '_blank')}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Comprar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Explorar;
