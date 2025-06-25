
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { useMagicalSounds } from '@/hooks/useMagicalSounds';
import { Card, CardContent } from "@/components/ui/card";
import { LazyImage } from '@/components/LazyImage';

interface Subcategory {
  subcategoria: string;
  count: number;
  sample_image: string;
  sample_product: string;
}

export const SubcategoriaLista = () => {
  const { categoria } = useParams<{ categoria: string }>();
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { playRandomMagicalSound } = useMagicalSounds();

  const fetchSubcategories = useCallback(async () => {
    if (!categoria) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('subcategoria, imagem1, produto')
        .eq('categoria', decodeURIComponent(categoria))
        .not('subcategoria', 'is', null)
        .not('subcategoria', 'eq', '');

      if (error) {
        console.error('Erro ao buscar subcategorias:', error);
        toast({
          title: "Erro Mágico",
          description: "Falha ao carregar as subcategorias mágicas",
          variant: "destructive",
        });
        return;
      }

      // Group and count subcategories
      const subcategoryMap = new Map<string, Subcategory>();
      
      data?.forEach((item) => {
        if (item.subcategoria && item.subcategoria.trim() !== '') {
          const existing = subcategoryMap.get(item.subcategoria);
          if (existing) {
            existing.count++;
          } else {
            subcategoryMap.set(item.subcategoria, {
              subcategoria: item.subcategoria,
              count: 1,
              sample_image: item.imagem1 || '',
              sample_product: item.produto || ''
            });
          }
        }
      });

      setSubcategories(Array.from(subcategoryMap.values()));
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar subcategorias",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [categoria, toast]);

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  const handleSubcategoryClick = useCallback((subcategoria: string) => {
    playRandomMagicalSound();
    navigate(`/categoria/${categoria}/subcategoria/${encodeURIComponent(subcategoria)}`);
  }, [categoria, navigate, playRandomMagicalSound]);

  const memoizedSubcategories = useMemo(() => subcategories, [subcategories]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-magical-midnight/95 via-magical-deepPurple/95 to-magical-midnight/95 backdrop-blur-md border-b border-magical-gold/20 z-20">
          <div className="flex items-center gap-4 p-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-magical-starlight hover:bg-magical-gold/20 hover:text-magical-gold transition-all duration-300 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-3 flex-1">
              <Sparkles className="w-6 h-6 text-magical-gold animate-sparkle" />
              <div>
                <h1 className="text-lg font-bold text-magical-starlight font-magical">
                  {categoria ? decodeURIComponent(categoria) : 'Subcategorias'}
                </h1>
                <p className="text-xs text-magical-starlight/80 font-enchanted">
                  Escolha uma coleção mágica
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 rounded-xl animate-pulse backdrop-blur-sm border border-magical-gold/20 h-32"
                />
              ))}
            </div>
          ) : memoizedSubcategories.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm animate-pulse border border-magical-gold/30">
                <Sparkles className="w-12 h-12 text-magical-gold/50" />
              </div>
              <h2 className="text-lg font-bold text-magical-starlight mb-2 font-magical">
                Nenhuma subcategoria encontrada
              </h2>
              <p className="text-magical-starlight/80 text-sm font-enchanted">
                Esta categoria ainda não possui subcategorias mágicas
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {memoizedSubcategories.map((subcategory, index) => (
                <Card
                  key={subcategory.subcategoria}
                  className="group overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-red-900/30 via-yellow-600/20 to-red-800/30 border-yellow-500/40 backdrop-blur-sm animate-fade-in"
                  onClick={() => handleSubcategoryClick(subcategory.subcategoria)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <LazyImage
                      src={subcategory.sample_image}
                      alt={subcategory.subcategoria}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-red-900/20 to-transparent" />
                    
                    {/* Badge com contador */}
                    <div className="absolute top-2 right-2">
                      <div className="bg-yellow-500/90 text-red-900 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold border border-yellow-400/30">
                        {subcategory.count}
                      </div>
                    </div>
                    
                    {/* Overlay com hover effect */}
                    <div className="absolute inset-0 bg-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-magical-starlight text-xs font-bold bg-red-900/50 px-2 py-1 rounded-full backdrop-blur-sm border border-yellow-400/30">
                        Explorar
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-3">
                    <h3 className="font-bold text-magical-starlight text-sm mb-1 line-clamp-2 group-hover:text-yellow-400 transition-colors duration-300 font-enchanted">
                      {subcategory.subcategoria}
                    </h3>
                    <p className="text-magical-starlight/70 text-xs font-enchanted">
                      {subcategory.count} {subcategory.count === 1 ? 'artefato' : 'artefatos'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubcategoriaLista;
