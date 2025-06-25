
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { validateProductData, filterValidProducts } from '@/utils/dataValidation';

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
    if (!categoria || typeof categoria !== 'string' || categoria.trim() === '') {
      console.warn('useSubcategories: Invalid categoria parameter:', categoria);
      setSubcategories([]);
      setHasSubcategories(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching subcategories for categoria:', categoria);
      
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('subcategoria, imagem1')
        .eq('categoria', categoria)
        .not('subcategoria', 'is', null)
        .neq('subcategoria', '');

      if (error) {
        console.error('Supabase error fetching subcategories:', error);
        throw error;
      }

      if (!data) {
        console.warn('No data returned from subcategories query');
        setSubcategories([]);
        setHasSubcategories(false);
        return;
      }

      console.log(`Fetched ${data.length} subcategory records`);

      // Filter valid data entries
      const validData = data.filter(item => {
        const isValid = item && 
          typeof item.subcategoria === 'string' && 
          item.subcategoria.trim() !== '' &&
          item.subcategoria.toLowerCase() !== 'null' &&
          item.subcategoria.toLowerCase() !== 'undefined';
        
        if (!isValid) {
          console.warn('Invalid subcategory data:', item);
        }
        
        return isValid;
      });

      if (validData.length > 0) {
        // Count products per subcategory and get sample image
        const subcategoryCount = validData.reduce((acc: Record<string, { count: number; image: string }>, item) => {
          const subcat = item.subcategoria?.trim();
          if (subcat && subcat !== '') {
            if (!acc[subcat]) {
              acc[subcat] = { 
                count: 0, 
                image: item.imagem1 || '/placeholder.svg'
              };
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

        console.log(`Found ${subcategoryStats.length} valid subcategories:`, subcategoryStats);
        setSubcategories(subcategoryStats);
        setHasSubcategories(subcategoryStats.length > 0);
      } else {
        console.log('No valid subcategories found for categoria:', categoria);
        setSubcategories([]);
        setHasSubcategories(false);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
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
