
import { useState } from 'react';
import { Play, X, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

interface ProductVideoModalProps {
  videoUrl: string;
  productName: string;
}

export const ProductVideoModal = ({ videoUrl, productName }: ProductVideoModalProps) => {
  const [open, setOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);

  console.log('Video URL recebida:', videoUrl);

  // Função para detectar o tipo de vídeo
  const detectVideoType = (url: string) => {
    if (!url) return 'unknown';
    
    console.log('Detectando tipo de vídeo para:', url);
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    }
    
    // Vídeo direto (MP4, WebM, etc.)
    if (url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)) {
      return 'direct';
    }
    
    // Shopee/Susercontent ou outros domínios com vídeo
    if (url.includes('susercontent.com') || url.includes('shopee.') || 
        url.includes('video') || url.includes('stream')) {
      return 'direct';
    }
    
    return 'unknown';
  };

  // Função melhorada para extrair ID do YouTube
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    
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
        console.log('YouTube ID encontrado:', match[1]);
        return match[1];
      }
    }

    return null;
  };

  const videoType = detectVideoType(videoUrl);
  const youtubeId = videoType === 'youtube' ? getYouTubeVideoId(videoUrl) : null;
  
  console.log('Tipo de vídeo:', videoType, 'YouTube ID:', youtubeId);

  const handleVideoError = () => {
    console.log('Erro ao carregar vídeo:', videoUrl);
    setVideoError(true);
  };

  const renderVideoContent = () => {
    if (videoType === 'youtube' && youtubeId) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          className="w-full h-full rounded-lg"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={`Vídeo do produto ${productName}`}
        />
      );
    }
    
    if (videoType === 'direct' || videoType === 'unknown') {
      if (videoError) {
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-white rounded-lg p-8">
            <Play className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg mb-4">Não foi possível carregar o vídeo</p>
            <Button
              onClick={() => window.open(videoUrl, '_blank')}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir vídeo em nova aba
            </Button>
          </div>
        );
      }
      
      return (
        <video
          className="w-full h-full rounded-lg"
          controls
          autoPlay
          muted
          onError={handleVideoError}
          poster="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=250&fit=crop"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Seu navegador não suporta a reprodução de vídeo.
        </video>
      );
    }
    
    // Fallback para URLs desconhecidas
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-white rounded-lg p-8">
        <Play className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg mb-2">Formato de vídeo não reconhecido</p>
        <p className="text-sm text-gray-400 text-center mb-4">
          URL: {videoUrl ? videoUrl.substring(0, 50) + '...' : 'Nenhuma URL fornecida'}
        </p>
        <Button
          onClick={() => window.open(videoUrl, '_blank')}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Tentar abrir em nova aba
        </Button>
      </div>
    );
  };

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
            {renderVideoContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
