
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ProductGrid } from '@/components/ProductGrid';
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

export const SubcategoriaDetalhes = () => {
  const { categoria, subcategoria } = useParams<{ categoria: string; subcategoria: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = useCallback(async () => {
    if (!categoria || !subcategoria) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('*')
        .eq('categoria', decodeURIComponent(categoria))
        .eq('subcategoria', decodeURIComponent(subcategoria))
        .order('id', { ascending: false });

      if (error) {
        console.error('Erro ao buscar artefatos da subcategoria:', error);
        toast({
          title: "Erro Mágico",
          description: "Falha ao carregar os artefatos desta subcategoria",
          variant: "destructive",
        });
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar artefatos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [categoria, subcategoria, toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const memoizedProducts = useMemo(() => products, [products]);

  const decodedCategoria = categoria ? decodeURIComponent(categoria) : '';
  const decodedSubcategoria = subcategoria ? decodeURIComponent(subcategoria) : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header com navegação */}
        <div className="flex flex-col gap-4 mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/categoria/${categoria}`)}
              className="text-magical-starlight hover:bg-magical-gold/20 hover:text-magical-gold transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar para {decodedCategoria}
            </Button>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-magical-starlight/80 font-enchanted">
            <span>Explorar</span>
            <span>/</span>
            <span className="text-magical-gold">{decodedCategoria}</span>
            <span>/</span>
            <span className="text-magical-starlight">{decodedSubcategoria}</span>
          </div>

          {/* Título */}
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-magical-gold animate-sparkle" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-magical-starlight font-magical">
                {decodedSubcategoria}
              </h1>
              <p className="text-magical-starlight/80 font-enchanted">
                Artefatos mágicos da categoria {decodedCategoria}
              </p>
            </div>
          </div>
          
          {/* Stats */}
          {products.length > 0 && (
            <div className="flex items-center gap-2 bg-magical-gold/20 px-4 py-2 rounded-full border border-magical-gold/30 w-fit">
              <Package className="w-4 h-4 text-magical-gold" />
              <span className="text-magical-gold font-semibold font-enchanted">
                {products.length} {products.length === 1 ? 'artefato encontrado' : 'artefatos encontrados'}
              </span>
            </div>
          )}
        </div>

        {/* Grid de produtos */}
        <ProductGrid 
          products={memoizedProducts}
          loading={loading}
          compact={true}
        />
      </div>
    </div>
  );
};

export default SubcategoriaDetalhes;
