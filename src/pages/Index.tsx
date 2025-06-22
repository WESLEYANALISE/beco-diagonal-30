import { ArrowRight, Users, Trophy, Play, Book, Package, Star, Zap, CheckCircle, Target, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { VideoCarousel } from "@/components/VideoCarousel";
import { StatsBar } from "@/components/StatsBar";
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
      featured: true
    },
    {
      icon: Package,
      title: "Produtos Originais",
      description: "Minoxidil certificado",
      path: "/loja",
      color: "bg-gradient-to-r from-green-500 to-green-600",
      featured: true
    },
    {
      icon: Book,
      title: "Histórias Reais",
      description: "Transformações inspiradoras",
      path: "/blog",
      color: "bg-gradient-to-r from-purple-500 to-purple-600"
    },
    {
      icon: Play,
      title: "Vídeos @TheDicas",
      description: "Evolução documentada",
      path: "/videos",
      color: "bg-gradient-to-r from-red-500 to-red-600"
    }
  ];

  const beardProgressImages = [
    { day: 1, image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop", description: "Início" },
    { day: 15, image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop", description: "Primeiros sinais" },
    { day: 30, image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=300&fit=crop", description: "Crescimento visível" },
    { day: 60, image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=300&fit=crop", description: "Densidade aumentando" },
    { day: 90, image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop", description: "Transformação completa" }
  ];

  const minoxidilProducts = [
    { 
      name: "Kirkland 5%", 
      price: "R$ 89,90", 
      image: "https://imgur.com/cAYNpiR.png",
      description: "Fórmula original"
    },
    { 
      name: "Kirkland Kit Completo", 
      price: "R$ 159,90", 
      image: "https://imgur.com/SNKLfl3.png",
      description: "3 meses de tratamento"
    },
    { 
      name: "Aplicador Profissional", 
      price: "R$ 29,90", 
      image: "https://imgur.com/hXzlDzD.png",
      description: "Aplicação precisa"
    }
  ];

  const benefits = [
    { icon: CheckCircle, text: "Resultados em 30 dias" },
    { icon: Target, text: "Acompanhamento diário" },
    { icon: Award, text: "Produtos originais" },
    { icon: Star, text: "Suporte especializado" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <Header />
      
      {/* Hero Section - Redesigned for Engagement */}
      <section className={`px-4 md:px-6 py-8 md:py-16 ${isVisible ? 'animate-slide-in-up' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 md:space-y-8 mb-12">
            <div className="animate-fade-in-scale">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle shadow-2xl">
                <Users className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Transforme Sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 animate-gradient">Barba</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Mais de 15 mil homens já conquistaram a barba dos sonhos. Sua vez chegou!
              </p>
            </div>
            
            {/* Stats Bar - New Component */}
            <div className="max-w-4xl mx-auto mb-8">
              <StatsBar />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              {!loading && (
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105" 
                  asChild
                >
                  <Link to="/desafio">
                    <Trophy className="w-6 h-6 mr-3" />
                    {desafio ? "Ver Minha Evolução" : "Começar Desafio 90 Dias"}
                  </Link>
                </Button>
              )}
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-4 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm" 
                asChild
              >
                <Link to="/loja">
                  <Package className="w-6 h-6 mr-3" />
                  Ver Produtos
                </Link>
              </Button>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300 hover:scale-105"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-2">
                  <benefit.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evolution Carousel */}
      <section className="px-4 md:px-6 py-12 md:py-16 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900 animate-slide-in-up">
            Sua Jornada de Transformação
          </h2>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {beardProgressImages.map((item, index) => (
                <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-2">
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white border-0 shadow-lg">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={`Dia ${item.day}`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-4 text-center">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors mb-2">
                          Dia {item.day}
                        </Badge>
                        <p className="text-sm text-gray-600 font-medium">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 md:left-4 bg-white/90 backdrop-blur-sm hover:bg-blue-50 hover:border-blue-200" />
            <CarouselNext className="right-2 md:right-4 bg-white/90 backdrop-blur-sm hover:bg-blue-50 hover:border-blue-200" />
          </Carousel>
        </div>
      </section>

      {/* Products Section - Enhanced */}
      <section className="px-4 md:px-6 py-12 md:py-16 bg-gradient-to-r from-blue-50/50 to-purple-50/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900 animate-slide-in-up">
            Produtos Originais Certificados
          </h2>
          <Carousel className="w-full max-w-6xl mx-auto mb-12">
            <CarouselContent>
              {minoxidilProducts.map((product, index) => (
                <CarouselItem key={index} className="basis-1/2 md:basis-1/3">
                  <div className="p-3 md:p-4">
                    <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 bg-white shadow-lg overflow-hidden group">
                      <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-4 md:p-6 text-center space-y-3">
                        <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.description}</p>
                        <p className="text-green-600 font-bold text-xl">{product.price}</p>
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
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
            <CarouselPrevious className="left-2 md:left-4 bg-white/90 backdrop-blur-sm hover:bg-blue-50 hover:border-blue-200" />
            <CarouselNext className="right-2 md:right-4 bg-white/90 backdrop-blur-sm hover:bg-blue-50 hover:border-blue-200" />
          </Carousel>
        </div>
      </section>

      {/* Videos Section */}
      <section className="px-4 md:px-6 py-12 md:py-16 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-in-up">
              Transformações Documentadas
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Acompanhe histórias reais de evolução do canal <span className="font-semibold text-red-600">@TheDicas</span>
            </p>
          </div>
          <VideoCarousel />
          <div className="text-center mt-8">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
              asChild
            >
              <Link to="/videos">
                <Play className="w-5 h-5 mr-2" />
                Assistir Mais Vídeos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid - Redesigned */}
      <section className="px-4 md:px-6 py-12 md:py-16 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900 animate-slide-in-up">
            Tudo para Sua Transformação
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 bg-white/80 backdrop-blur-sm shadow-lg animate-fade-in-scale ${feature.featured ? 'ring-2 ring-blue-500 relative' : ''}`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {feature.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-3 py-1">
                      Destaque
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto animate-bounce-gentle shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                  <Button 
                    className={`w-full ${feature.color} hover:opacity-90 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300`} 
                    asChild
                  >
                    <Link to={feature.path}>
                      Acessar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Enhanced */}
      <section className="px-4 md:px-6 py-16 md:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto animate-bounce-gentle">
              <Zap className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Sua Transformação Começa Agora
            </h2>
            <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Junte-se a mais de 15 mil homens que já conquistaram a barba dos sonhos
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 py-5 px-10 font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105" 
              asChild
            >
              <Link to="/desafio">
                {desafio ? "Continuar Evolução" : "Começar Desafio Gratuito"}
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
