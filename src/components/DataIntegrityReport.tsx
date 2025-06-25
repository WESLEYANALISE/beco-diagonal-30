
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, RefreshCw, Wrench } from 'lucide-react';
import { findIncompleteProducts, fixProduct314, validateProductData } from '@/utils/dataValidation';
import { useToast } from '@/hooks/use-toast';

interface IncompleteProduct {
  id: number;
  produto: string;
  categoria: string;
  validation: {
    isValid: boolean;
    issues: string[];
  };
}

export const DataIntegrityReport: React.FC = () => {
  const [incompleteProducts, setIncompleteProducts] = useState<IncompleteProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [fixing314, setFixing314] = useState(false);
  const { toast } = useToast();

  const checkDataIntegrity = async () => {
    setLoading(true);
    try {
      const incomplete = await findIncompleteProducts();
      setIncompleteProducts(incomplete);
      
      toast({
        title: "Verificação Concluída",
        description: `${incomplete.length} produtos com dados incompletos encontrados`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao verificar integridade dos dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFix314 = async () => {
    setFixing314(true);
    try {
      const success = await fixProduct314();
      if (success) {
        toast({
          title: "Sucesso",
          description: "Produto ID 314 corrigido com sucesso!",
        });
        // Recarregar a lista
        await checkDataIntegrity();
      } else {
        toast({
          title: "Erro",
          description: "Falha ao corrigir produto 314",
          variant: "destructive",
        });
      }
    } finally {
      setFixing314(false);
    }
  };

  useEffect(() => {
    checkDataIntegrity();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-magical-midnight via-magical-deepPurple to-magical-mysticalPurple min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-magical-starlight/10 border-magical-gold/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-magical-starlight">
              <AlertTriangle className="w-6 h-6 text-magical-gold" />
              Relatório de Integridade dos Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Button
                onClick={checkDataIntegrity}
                disabled={loading}
                className="bg-magical-gold hover:bg-magical-darkGold text-magical-midnight"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Verificar Dados
              </Button>
              
              <Button
                onClick={handleFix314}
                disabled={fixing314}
                variant="outline"
                className="border-magical-gold/30 text-magical-gold hover:bg-magical-gold/10"
              >
                <Wrench className={`w-4 h-4 mr-2 ${fixing314 ? 'animate-pulse' : ''}`} />
                Corrigir Produto 314
              </Button>
              
              <div className="flex items-center gap-2">
                {incompleteProducts.length === 0 ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-semibold">Todos os dados estão íntegros</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">
                      {incompleteProducts.length} produtos com problemas
                    </span>
                  </>
                )}
              </div>
            </div>

            {incompleteProducts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-magical-starlight mb-4">
                  Produtos com Dados Incompletos:
                </h3>
                
                <div className="grid gap-4">
                  {incompleteProducts.map((product) => (
                    <Card key={product.id} className="bg-magical-deepPurple/60 border-magical-bronze/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-magical-starlight">
                              ID {product.id}: {product.produto}
                            </h4>
                            <Badge variant="outline" className="text-magical-bronze border-magical-bronze/30 mt-1">
                              {product.categoria}
                            </Badge>
                          </div>
                          <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-400/30">
                            {product.validation.issues.length} problemas
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-magical-gold">Problemas encontrados:</h5>
                          <ul className="space-y-1">
                            {product.validation.issues.map((issue, index) => (
                              <li key={index} className="text-sm text-magical-starlight/80 flex items-center gap-2">
                                <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataIntegrityReport;
