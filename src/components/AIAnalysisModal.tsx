
import { useState } from 'react';
import { X, Sparkles, Clock, CheckCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [scrollPosition, setScrollPosition] = useState(0);

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
    setScrollPosition(0);
    onClose();
  };

  const formatAnalysis = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Headers com ** (exemplo: **Análise Detalhada**)
      if (line.match(/^\*\*.*\*\*$/)) {
        const cleanLine = line.replace(/\*\*/g, '');
        return (
          <h2 key={index} className="font-bold text-gray-800 mt-6 mb-3 text-lg border-b border-gray-200 pb-2">
            {cleanLine}
          </h2>
        );
      }
      
      // Headers numerados (exemplo: **1. Produto A**)
      if (line.match(/^\d+\.\s*\*\*.*\*\*$/)) {
        const cleanLine = line.replace(/\*\*/g, '');
        return (
          <h3 key={index} className="font-bold text-gray-800 mt-4 mb-2 text-base bg-gray-50 p-2 rounded">
            {cleanLine}
          </h3>
        );
      }
      
      // Sub-items com - 
      if (line.trim().startsWith('- ')) {
        const cleanLine = line.replace(/^- /, '');
        return (
          <div key={index} className="flex items-start gap-2 ml-4 mb-2">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-700 text-sm leading-relaxed">{cleanLine}</p>
          </div>
        );
      }
      
      // Headers simples começando com **
      if (line.match(/^\*\*[^*]+\*\*/)) {
        const cleanLine = line.replace(/\*\*/g, '');
        return (
          <h4 key={index} className="font-semibold text-gray-800 mt-3 mb-2 text-sm">
            {cleanLine}
          </h4>
        );
      }
      
      // Texto normal (pode conter ** no meio para negrito)
      if (line.includes('**')) {
        const parts = line.split(/(\*\*[^*]+\*\*)/);
        return (
          <p key={index} className="text-gray-600 mb-2 text-sm leading-relaxed">
            {parts.map((part, partIndex) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={partIndex}>{part.replace(/\*\*/g, '')}</strong>;
              }
              return part;
            })}
          </p>
        );
      }
      
      // Texto normal
      return (
        <p key={index} className="text-gray-600 mb-2 text-sm leading-relaxed">
          {line}
        </p>
      );
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollPercentage = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    setScrollPosition(scrollPercentage);
  };

  const scrollToTop = () => {
    const scrollElement = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      scrollElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    const scrollElement = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      scrollElement.scrollTo({ top: scrollElement.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white border-0 p-0 overflow-hidden">
        <DialogTitle className="sr-only">
          Análise IA - Me Ajuda Escolher
        </DialogTitle>
        <DialogDescription className="sr-only">
          Análise inteligente dos produtos selecionados para ajudar na sua decisão de compra
        </DialogDescription>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white relative flex-shrink-0">
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
          <div className="flex-1 overflow-hidden relative">
            {!analyzed ? (
              <div className="p-6 h-full overflow-auto">
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
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between gap-2 p-4 pb-2 border-b flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="font-bold text-gray-800">Análise Completa</h3>
                    <Badge className="bg-green-100 text-green-700">
                      {selectedProducts.length} produtos analisados
                    </Badge>
                  </div>
                  
                  {/* Scroll Controls */}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={scrollToTop}
                      className="p-1 h-8 w-8"
                      title="Ir para o topo"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={scrollToBottom}
                      className="p-1 h-8 w-8"
                      title="Ir para o final"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Scroll Progress Bar */}
                <div className="w-full bg-gray-200 h-1 flex-shrink-0">
                  <div 
                    className="bg-purple-500 h-1 transition-all duration-300"
                    style={{ width: `${scrollPosition}%` }}
                  />
                </div>
                
                <ScrollArea className="flex-1 p-4" onScrollCapture={handleScroll}>
                  <div className="prose prose-sm max-w-none">
                    {formatAnalysis(analysis)}
                  </div>
                </ScrollArea>

                <div className="p-4 pt-2 border-t flex-shrink-0 bg-gray-50">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setAnalyzed(false);
                        setAnalysis('');
                        setScrollPosition(0);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Nova Análise
                    </Button>
                    <Button 
                      onClick={handleClose} 
                      size="sm"
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
