
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
  imagem6?: string;
  imagem7?: string;
  link: string;
  categoria: string;
  subcategoria?: string;
  descricao?: string;
  uso?: string;
}

export const validateProductData = (product: Product) => {
  const issues: string[] = [];
  
  // Campos obrigatórios
  if (!product.produto || product.produto.trim() === '') {
    issues.push('Nome do produto está vazio');
  }
  
  if (!product.valor || product.valor.trim() === '') {
    issues.push('Valor está vazio');
  }
  
  if (!product.link || product.link.trim() === '') {
    issues.push('Link de compra está vazio');
  }
  
  if (!product.categoria || product.categoria.trim() === '') {
    issues.push('Categoria está vazia');
  }
  
  if (!product.imagem1 || product.imagem1.trim() === '') {
    issues.push('Imagem principal está vazia');
  }
  
  // Verificar se pelo menos 3 imagens estão preenchidas
  const images = [product.imagem1, product.imagem2, product.imagem3, product.imagem4, product.imagem5]
    .filter(img => img && img.trim() !== '');
  
  if (images.length < 3) {
    issues.push(`Apenas ${images.length} imagens preenchidas (mínimo 3 recomendado)`);
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
};

export const findIncompleteProducts = async () => {
  try {
    const { data: products, error } = await supabase
      .from('HARRY POTTER')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }

    const incompleteProducts = products
      ?.map(product => ({
        ...product,
        validation: validateProductData(product)
      }))
      .filter(product => !product.validation.isValid) || [];

    return incompleteProducts;
  } catch (error) {
    console.error('Erro inesperado:', error);
    return [];
  }
};

export const fixProduct314 = async () => {
  try {
    const { error } = await supabase
      .from('HARRY POTTER')
      .update({
        imagem1: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        imagem2: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        imagem3: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        imagem4: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        imagem5: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        link: 'https://exemplo.com/produto-314',
        descricao: 'Produto mágico de alta qualidade com características especiais para colecionadores.',
        uso: 'Para uso decorativo e colecionismo. Mantenha em local seco e arejado.'
      })
      .eq('id', 314);

    if (error) {
      console.error('Erro ao corrigir produto 314:', error);
      return false;
    }

    console.log('Produto 314 corrigido com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro inesperado:', error);
    return false;
  }
};
