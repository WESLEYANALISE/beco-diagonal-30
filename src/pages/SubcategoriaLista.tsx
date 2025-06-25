
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 py-8">
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
            <h1 className="text-2xl md:text-3xl font-bold text-magical-starlight font-magical">
              {categoria ? decodeURIComponent(categoria) : 'Subcategorias'}
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 rounded-2xl animate-pulse backdrop-blur-sm border border-magical-gold/20 h-48"
              />
            ))}
          </div>
        ) : memoizedSubcategories.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-32 h-32 bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-pulse border border-magical-gold/30">
              <Sparkles className="w-16 h-16 text-magical-gold/50" />
            </div>
            <h2 className="text-2xl font-bold text-magical-starlight mb-4 font-magical">
              Nenhuma subcategoria encontrada
            </h2>
            <p className="text-magical-starlight/80 font-enchanted">
              Esta categoria ainda não possui subcategorias mágicas
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {memoizedSubcategories.map((subcategory, index) => (
              <SubcategoryCard
                key={subcategory.subcategoria}
                subcategory={subcategory}
                onClick={() => handleSubcategoryClick(subcategory.subcategoria)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubcategoriaLista;
