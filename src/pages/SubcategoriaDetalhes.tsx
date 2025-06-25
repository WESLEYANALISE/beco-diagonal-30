
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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

interface Subcategory {
  subcategoria: string;
  count: number;
  sample_image: string;
  sample_product: string;
}

export const SubcategoriaDetalhes = () => {
  const { categoria: paramsCategoria, subcategoria: paramsSubcategoria } = useParams<{ categoria: string; subcategoria: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showingProducts, setShowingProducts] = useState(false);
  const { toast } = useToast();

  // Determinar se estamos mostrando subcategorias ou produtos
  const categoria = paramsCategoria || searchParams.get('categoria') || '';
  const subcategoria = paramsSubcategoria || searchParams.get('subcategoria') || '';

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

      console.log('Produtos encontrados:', data?.length);
      setProducts(data || []);
      setShowingProducts(true);
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
    if (subcategoria) {
      // Se temos subcategoria, buscar produtos
      fetchProducts();
    } else {
      // Se não temos subcategoria, buscar subcategorias
      fetchSubcategories();
    }
  }, [subcategoria, fetchProducts, fetchSubcategories]);

  const handleSubcategoryClick = useCallback((subcategoriaName: string) => {
    navigate(`/categoria/${categoria}/subcategoria/${encodeURIComponent(subcategoriaName)}`);
  }, [categoria, navigate]);

  const decodedCategoria = categoria ? decodeURIComponent(categoria) : '';
  const decodedSubcategoria = subcategoria ? decodeURIComponent(subcategoria) : '';

  const getBackRoute = () => {
    if (showingProducts) {
      return `/categoria/${categoria}`;
    }
    return '/categorias';
  };

  if (showingProducts) {
    // Mostrar produtos de uma subcategoria específica
    return (
      <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
        <div className="max-w-md mx-auto px-4 py-8">
          {/* Header com navegação */}
          <div className="flex flex-col gap-4 mb-8 animate-fade-in">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(getBackRoute())}
                className="text-magical-starlight hover:bg-magical-gold/20 hover:text-magical-gold transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
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
                <h1 className="text-xl font-bold text-magical-starlight font-magical">
                  {decodedSubcategoria}
                </h1>
                <p className="text-magical-starlight/80 font-enchanted text-sm">
                  Artefatos de {decodedCategoria}
                </p>
              </div>
            </div>
            
            {/* Stats */}
            {products.length > 0 && (
              <div className="flex items-center gap-2 bg-magical-gold/20 px-4 py-2 rounded-full border border-magical-gold/30 w-fit">
                <Package className="w-4 h-4 text-magical-gold" />
                <span className="text-magical-gold font-semibold font-enchanted text-sm">
                  {products.length} {products.length === 1 ? 'artefato encontrado' : 'artefatos encontrados'}
                </span>
              </div>
            )}
          </div>

          {/* Grid de produtos */}
          <ProductGrid 
            products={products}
            loading={loading}
            compact={true}
          />
        </div>
      </div>
    );
  }

  // Mostrar subcategorias
  return (
    <div className="min-h-screen bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate('/categorias')}
            className="text-magical-starlight hover:bg-magical-gold/20 hover:text-magical-gold transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-magical-gold animate-sparkle" />
            <h1 className="text-xl font-bold text-magical-starlight font-magical">
              {decodedCategoria}
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
        ) : subcategories.length === 0 ? (
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
            {subcategories.map((subcategory, index) => (
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

export default SubcategoriaDetalhes;
