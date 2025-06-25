
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sparkles, Calendar } from 'lucide-react';
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

export const Novos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchNewestProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('*')
        .order('id', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Erro ao buscar novos artefatos:', error);
        toast({
          title: "Erro Mágico",
          description: "Falha ao carregar os novos artefatos mágicos",
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
  }, [toast]);

  useEffect(() => {
    fetchNewestProducts();
  }, [fetchNewestProducts]);

  const memoizedProducts = useMemo(() => products, [products]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-magical-gold animate-sparkle" />
            <h1 className="text-3xl md:text-4xl font-bold text-magical-starlight font-magical">
              Novos Artefatos Mágicos
            </h1>
            <Calendar className="w-8 h-8 text-magical-gold animate-pulse" />
          </div>
          <p className="text-magical-starlight/80 text-lg font-enchanted mb-4">
            Descubra os artefatos mais recentemente adicionados à nossa coleção
          </p>
          
          {products.length > 0 && (
            <div className="inline-flex items-center gap-2 bg-magical-gold/20 px-4 py-2 rounded-full border border-magical-gold/30">
              <span className="text-magical-gold font-semibold">
                {products.length} novos artefatos disponíveis
              </span>
            </div>
          )}
        </div>

        <ProductGrid 
          products={memoizedProducts}
          loading={loading}
          compact={true}
        />
      </div>
    </div>
  );
};

export default Novos;
