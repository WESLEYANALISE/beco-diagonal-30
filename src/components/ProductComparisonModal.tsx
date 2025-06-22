
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap, ShoppingCart, ArrowRight } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from 'react-markdown';

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

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProduct: Product;
  availableProducts: Product[];
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  isOpen,
  onClose,
  currentProduct,
  availableProducts
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [comparison, setComparison] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedProduct = availableProducts.find(p => p.id.toString() === selectedProductId);

  const handleCompare = async () => {
    if (!selectedProduct) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('compare-products', {
        body: {
          product1: currentProduct,
          product2: selectedProduct
        }
      });

      if (error) throw error;
      setComparison(data.analysis);
    } catch (error) {
      console.error('Erro ao comparar produtos:', error);
      setComparison('Erro ao gerar comparação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    if (price.includes('R$')) return price;
    return `R$ ${price}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Zap className="w-5 h-5 text-orange-500" />
            Comparação Inteligente de Produtos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Seleção de produtos para comparar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Produto atual */}
            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <Badge className="mb-2 bg-orange-500">Produto Atual</Badge>
                <div className="flex gap-3">
                  <img 
                    src={currentProduct.imagem1} 
                    alt={currentProduct.produto}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {currentProduct.produto}
                    </h3>
                    <p className="text-orange-600 font-bold">
                      Menos de {formatPrice(currentProduct.valor)}
                    </p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {currentProduct.categoria}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seletor do segundo produto */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <Badge className="mb-2 bg-blue-500">Comparar com</Badge>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger className="mb-3">
                    <SelectValue placeholder="Selecione um produto para comparar" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {availableProducts
                      .filter(p => p.id !== currentProduct.id)
                      .map(product => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium line-clamp-1">
                              {product.produto.slice(0, 40)}...
                            </span>
                            <span className="text-blue-600 font-bold text-xs">
                              {formatPrice(product.valor)}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>

                {selectedProduct && (
                  <div className="flex gap-3">
                    <img 
                      src={selectedProduct.imagem1} 
                      alt={selectedProduct.produto}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                        {selectedProduct.produto}
                      </h3>
                      <p className="text-blue-600 font-bold">
                        Menos de {formatPrice(selectedProduct.valor)}
                      </p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {selectedProduct.categoria}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Botão de comparação */}
          <div className="text-center">
            <Button 
              onClick={handleCompare}
              disabled={!selectedProduct || isLoading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Comparar com IA
                </>
              )}
            </Button>
          </div>

          {/* Resultado da comparação */}
          {comparison && (
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-semibold">Análise Comparativa da IA</h3>
                </div>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{comparison}</ReactMarkdown>
                </div>
                
                {/* Botões de ação */}
                <div className="flex gap-3 mt-6 pt-4 border-t">
                  <Button 
                    onClick={() => window.open(currentProduct.link, '_blank')}
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Comprar {currentProduct.produto.slice(0, 20)}...
                  </Button>
                  <Button 
                    onClick={() => selectedProduct && window.open(selectedProduct.link, '_blank')}
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                    disabled={!selectedProduct}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Comprar {selectedProduct?.produto.slice(0, 20)}...
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
