
import { useState, useEffect, useMemo, useCallback } from 'react';
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
  click_count?: number;
}

export const useOptimizedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cache, setCache] = useState<Map<string, Product[]>>(new Map());

  // Função para buscar produtos com cache inteligente
  const fetchProducts = useCallback(async () => {
    try {
      const cacheKey = 'all_products';
      const cachedProducts = cache.get(cacheKey);
      
      if (cachedProducts) {
        setProducts(cachedProducts);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('SHOPEE')
        .select('id, produto, valor, video, imagem1, imagem2, imagem3, imagem4, imagem5, link, categoria')
        .order('id')
        .limit(500); // Limitar para melhor desempenho

      if (error) throw error;

      const processedProducts = data || [];
      setProducts(processedProducts);
      setCache(prev => new Map(prev).set(cacheKey, processedProducts));
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  // Memoização de produtos filtrados
  const productsWithVideos = useMemo(() => {
    return products.filter(product => product.video && product.video.trim() !== '');
  }, [products]);

  const categories = useMemo(() => {
    return [...new Set(products.map(product => product.categoria).filter(Boolean))];
  }, [products]);

  const getProductsByCategory = useCallback((category: string, limit: number = 12) => {
    return products.filter(p => p.categoria === category).slice(0, limit);
  }, [products]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    productsWithVideos,
    categories,
    loading,
    getProductsByCategory,
    refetch: fetchProducts
  };
};
