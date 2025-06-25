
// Utility functions for data validation and sanitization
export const validateProductData = (product: any): boolean => {
  if (!product) return false;
  
  // Check required fields
  const requiredFields = ['id', 'produto', 'valor', 'categoria'];
  for (const field of requiredFields) {
    if (!product[field] || product[field] === null || product[field] === undefined) {
      return false;
    }
  }
  
  // Check if produto is a valid string
  if (typeof product.produto !== 'string' || product.produto.trim() === '') {
    return false;
  }
  
  // Check if valor is valid (string with some content)
  if (typeof product.valor !== 'string' || product.valor.trim() === '') {
    return false;
  }
  
  // Check if categoria is valid
  if (typeof product.categoria !== 'string' || product.categoria.trim() === '') {
    return false;
  }
  
  return true;
};

export const sanitizeProductValue = (value: string | null | undefined): string => {
  if (!value || typeof value !== 'string') {
    return '0,00';
  }
  
  const trimmed = value.trim();
  if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') {
    return '0,00';
  }
  
  return trimmed;
};

export const parsePrice = (priceString: string | null | undefined): number => {
  // Handle null, undefined, or empty values
  if (!priceString || typeof priceString !== 'string') {
    console.warn('parsePrice: Invalid price string:', priceString);
    return 0;
  }
  
  const trimmed = priceString.trim();
  if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') {
    console.warn('parsePrice: Empty or invalid price string:', priceString);
    return 0;
  }
  
  try {
    // Remove all non-numeric characters except comma and dot
    const cleanPrice = trimmed.replace(/[^\d,\.]/g, '');
    
    if (cleanPrice === '') {
      console.warn('parsePrice: No numeric content in price string:', priceString);
      return 0;
    }
    
    // Replace comma with dot for parsing
    const normalizedPrice = cleanPrice.replace(',', '.');
    const parsed = parseFloat(normalizedPrice);
    
    // Check if parsing was successful
    if (isNaN(parsed)) {
      console.warn('parsePrice: Failed to parse price:', priceString);
      return 0;
    }
    
    return parsed;
  } catch (error) {
    console.error('parsePrice: Error parsing price:', priceString, error);
    return 0;
  }
};

export const formatPrice = (price: string | null | undefined): string => {
  const sanitized = sanitizeProductValue(price);
  if (sanitized.includes('R$')) {
    return sanitized;
  }
  return `R$ ${sanitized}`;
};

export const filterValidProducts = (products: any[]): any[] => {
  if (!Array.isArray(products)) {
    console.warn('filterValidProducts: Input is not an array:', products);
    return [];
  }
  
  return products.filter((product, index) => {
    const isValid = validateProductData(product);
    if (!isValid) {
      console.warn(`filterValidProducts: Invalid product at index ${index}:`, product);
    }
    return isValid;
  });
};
