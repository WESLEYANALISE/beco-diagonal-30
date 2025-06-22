
import { useState } from 'react';
import { Play, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ProductVideoModalProps {
  videoUrl: string;
  productName: string;
}

export const ProductVideoModal = ({ videoUrl, productName }: ProductVideoModalProps) => {
  const [open, setOpen] = useState(false);

  // Extract YouTube video ID from various URL formats
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const youtubeId = getYouTubeVideoId(videoUrl);

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
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                className="w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={productName}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white rounded-lg">
                <p>Vídeo não disponível</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
