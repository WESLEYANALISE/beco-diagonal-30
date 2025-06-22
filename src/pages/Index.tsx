import { ArrowRight, Users, Calendar, ShoppingCart, Trophy, Clock, Star, Zap, Play, TrendingUp, Book, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { VideoCarousel } from "@/components/VideoCarousel";
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { useDesafio90Dias } from '@/hooks/useDesafio90Dias';
import { useEffect, useState } from 'react';

const Index = () => {
  const { desafio, loading } = useDesafio90Dias();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Trophy,
      title: "Desafio 90 Dias",
      description: "Acompanhe sua evolução dia a dia",
      path: "/desafio",
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      textColor: "text-blue-600"
    },
    {
      icon: Calendar,
      title: "Lembretes",
      description: "Nunca esqueça de aplicar",
      path: "/lembrete",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      textColor: "text-green-600"
    },
    {
      icon: Package,
      title: "Produtos",
      description: "Minoxidil original",
      path: "/loja",
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      featured: true
    },
    {
      icon: Book,
      title: "Blog",
      description: "Histórias motivacionais",
      path: "/blog",
      color: "bg-gradient-to-r from-indigo-500 to-indigo-600",
      textColor: "text-indigo-600"
    }
  ];

  const quickStats = [
    { number: "15K+", label: "Transformações", icon: Users },
    { number: "95%", label: "Taxa de Sucesso", icon: TrendingUp },
    { number: "24/7", label: "Suporte Diário", icon: Clock }
  ];

  const beardProgressImages = [
    { day: 1, image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop" },
    { day: 15, image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop" },
    { day: 30, image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=300&fit=crop" },
    { day: 60, image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=300&fit=crop" },
    { day: 90, image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop" }
  ];

  const minoxidilProducts = [
    { name: "Kirkland 5%", price: "R$ 89,90", image: "https://imgur.com/cAYNpiR.png" },
    { name: "Kirkland Kit", price: "R$ 159,90", image: "https://imgur.com/SNKLfl3.png" },
    { name: "Aplicador", price: "R$ 29,90", image: "https://imgur.com/hXzlDzD.png" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pb-20 md:pb-0">
      <Header />
      
      {/* Hero Section - Enhanced Professional Design */}
      <section className={`px-4 md:px-6 py-12 md:py-20 ${isVisible ? 'animate-slide-in-up' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center min-h-[60vh] md:min-h-[70vh]">
            
            {/* Left Column - Content */}
            <div className="text-center md:text-left space-y-8 md:space-y-10">
              <div className="animate-fade-in-scale">
                <div className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-8 animate-bounce-gentle shadow-2xl">
                  <Users className="w-10 h-10 md:w-14 md:h-14 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 md:mb-8 leading-tight">
                  Transforme Sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 animate-gradient">Barba</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                  O aplicativo mais completo para quem quer ter uma barba épica! Dicas profissionais, desafio de 90 dias, produtos originais e muito mais.
                </p>
              </div>
              
              <div className="space-y-4 md:flex md:space-y-0 md:space-x-6">
                {!loading && (
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 md:py-5 px-8 md:px-10 text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105" 
                    asChild
                  >
                    <Link to="/desafio">
                      <Trophy className="w-5 h-5 md:w-6 md:h-6 mr-3" />
                      {desafio ? "Ver Minha Evolução" : "Começar Desafio 90 Dias"}
                    </Link>
                  </Button>
                )}
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full md:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-4 md:py-5 px-8 md:px-10 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
                  asChild
                >
                  <Link to="/blog">
                    <Book className="w-5 h-5 md:w-6 md:h-6 mr-3" />
                    Ver Dicas
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Enhanced Stats */}
            <div className="animate-slide-in-right">
              <div className="grid grid-cols-1 gap-6 md:gap-8">
                {quickStats.map((stat, index) => (
                  <Card key={index} className="text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 bg-white/80 backdrop-blur-sm" style={{animationDelay: `${index * 0.2}s`}}>
                    <CardContent className="p-6 md:p-8">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </div>
                      </div>
                      <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 animate-pulse-slow">{stat.number}</div>
                      <div className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beard Progress Carousel */}
      <section className="px-4 md:px-6 py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900 animate-slide-in-up">
            Evolução das Barbas
          </h2>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {beardProgressImages.map((item, index) => (
                <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-2">
                    <Card className="overflow-hidden hover-lift card-interactive">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={`Dia ${item.day}`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-3 md:p-4 text-center">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                          Dia {item.day}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 md:left-4 hover-glow" />
            <CarouselNext className="right-2 md:right-4 hover-glow" />
          </Carousel>
        </div>
      </section>

      {/* Minoxidil Products Carousel */}
      <section className="px-4 md:px-6 py-12 md:py-16 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900 animate-slide-in-up">
            Produtos Minoxidil Original
          </h2>
          <Carousel className="w-full max-w-5xl mx-auto mb-12">
            <CarouselContent>
              {minoxidilProducts.map((product, index) => (
                <CarouselItem key={index} className="basis-1/2 md:basis-1/3">
                  <div className="p-3 md:p-4">
                    <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-4 md:p-6 text-center space-y-4">
                        <h3 className="font-bold text-base md:text-lg text-gray-900">{product.name}</h3>
                        <p className="text-blue-600 font-bold text-lg md:text-xl">{product.price}</p>
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
                          asChild
                        >
                          <Link to="/loja">Comprar Agora</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 md:left-4 hover:bg-blue-50 hover:border-blue-200" />
            <CarouselNext className="right-2 md:right-4 hover:bg-blue-50 hover:border-blue-200" />
          </Carousel>
        </div>
      </section>

      {/* Videos Section - New */}
      <section className="px-4 md:px-6 py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-in-up">
              Vídeos de Transformação
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Acompanhe histórias reais de transformação do canal <span className="font-semibold text-red-600">@TheDicas</span>
            </p>
          </div>
          <VideoCarousel />
          <div className="text-center mt-8">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
              asChild
            >
              <Link to="/videos">
                <Play className="w-5 h-5 mr-2" />
                Ver Todos os Vídeos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Features - Desktop Grid */}
      <section className="px-4 md:px-6 py-12 md:py-16 bg-white">
        <div className="desktop-container">
          <h2 className="text-responsive-title font-bold text-center mb-8 md:mb-12 text-gray-900 animate-slide-in-up">
            Tudo para Sua Barba
          </h2>
          <div className="desktop-grid">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`hover-lift hover-glow card-interactive border-0 shadow-md animate-fade-in-scale ${feature.featured ? 'ring-2 ring-blue-500 scale-105' : ''}`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardContent className="p-6 md:p-8 text-center space-y-4">
                  <div className={`w-12 h-12 md:w-16 md:h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto animate-bounce-gentle`}>
                    <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base md:text-lg">{feature.title}</h3>
                  <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
                  {feature.featured && (
                    <Badge className="bg-blue-100 text-blue-800 animate-pulse-slow">
                      Destaque
                    </Badge>
                  )}
                  <Button 
                    className={`w-full ${feature.color} hover:opacity-90 text-white py-2 md:py-3 btn-primary-animated`} 
                    asChild
                  >
                    <Link to={feature.path}>
                      Acessar
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="px-4 md:px-6 py-16 md:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8 md:space-y-10">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto animate-bounce-gentle">
              <Zap className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Pronto para Sua Transformação?
            </h2>
            <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Junte-se a mais de 15 mil homens que já transformaram suas vidas com nosso método comprovado e produtos originais
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 py-5 px-10 font-bold text-lg md:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105" 
              asChild
            >
              <Link to="/desafio">
                {desafio ? "Ver Minha Evolução" : "Começar Agora"}
                <ArrowRight className="w-6 h-6 ml-3" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
