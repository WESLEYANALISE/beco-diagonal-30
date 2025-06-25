
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { ProductGrid } from '@/components/ProductGrid';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/use-toast';

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
  imagem6?: string;
  imagem7?: string;
  link: string;
  categoria: string;
  subcategoria?: string;
}

export const Favoritos = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { favoriteIds } = useFavorites();
  const { toast } = useToast();

  const fetchFavoriteProducts = useCallback(async () => {
    if (favoriteIds.length === 0) {
      setFavoriteProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('*')
        .in('id', favoriteIds);

      if (error) {
        console.error('Erro ao buscar artefatos favoritos:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar seus artefatos favoritos",
          variant: "destructive",
        });
        return;
      }

      setFavoriteProducts(data || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar favoritos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [favoriteIds, toast]);

  useEffect(() => {
    fetchFavoriteProducts();
  }, [fetchFavoriteProducts]);

  const memoizedProducts = useMemo(() => favoriteProducts, [favoriteProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-magical-gold fill-current animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold text-magical-starlight font-magical">
              Grimório de Artefatos
            </h1>
            <Heart className="w-8 h-8 text-magical-gold fill-current animate-pulse" />
          </div>
          <p className="text-magical-starlight/80 text-lg font-enchanted">
            Seus artefatos mágicos favoritos reunidos em um só lugar
          </p>
          
          {favoriteIds.length > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-magical-gold/20 px-4 py-2 rounded-full border border-magical-gold/30">
              <span className="text-magical-gold font-semibold">
                {favoriteIds.length} {favoriteIds.length === 1 ? 'artefato' : 'artefatos'} no grimório
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3">
              {Array.from({ length: 12 }).map((_, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 rounded-2xl animate-pulse backdrop-blur-sm border border-magical-gold/20 h-64"
                />
              ))}
            </div>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-32 h-32 bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse border border-magical-gold/30">
              <Heart className="w-16 h-16 text-magical-gold/50" />
            </div>
            <h2 className="text-2xl font-bold text-magical-starlight mb-4 font-magical">
              Seu grimório está vazio
            </h2>
            <p className="text-magical-starlight/80 mb-6 font-enchanted">
              Explore nossa coleção e adicione artefatos mágicos aos seus favoritos
            </p>
            <a 
              href="/explorar" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-magical-mysticalPurple to-magical-deepPurple hover:from-magical-deepPurple hover:to-magical-mysticalPurple text-magical-starlight font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-magical-gold/20 border border-magical-gold/30 font-enchanted"
            >
              ✨ Explorar Coleção Mágica
            </a>
          </div>
        ) : (
          <ProductGrid 
            products={memoizedProducts}
            loading={false}
            compact={true}
          />
        )}
      </div>
    </div>
  );
};

export default Favoritos;
