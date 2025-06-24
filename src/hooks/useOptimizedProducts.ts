
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
}

// Cache global para produtos
let productsCache: Product[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useOptimizedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    // Verificar cache primeiro
    const now = Date.now();
    if (productsCache && (now - cacheTimestamp) < CACHE_DURATION) {
      setProducts(productsCache);
      setLoading(false);
      return;
    }

    try {
      // Query otimizada - buscar apenas campos necessários
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('id, produto, valor, video, imagem1, imagem2, imagem3, imagem4, imagem5, link, categoria')
        .order('id')
        .limit(200); // Limitar resultados iniciais

      if (error) throw error;

      const processedProducts = data || [];
      
      // Atualizar cache
      productsCache = processedProducts;
      cacheTimestamp = now;
      
      setProducts(processedProducts);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Memoizar produtos filtrados para evitar recálculos
  const memoizedProducts = useMemo(() => {
    return {
      all: products,
      withVideos: products.filter(p => p.video && p.video.trim() !== ''),
      byCategory: (category: string) => products.filter(p => p.categoria === category),
      shuffled: () => {
        const shuffled = [...products];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      }
    };
  }, [products]);

  return {
    products: memoizedProducts,
    loading,
    refetch: fetchProducts
  };
};
