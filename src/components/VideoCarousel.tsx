
import { Play, Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useMinoxidilVideos } from '@/hooks/useMinoxidilVideos';

export const VideoCarousel = () => {
  const { data: videos, isLoading } = useMinoxidilVideos();

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return null;
  }

  const openVideo = (videoUrl: string) => {
    window.open(videoUrl, '_blank');
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Carousel className="w-full">
        <CarouselContent>
          {videos.map((video) => (
            <CarouselItem key={video.id} className="basis-full md:basis-1/2 lg:basis-1/3">
              <div className="p-2">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group" onClick={() => openVideo(video.video)}>
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={video.thumbnail || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=250&fit=crop"} 
                      alt={video.titulo}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300">
                      <div className="bg-white rounded-full p-3 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                        <Play className="w-6 h-6 text-red-600 ml-0.5" />
                      </div>
                    </div>
                    {video.duracao && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
                        {video.duracao}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-200 transition-colors">
                        @TheDicas
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors text-sm md:text-base">
                      {video.titulo}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 space-x-3">
                      {video.data && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(video.data).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                      {video.duracao && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {video.duracao}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 md:left-4 hover:bg-red-50 hover:border-red-200" />
        <CarouselNext className="right-2 md:right-4 hover:bg-red-50 hover:border-red-200" />
      </Carousel>
    </div>
  );
};
