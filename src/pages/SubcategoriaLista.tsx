
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SubcategoryCard } from '@/components/SubcategoryCard';
import { useToast } from '@/hooks/use-toast';
import { useMagicalSounds } from '@/hooks/useMagicalSounds';

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
    // Magic sound ONLY when clicking on subcategories
    playRandomMagicalSound();
    navigate(`/categoria/${categoria}/subcategoria/${encodeURIComponent(subcategoria)}`);
  }, [categoria, navigate, playRandomMagicalSound]);

  const memoizedSubcategories = useMemo(() => subcategories, [subcategories]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate('/explorar')}
            className="text-magical-starlight hover:bg-magical-gold/20 hover:text-magical-gold transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-magical-gold animate-sparkle" />
            <h1 className="text-xl font-bold text-magical-starlight font-magical">
              {categoria ? decodeURIComponent(categoria) : 'Subcategorias'}
            </h1>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 rounded-2xl animate-pulse backdrop-blur-sm border border-magical-gold/20 h-40"
              />
            ))}
          </div>
        ) : memoizedSubcategories.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse border border-magical-gold/30">
              <Sparkles className="w-12 h-12 text-magical-gold/50" />
            </div>
            <h2 className="text-xl font-bold text-magical-starlight mb-4 font-magical">
              Nenhuma subcategoria encontrada
            </h2>
            <p className="text-magical-starlight/80 font-enchanted text-sm">
              Esta categoria ainda não possui subcategorias mágicas
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {memoizedSubcategories.map((subcategory, index) => (
              <div
                key={subcategory.subcategoria}
                className="group overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-magical-starlight/10 to-magical-mysticalPurple/20 border-magical-gold/30 backdrop-blur-sm hover:border-magical-gold/60 animate-fade-in rounded-2xl border"
                onClick={() => handleSubcategoryClick(subcategory.subcategoria)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={subcategory.sample_image}
                    alt={subcategory.subcategoria}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-magical-midnight/80 via-magical-midnight/20 to-transparent" />
                  
                  {/* Badge com contador */}
                  <div className="absolute top-2 right-2">
                    <div className="bg-magical-gold/90 text-magical-midnight px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold border border-magical-gold/30">
                      <Package className="w-3 h-3" />
                      {subcategory.count}
                    </div>
                  </div>
                  
                  {/* Overlay com hover effect */}
                  <div className="absolute inset-0 bg-magical-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-magical-starlight text-xs font-bold bg-magical-midnight/50 px-2 py-1 rounded-full backdrop-blur-sm border border-magical-gold/30">
                      Explorar
                    </div>
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="font-bold text-magical-starlight text-sm mb-1 line-clamp-2 group-hover:text-magical-gold transition-colors duration-300 font-enchanted">
                    {subcategory.subcategoria}
                  </h3>
                  <p className="text-magical-starlight/70 text-xs font-enchanted">
                    {subcategory.count} {subcategory.count === 1 ? 'item' : 'itens'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubcategoriaLista;
