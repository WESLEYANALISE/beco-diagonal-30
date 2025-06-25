
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SearchPreviewProps {
  searchTerm: string;
  resultsCount: number;
  onClearSearch: () => void;
}

export const SearchPreview = ({ searchTerm, resultsCount, onClearSearch }: SearchPreviewProps) => {
  if (!searchTerm) return null;

  return (
    <div className="animate-fade-in">
      <Card className="bg-magical-starlight/95 backdrop-blur-sm border-magical-gold/30 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-magical-midnight mb-1 font-enchanted">
                Resultados para "{searchTerm}"
              </h3>
              <Badge variant="secondary" className="text-xs bg-magical-gold/20 text-magical-midnight">
                {resultsCount} {resultsCount === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSearch}
              className="text-magical-midnight/70 hover:text-magical-midnight hover:bg-magical-gold/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
