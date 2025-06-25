
import { useCallback } from 'react';

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

export const useProductCardLogic = (product: Product) => {
  const getProductImages = useCallback((product: Product) => {
    return [
      product.imagem1, 
      product.imagem2, 
      product.imagem3, 
      product.imagem4, 
      product.imagem5,
      product.imagem6,
      product.imagem7
    ].filter(Boolean);
  }, []);

  const formatPrice = useCallback((price: string) => {
    if (price.includes('R$')) {
      return price;
    }
    return `R$ ${price}`;
  }, []);

  const handleBuyClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(product.link, '_blank');
  }, [product.link]);

  return {
    getProductImages,
    formatPrice,
    handleBuyClick
  };
};
