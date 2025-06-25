
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface SubcategoryData {
  subcategoria: string;
  count: number;
  sampleImage: string;
}

export const useSubcategories = (categoria: string) => {
  const [subcategories, setSubcategories] = useState<SubcategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSubcategories, setHasSubcategories] = useState(false);

  const fetchSubcategories = useCallback(async () => {
    if (!categoria) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('subcategoria, imagem1')
        .eq('categoria', categoria)
        .not('subcategoria', 'is', null)
        .neq('subcategoria', '');

      if (error) throw error;

      if (data && data.length > 0) {
        // Count products per subcategory and get sample image
        const subcategoryCount = data.reduce((acc: Record<string, { count: number; image: string }>, item) => {
          const subcat = item.subcategoria;
          if (subcat && subcat.trim() !== '') {
            if (!acc[subcat]) {
              acc[subcat] = { count: 0, image: item.imagem1 || '' };
            }
            acc[subcat].count += 1;
          }
          return acc;
        }, {});

        const subcategoryStats = Object.entries(subcategoryCount).map(([subcategoria, data]) => ({
          subcategoria,
          count: data.count,
          sampleImage: data.image
        }));

        setSubcategories(subcategoryStats);
        setHasSubcategories(subcategoryStats.length > 0);
      } else {
        setSubcategories([]);
        setHasSubcategories(false);
      }
    } catch (error) {
      setSubcategories([]);
      setHasSubcategories(false);
    } finally {
      setLoading(false);
    }
  }, [categoria]);

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  return { subcategories, loading, hasSubcategories, refetch: fetchSubcategories };
};
