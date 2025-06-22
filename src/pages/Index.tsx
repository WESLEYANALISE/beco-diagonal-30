
import { ArrowRight, Users, Calendar, ShoppingCart, Trophy, Clock, Star, Zap, Play, TrendingUp, Book, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const Index = () => {
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
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 transition-colors">
      <Header />
      
      {/* Hero Section - Mobile Optimized */}
      <section className="px-4 py-6 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Transforme Sua <span className="text-blue-600">Barba</span>
            </h1>
            <p className="text-gray-600 mb-6 px-2 text-sm">
              O app definitivo para quem quer ter uma barba épica! Dicas profissionais, desafio de 90 dias e muito mais.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-sm" asChild>
              <Link to="/desafio">
                <Trophy className="w-4 h-4 mr-2" />
                Começar Desafio 90 Dias
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 py-3 text-sm" asChild>
              <Link to="/blog">
                <Book className="w-4 h-4 mr-2" />
                Ver Dicas
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Beard Progress Carousel */}
      <section className="px-4 py-6 bg-white">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold text-center mb-4 text-gray-900">
            Evolução das Barbas
          </h2>
          <Carousel className="w-full">
            <CarouselContent>
              {beardProgressImages.map((item, index) => (
                <CarouselItem key={index} className="basis-1/2 md:basis-1/3">
                  <div className="p-2">
                    <Card className="overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={`Dia ${item.day}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-3 text-center">
                        <Badge className="bg-blue-100 text-blue-800">
                          Dia {item.day}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </section>

      {/* Minoxidil Products Carousel */}
      <section className="px-4 py-6 bg-gray-50">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold text-center mb-4 text-gray-900">
            Produtos Minoxidil
          </h2>
          <Carousel className="w-full">
            <CarouselContent>
              {minoxidilProducts.map((product, index) => (
                <CarouselItem key={index} className="basis-1/2 md:basis-1/3">
                  <div className="p-2">
                    <Card className="hover:shadow-lg transition-shadow">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-3 text-center">
                        <h3 className="font-semibold text-sm mb-1 text-gray-900">{product.name}</h3>
                        <p className="text-blue-600 font-bold text-sm mb-2">{product.price}</p>
                        <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs" asChild>
                          <Link to="/loja">Comprar</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="px-4 py-4 bg-blue-50">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-3 text-center">
            {quickStats.map((stat, index) => (
              <div key={index} className="p-3 bg-white rounded-xl shadow-sm">
                <div className="text-xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features - Card Grid */}
      <section className="px-4 py-6 bg-white">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold text-center mb-6 text-gray-900">
            Tudo para Sua Barba
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <Card key={index} className={`hover:shadow-lg transition-all duration-200 border-0 shadow-md ${feature.featured ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-600 mb-3">{feature.description}</p>
                  {feature.featured && (
                    <Badge className="mb-2 bg-blue-100 text-blue-800 text-xs">
                      Destaque
                    </Badge>
                  )}
                  <Button size="sm" className={`w-full ${feature.color} hover:opacity-90 text-white py-2 text-xs`} asChild>
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

      {/* Featured Content Cards */}
      <section className="px-4 py-6 bg-gray-50">
        <div className="max-w-md mx-auto space-y-4">
          {/* Blog Card - Featured */}
          <Card className="overflow-hidden shadow-lg border-2 border-indigo-200">
            <div className="flex">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <Book className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 p-4">
                <Badge className="mb-2 bg-indigo-100 text-indigo-700 text-xs">
                  Blog Destaque
                </Badge>
                <h3 className="font-semibold text-sm mb-1 text-gray-900">Dicas de Especialistas</h3>
                <p className="text-xs text-gray-600 mb-2">Artigos completos sobre cuidados</p>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs" asChild>
                  <Link to="/blog">Ler Agora</Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Store Card - Featured */}
          <Card className="overflow-hidden shadow-lg border-2 border-blue-200">
            <div className="flex">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 p-4">
                <Badge className="mb-2 bg-blue-100 text-blue-700 text-xs">
                  Loja Premium
                </Badge>
                <h3 className="font-semibold text-sm mb-1 text-gray-900">Minoxidil Original</h3>
                <p className="text-xs text-gray-600 mb-2">Kirkland 5% - Entrega rápida</p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs" asChild>
                  <Link to="/loja">Comprar</Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Progress Card */}
          <Card className="overflow-hidden shadow-md">
            <div className="flex">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 p-4">
                <Badge className="mb-2 bg-green-100 text-green-700 text-xs">
                  Progresso
                </Badge>
                <h3 className="font-semibold text-sm mb-1 text-gray-900">Acompanhe Sua Evolução</h3>
                <p className="text-xs text-gray-600 mb-2">Fotos e registros diários</p>
                <Button size="sm" variant="outline" className="text-xs" asChild>
                  <Link to="/desafio">Ver Progresso</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-md mx-auto text-center">
          <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-lg font-bold mb-3">
            Pronto para Transformar?
          </h2>
          <p className="text-blue-100 mb-6 text-sm px-4">
            Junte-se a milhares de homens que já transformaram suas barbas
          </p>
          <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-gray-100 py-3 font-semibold text-sm" asChild>
            <Link to="/desafio">
              Começar Agora
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
