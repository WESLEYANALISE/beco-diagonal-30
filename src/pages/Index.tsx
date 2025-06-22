
import { ArrowRight, Users, Calendar, ShoppingCart, Trophy, Clock, Star, Zap, Play, TrendingUp, Book, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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
      color: "bg-blue-500",
      textColor: "text-blue-600"
    },
    {
      icon: Calendar,
      title: "Lembretes",
      description: "Nunca esqueça de aplicar",
      path: "/lembrete",
      color: "bg-green-500",
      textColor: "text-green-600"
    },
    {
      icon: Package,
      title: "Produtos",
      description: "Minoxidil original",
      path: "/loja",
      color: "bg-blue-600",
      textColor: "text-blue-600",
      featured: true
    },
    {
      icon: Book,
      title: "Blog",
      description: "Histórias motivacionais",
      path: "/blog",
      color: "bg-indigo-500",
      textColor: "text-indigo-600"
    }
  ];

  const quickStats = [
    { number: "10K+", label: "Transformações" },
    { number: "90%", label: "Taxa de Sucesso" },
    { number: "365", label: "Dias de Suporte" }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20 md:pb-0">
      <Header />
      
      {/* Hero Section - Desktop & Mobile */}
      <section className={`px-4 md:px-6 py-8 md:py-16 ${isVisible ? 'animate-slide-in-up' : 'opacity-0'}`}>
        <div className="desktop-container">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center min-h-[60vh] md:min-h-[70vh]">
            
            {/* Left Column - Content */}
            <div className="text-center md:text-left space-y-6 md:space-y-8">
              <div className="animate-fade-in-scale">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6 animate-bounce-gentle">
                  <Users className="w-8 h-8 md:w-12 md:h-12 text-white" />
                </div>
                <h1 className="text-responsive-hero font-bold text-gray-900 mb-4 md:mb-6">
                  Transforme Sua <span className="text-blue-600 animate-gradient bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">Barba</span>
                </h1>
                <p className="text-responsive-body text-gray-600 mb-6 md:mb-8 max-w-lg mx-auto md:mx-0">
                  O app definitivo para quem quer ter uma barba épica! Dicas profissionais, desafio de 90 dias e muito mais.
                </p>
              </div>
              
              <div className="space-y-4 md:flex md:space-y-0 md:space-x-4">
                {!loading && (
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3 md:py-4 px-6 md:px-8 text-sm md:text-base btn-primary-animated hover-glow" 
                    asChild
                  >
                    <Link to="/desafio">
                      <Trophy className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      {desafio ? "Ver Minha Evolução" : "Começar Desafio 90 Dias"}
                    </Link>
                  </Button>
                )}
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full md:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 py-3 md:py-4 px-6 md:px-8 text-sm md:text-base hover-lift" 
                  asChild
                >
                  <Link to="/blog">
                    <Book className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Ver Dicas
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Stats */}
            <div className="animate-slide-in-right">
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                {quickStats.map((stat, index) => (
                  <Card key={index} className="text-center hover-lift animate-float" style={{animationDelay: `${index * 0.2}s`}}>
                    <CardContent className="p-4 md:p-6">
                      <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2 animate-pulse-slow">{stat.number}</div>
                      <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beard Progress Carousel */}
      <section className="px-4 md:px-6 py-8 md:py-12 bg-white">
        <div className="desktop-container">
          <h2 className="text-responsive-title font-bold text-center mb-6 md:mb-8 text-gray-900 animate-slide-in-up">
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
      <section className="px-4 md:px-6 py-8 md:py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="desktop-container">
          <h2 className="text-responsive-title font-bold text-center mb-6 md:mb-8 text-gray-900 animate-slide-in-up">
            Produtos Minoxidil
          </h2>
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {minoxidilProducts.map((product, index) => (
                <CarouselItem key={index} className="basis-1/2 md:basis-1/3">
                  <div className="p-2 md:p-3">
                    <Card className="hover-lift hover-glow card-interactive">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-3 md:p-4 text-center space-y-3">
                        <h3 className="font-semibold text-sm md:text-base text-gray-900">{product.name}</h3>
                        <p className="text-blue-600 font-bold text-sm md:text-base">{product.price}</p>
                        <Button 
                          size="sm" 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm btn-primary-animated" 
                          asChild
                        >
                          <Link to="/loja">Comprar</Link>
                        </Button>
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

      {/* Main Features - Desktop Grid */}
      <section className="px-4 md:px-6 py-8 md:py-12 bg-white">
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

      {/* CTA Section */}
      <section className="px-4 md:px-6 py-12 md:py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="desktop-container text-center">
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto animate-bounce-gentle">
              <Zap className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h2 className="text-responsive-title font-bold">
              Pronto para Transformar?
            </h2>
            <p className="text-blue-100 text-responsive-body max-w-2xl mx-auto">
              Junte-se a milhares de homens que já transformaram suas barbas com nosso método comprovado
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 py-4 px-8 font-semibold text-base md:text-lg btn-primary-animated hover-lift" 
              asChild
            >
              <Link to="/desafio">
                {desafio ? "Ver Minha Evolução" : "Começar Agora"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
