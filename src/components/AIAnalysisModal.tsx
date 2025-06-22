
import { useState } from 'react';
import { X, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  produto: string;
  valor: string;
  categoria: string;
}

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: Product[];
  onAnalyze: (products: Product[]) => Promise<string>;
}

export const AIAnalysisModal = ({ isOpen, onClose, selectedProducts, onAnalyze }: AIAnalysisModalProps) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    if (selectedProducts.length === 0) return;
    
    setLoading(true);
    try {
      const result = await onAnalyze(selectedProducts);
      setAnalysis(result);
      setAnalyzed(true);
    } catch (error) {
      console.error('Erro na análise:', error);
      setAnalysis('Ops! Ocorreu um erro ao analisar os produtos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAnalysis('');
    setAnalyzed(false);
    onClose();
  };

  const formatAnalysis = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Headers (linhas que começam com números ou **texto**)
      if (line.match(/^\d+\.\s\*\*/) || line.match(/^\*\*.*\*\*$/)) {
        const cleanLine = line.replace(/\*\*/g, '');
        return (
          <h3 key={index} className="font-bold text-gray-800 mt-4 mb-2 text-sm">
            {cleanLine}
          </h3>
        );
      }
      
      // Sub-headers (linhas com - )
      if (line.trim().startsWith('- ')) {
        return (
          <p key={index} className="text-gray-700 ml-4 mb-1 text-xs">
            • {line.replace(/^- /, '')}
          </p>
        );
      }
      
      // Texto normal
      return (
        <p key={index} className="text-gray-600 mb-2 text-xs leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white border-0 p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full p-2">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">IA - Me Ajuda Escolher</h2>
                  <p className="text-sm text-purple-100">
                    Análise inteligente de produtos selecionados
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-white hover:bg-white/20 border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-110 rounded-full p-2 bg-white/10"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {!analyzed ? (
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Produtos Selecionados para Análise
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Nossa IA irá analisar e comparar os produtos para te ajudar a escolher
                  </p>
                </div>

                {/* Produtos Selecionados */}
                <div className="space-y-3 mb-6">
                  {selectedProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm line-clamp-1">
                          {product.produto}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-red-500 font-bold text-xs">
                            Menos de {product.valor}
                          </span>
                          {product.categoria && (
                            <Badge variant="secondary" className="text-xs">
                              {product.categoria}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botão Analisar */}
                <Button
                  onClick={handleAnalyze}
                  disabled={loading || selectedProducts.length === 0}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
                >
                  {loading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Analisando produtos...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analisar com IA
                    </>
                  )}
                </Button>

                {selectedProducts.length === 0 && (
                  <p className="text-center text-gray-500 text-sm mt-4">
                    Selecione produtos na página inicial para começar a análise
                  </p>
                )}
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="font-bold text-gray-800">Análise Completa</h3>
                  <Badge className="bg-green-100 text-green-700">
                    {selectedProducts.length} produtos analisados
                  </Badge>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  {formatAnalysis(analysis)}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button
                    onClick={() => {
                      setAnalyzed(false);
                      setAnalysis('');
                    }}
                    variant="outline"
                    className="mr-3"
                  >
                    Nova Análise
                  </Button>
                  <Button onClick={handleClose} className="bg-purple-500 hover:bg-purple-600">
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
