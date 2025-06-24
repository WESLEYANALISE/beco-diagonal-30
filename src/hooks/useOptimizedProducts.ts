
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

interface UseOptimizedProductsReturn {
  products: Product[];
  loading: boolean;
  categories: string[];
  getProductsByCategory: (category: string) => Product[];
  getProductsWithVideos: () => Product[];
  shuffleProducts: (products: Product[]) => Product[];
}

export const useOptimizedProducts = (): UseOptimizedProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoized categories calculation
  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.categoria).filter(Boolean))].sort();
  }, [products]);

  // Optimized fetch with specific columns only
  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('id, produto, valor, video, imagem1, imagem2, imagem3, imagem4, imagem5, link, categoria')
        .order('id');

      if (error) throw error;

      // Shuffle products immediately to avoid repeated sorting
      const shuffled = shuffleArray(data || []);
      setProducts(shuffled);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized shuffle function
  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Memoized filter functions
  const getProductsByCategory = useCallback((category: string) => {
    if (category === 'todas') return products;
    return products.filter(p => p.categoria === category);
  }, [products]);

  const getProductsWithVideos = useCallback(() => {
    return products.filter(p => 
      p.video && 
      p.video.trim() !== '' && 
      (p.video.toLowerCase().includes('.mp4') || p.video.toLowerCase().includes('mp4'))
    );
  }, [products]);

  const shuffleProducts = useCallback((productsToShuffle: Product[]) => {
    return shuffleArray(productsToShuffle);
  }, [shuffleArray]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    categories,
    getProductsByCategory,
    getProductsWithVideos,
    shuffleProducts
  };
};
