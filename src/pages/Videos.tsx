
import { Play, Clock, Eye, ThumbsUp, Filter, Youtube, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import { useMinoxidilVideos } from '@/hooks/useMinoxidilVideos';

const Videos = () => {
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const { data: videos, isLoading } = useMinoxidilVideos();

  useEffect(() => {
    const hasSeenMessage = localStorage.getItem('videos-welcome-seen');
    if (!hasSeenMessage) {
      setShowWelcomeMessage(true);
    }
  }, []);

  const dismissWelcomeMessage = () => {
    setShowWelcomeMessage(false);
    localStorage.setItem('videos-welcome-seen', 'true');
  };

  const openVideo = (videoUrl: string) => {
    window.open(videoUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50/30">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Youtube className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Vídeos de Transformação</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Histórias reais de evolução com minoxidil do canal <span className="font-bold text-red-600">@TheDicas</span>
          </p>
        </div>

        {/* Welcome Message */}
        {showWelcomeMessage && (
          <Alert className="mb-8 border-red-200 bg-red-50 max-w-4xl mx-auto">
            <Youtube className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="flex items-center justify-between">
                <div>
                  <strong>Bem-vindo aos vídeos de transformação!</strong>
                  <br />
                  Todos os vídeos são do canal <strong>@TheDicas</strong>, onde você pode acompanhar a evolução real de pessoas usando minoxidil para barba. Inspire-se com resultados reais!
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={dismissWelcomeMessage}
                  className="text-red-600 hover:text-red-700 hover:bg-red-100 ml-4"
                >
                  Entendi
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="flex space-x-2">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Videos List */}
        {!isLoading && videos && videos.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card 
                key={video.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border-0 bg-white/90 backdrop-blur-sm hover:scale-105"
                onClick={() => openVideo(video.video)}
              >
                <div className="relative">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={video.thumbnail || "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=250&fit=crop"}
                      alt={video.titulo}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300">
                    <div className="bg-white rounded-full p-4 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl">
                      <Play className="w-6 h-6 text-red-600 ml-0.5" />
                    </div>
                  </div>
                  {video.duracao && (
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-80 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {video.duracao}
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-600 hover:bg-red-700 text-white font-semibold">
                      @TheDicas
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors text-lg leading-tight">
                    {video.titulo}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {video.duracao || 'N/A'}
                    </div>
                    {video.data && (
                      <div className="text-xs">
                        {new Date(video.data).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!videos || videos.length === 0) && (
          <Card className="max-w-2xl mx-auto text-center p-12">
            <CardContent>
              <Youtube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum vídeo encontrado
              </h3>
              <p className="text-gray-600">
                Os vídeos de transformação serão carregados em breve.
              </p>
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        <Card className="mt-16 bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-2xl">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="flex items-center justify-center mb-6">
              <Star className="w-8 h-8 text-yellow-300" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Inspire Outros com Sua História</h3>
            <p className="mb-6 opacity-90 text-lg max-w-2xl mx-auto">
              Teve resultados incríveis com minoxidil? Compartilhe sua transformação e inspire milhares de homens!
            </p>
            <Button className="bg-white text-red-600 hover:bg-gray-100 font-bold text-lg px-8 py-3 shadow-xl">
              Enviar Minha Transformação
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Videos;
