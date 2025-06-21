
import { Play, Clock, Eye, ThumbsUp, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import { useState } from 'react';

const Videos = () => {
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const videos = [
    {
      id: 1,
      title: "Transformação Incrível: 90 Dias de Minoxidil",
      description: "Acompanhe a jornada completa de João e sua transformação impressionante",
      thumbnail: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=250&fit=crop",
      duration: "12:45",
      views: "15.2K",
      likes: "892",
      category: "transformacao",
      featured: true
    },
    {
      id: 2,
      title: "Como Aplicar Minoxidil: Tutorial Completo",
      description: "Passo a passo detalhado para aplicação correta do minoxidil na barba",
      thumbnail: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=250&fit=crop",
      duration: "8:30",
      views: "23.1K",
      likes: "1.2K",
      category: "tutorial"
    },
    {
      id: 3,
      title: "Motivação: Nunca Desista dos Seus Sonhos",
      description: "Histórias inspiradoras de homens que transformaram suas vidas",
      thumbnail: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=250&fit=crop",
      duration: "15:20",
      views: "8.7K",
      likes: "567",
      category: "motivacional"
    },
    {
      id: 4,
      title: "5 Erros que Você Está Cometendo",
      description: "Os erros mais comuns no uso do minoxidil e como evitá-los",
      thumbnail: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=250&fit=crop",
      duration: "10:15",
      views: "19.5K",
      likes: "943",
      category: "dicas"
    },
    {
      id: 5,
      title: "Barba Falha para Barba Cheia em 6 Meses",
      description: "Transformação real documentada mês a mês",
      thumbnail: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=250&fit=crop",
      duration: "18:45",
      views: "32.8K",
      likes: "2.1K",
      category: "transformacao"
    },
    {
      id: 6,
      title: "Rotina Matinal para Barba Perfeita",
      description: "Como estruturar sua rotina de cuidados com a barba",
      thumbnail: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=250&fit=crop",
      duration: "7:22",
      views: "11.3K",
      likes: "678",
      category: "tutorial"
    },
    {
      id: 7,
      title: "Vencendo a Insegurança: Minha História",
      description: "Como a barba mudou minha autoestima e confiança",
      thumbnail: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=250&fit=crop",
      duration: "13:10",
      views: "6.9K",
      likes: "445",
      category: "motivacional"
    },
    {
      id: 8,
      title: "Alimentação para Crescimento da Barba",
      description: "Os melhores alimentos para acelerar o crescimento",
      thumbnail: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=250&fit=crop",
      duration: "9:55",
      views: "14.7K",
      likes: "823",
      category: "dicas"
    }
  ];

  const categories = {
    'todos': 'Todos os Vídeos',
    'transformacao': 'Transformações',
    'tutorial': 'Tutoriais',
    'motivacional': 'Motivacional',
    'dicas': 'Dicas'
  };

  const filteredVideos = selectedCategory === 'todos' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const featuredVideo = videos.find(video => video.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Vídeos Motivacionais</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Histórias reais de transformação, tutoriais práticos e conteúdo motivacional para sua jornada
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8 flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categories).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Featured Video */}
        {featuredVideo && selectedCategory === 'todos' && (
          <Card className="mb-12 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="lg:flex">
              <div className="lg:w-2/3 relative group cursor-pointer">
                <img 
                  src={featuredVideo.thumbnail}
                  alt={featuredVideo.title}
                  className="w-full h-64 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                  <div className="bg-white rounded-full p-4 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-gray-900 ml-1" />
                  </div>
                </div>
                <Badge className="absolute top-4 left-4 bg-red-600">Em Destaque</Badge>
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                  {featuredVideo.duration}
                </div>
              </div>
              <div className="lg:w-1/3 p-8">
                <Badge className="mb-4 bg-purple-100 text-purple-800 capitalize">
                  {featuredVideo.category}
                </Badge>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">{featuredVideo.title}</h2>
                <p className="text-gray-600 mb-6">{featuredVideo.description}</p>
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {featuredVideo.views} visualizações
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {featuredVideo.likes} likes
                  </div>
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Play className="w-4 h-4 mr-2" />
                  Assistir Agora
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.filter(video => !video.featured || selectedCategory !== 'todos').map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="relative">
                <img 
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
                  <div className="bg-white rounded-full p-3 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all">
                    <Play className="w-6 h-6 text-gray-900 ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  {video.duration}
                </div>
              </div>
              <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2 text-xs capitalize">
                  {video.category}
                </Badge>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {video.views}
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {video.likes}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="mt-16 bg-gradient-to-r from-purple-600 to-red-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Compartilhe Sua Transformação</h3>
            <p className="mb-6 opacity-90">
              Teve resultados incríveis? Compartilhe sua história e inspire outros homens!
            </p>
            <Button className="bg-white text-purple-600 hover:bg-gray-100">
              Enviar Minha História
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Videos;
