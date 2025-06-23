
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-0">
        {/* Header com botão de fechar visível */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-500 to-red-500">
          <h2 className="text-lg font-bold text-white">Sobre o App</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Shopee Ofertas
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Versão 1.0.0
            </p>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">O que é?</h4>
              <p>
                Um aplicativo que reúne os melhores produtos da Shopee com preços incríveis, 
                organizados por categorias para facilitar sua busca.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Funcionalidades:</h4>
              <ul className="space-y-1 ml-2">
                <li>• Navegação por categorias</li>
                <li>• Sistema de favoritos</li>
                <li>• Busca inteligente</li>
                <li>• Vídeos demonstrativos</li>
                <li>• Galeria de imagens</li>
                <li>• Links diretos para compra</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Como usar:</h4>
              <p>
                Explore os produtos, favorite os que mais gostar e clique em 
                "Comprar na Shopee" para finalizar sua compra no site oficial.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t text-center">
            <p className="text-xs text-gray-500">
              Desenvolvido com ❤️ para oferecer a melhor experiência de compras
            </p>
          </div>

          {/* Botão de fechar inferior */}
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            Entendi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
