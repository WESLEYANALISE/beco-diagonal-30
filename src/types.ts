
export interface Product {
  id: number;
  produto: string;
  valor: string;
  imagem1: string;
  imagem2?: string;
  imagem3?: string;
  imagem4?: string;
  imagem5?: string;
  imagem6?: string;
  imagem7?: string;
  video?: string;
  link: string;
  categoria: string;
  subcategoria?: string;
  descricao?: string;
  uso?: string;
  clicks?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  productCount?: number;
}

export interface FavoriteItem {
  id: number;
  productId: number;
  userId?: string;
  createdAt: string;
}

export interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  category?: string;
  duration?: number;
}

export interface SearchFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy?: 'nome' | 'preco' | 'clicks';
  sortOrder?: 'asc' | 'desc';
}
