
import { Clock, Youtube, Star, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { VideoPlayer } from "@/components/VideoPlayer";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 pb-20 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Youtube className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Transformações Documentadas</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Histórias reais de evolução com minoxidil do canal <span className="font-bold text-red-600">@TheDicas</span>
          </p>
        </div>

        {/* Welcome Message */}
        {showWelcomeMessage && (
          <Alert className="mb-8 border-red-200 bg-red-50/80 backdrop-blur-sm max-w-4xl mx-auto shadow-lg">
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
                  className="text-red-600 hover:text-red-700 hover:bg-red-100 ml-4 rounded-xl"
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
              <Card key={i} className="overflow-hidden animate-pulse bg-white/60 backdrop-blur-sm">
                <div className="aspect-video bg-gray-300"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3 mb-3"></div>
                  <div className="flex space-x-2">
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                    <div className="h-3 bg-gray-300 rounded w-12"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Videos Grid */}
        {!isLoading && videos && videos.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card 
                key={video.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group border-0 bg-white/80 backdrop-blur-sm shadow-lg"
              >
                <div className="relative">
                  <VideoPlayer
                    videoUrl={video.video}
                    thumbnail={video.thumbnail}
                    title={video.titulo}
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-600 hover:bg-red-700 text-white font-semibold">
                      @TheDicas
                    </Badge>
                  </div>
                  {video.duracao && (
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {video.duracao}
                    </div>
                  )}
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
          <Card className="max-w-2xl mx-auto text-center p-12 bg-white/80 backdrop-blur-sm shadow-lg">
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
            <Button className="bg-white text-red-600 hover:bg-gray-100 font-bold text-lg px-8 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              Enviar Minha Transformação
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Videos;
