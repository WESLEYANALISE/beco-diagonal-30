
import { useState } from 'react';
import { Play, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

interface ProductVideoModalProps {
  videoUrl: string;
  productName: string;
}

export const ProductVideoModal = ({ videoUrl, productName }: ProductVideoModalProps) => {
  const [open, setOpen] = useState(false);

  console.log('Video URL recebida:', videoUrl);

  // Função melhorada para extrair ID do YouTube
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    
    console.log('Processando URL:', url);
    
    // Diferentes padrões de URL do YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([\w-]{11})/,
      /youtube\.com\/watch\?.*v=([\w-]{11})/,
      /youtu\.be\/([\w-]{11})/,
      /youtube\.com\/embed\/([\w-]{11})/,
      /youtube\.com\/v\/([\w-]{11})/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        console.log('ID encontrado:', match[1]);
        return match[1];
      }
    }

    console.log('Nenhum ID encontrado para:', url);
    return null;
  };

  const youtubeId = getYouTubeVideoId(videoUrl);
  console.log('YouTube ID final:', youtubeId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full mb-2 bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600"
        >
          <Play className="w-3 h-3 mr-1" />
          Ver Vídeo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0">
        <DialogTitle className="sr-only">Vídeo do produto {productName}</DialogTitle>
        <div className="relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="aspect-video">
            {youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                className="w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`Vídeo do produto ${productName}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-white rounded-lg p-8">
                <Play className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg mb-2">Vídeo não disponível</p>
                <p className="text-sm text-gray-400 text-center">
                  URL do vídeo: {videoUrl ? videoUrl.substring(0, 50) + '...' : 'Nenhuma URL fornecida'}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
