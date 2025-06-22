
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, GitCompare, Sparkles, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToastNotifications } from '@/hooks/useToastNotifications';

interface Product {
  id: number;
  name: string;
  price: string;
  images: string[];
  link: string;
  video?: string;
}

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProduct: Product;
}

interface DatabaseProduct {
  id: number;
  produto: string;
  valor: string;
  imagem1: string;
  imagem2: string;
  imagem3: string;
  imagem4: string;
  imagem5: string;
  link: string;
  categoria: string;
  video: string;
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  isOpen,
  onClose,
  currentProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<DatabaseProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<DatabaseProduct | null>(null);
  const [comparison, setComparison] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { showSuccess, showError, showLoading } = useToastNotifications();

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchProducts();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const searchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('SHOPEE')
        .select('*')
        .ilike('produto', `%${searchTerm}%`)
        .neq('id', currentProduct.id)
        .limit(8);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      showError("Erro ao buscar produtos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (product: DatabaseProduct) => {
    setSelectedProduct(product);
    setSearchResults([]);
    setSearchTerm('');
  };

  const handleCompare = async () => {
    if (!selectedProduct) return;

    try {
      setIsAnalyzing(true);
      showLoading("Analisando diferenças entre os produtos");

      const product1 = {
        nome: currentProduct.name,
        preco: currentProduct.price,
        link: currentProduct.link
      };

      const product2 = {
        nome: selectedProduct.produto,
        preco: selectedProduct.valor,
        link: selectedProduct.link
      };

      const { data, error } = await supabase.functions.invoke('compare-products', {
        body: { 
          product1,
          product2
        }
      });

      if (error) throw error;

      setComparison(data.comparison || 'Comparação não disponível');
      showSuccess("Comparação concluída!");
    } catch (error) {
      console.error('Erro na comparação:', error);
      showError("Erro ao comparar produtos");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetModal = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedProduct(null);
    setComparison('');
    setIsAnalyzing(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-600" />
            Comparar Produtos com IA
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Current Product */}
          <div>
            <h3 className="font-semibold mb-2">Produto Atual:</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={currentProduct.images[0]} 
                    alt={currentProduct.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-2">{currentProduct.name}</h4>
                    <p className="text-red-500 font-bold">{currentProduct.price}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search for comparison product */}
          {!selectedProduct && (
            <div>
              <h3 className="font-semibold mb-2">Buscar produto para comparar:</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Digite o nome do produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {isLoading && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin" />
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((product) => (
                    <Card 
                      key={product.id} 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleProductSelect(product)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.imagem1} 
                            alt={product.produto}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium line-clamp-2 text-sm">{product.produto}</p>
                            <p className="text-red-500 font-bold text-sm">Menos de {product.valor}</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {product.categoria}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Selected Product for Comparison */}
          {selectedProduct && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Produto para Comparação:</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedProduct(null);
                    setComparison('');
                  }}
                >
                  Trocar Produto
                </Button>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={selectedProduct.imagem1} 
                      alt={selectedProduct.produto}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-2">{selectedProduct.produto}</h4>
                      <p className="text-red-500 font-bold">Menos de {selectedProduct.valor}</p>
                      <Badge variant="secondary" className="mt-1">
                        {selectedProduct.categoria}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Compare Button */}
          {selectedProduct && !comparison && (
            <div className="text-center">
              <Button 
                onClick={handleCompare}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Comparar com IA
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Comparison Result */}
          {comparison && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Análise Comparativa da IA:
              </h3>
              <Card>
                <CardContent className="p-4">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700">
                      {comparison}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={() => window.open(currentProduct.link, '_blank')}
                  variant="outline"
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Comprar Produto 1
                </Button>
                {selectedProduct && (
                  <Button 
                    onClick={() => window.open(selectedProduct.link, '_blank')}
                    variant="outline"
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Comprar Produto 2
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
