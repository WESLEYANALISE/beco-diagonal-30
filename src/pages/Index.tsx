
import { ArrowRight, Users, Calendar, Video, ShoppingCart, Trophy, Clock, Star, Zap, Play, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const Index = () => {
  const features = [
    {
      icon: Trophy,
      title: "Desafio 90 Dias",
      description: "Acompanhe sua evolução dia a dia",
      path: "/desafio",
      color: "bg-amber-500",
      textColor: "text-amber-600"
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
      icon: ShoppingCart,
      title: "Loja",
      description: "Minoxidil original",
      path: "/loja",
      color: "bg-blue-500",
      textColor: "text-blue-600"
    },
    {
      icon: Video,
      title: "Vídeos",
      description: "Histórias motivacionais",
      path: "/videos",
      color: "bg-red-500",
      textColor: "text-red-600"
    }
  ];

  const quickStats = [
    { number: "10K+", label: "Transformações" },
    { number: "90%", label: "Taxa de Sucesso" },
    { number: "365", label: "Dias de Suporte" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Header />
      
      {/* Hero Section - Mobile Optimized */}
      <section className="px-4 py-8 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Transforme Sua <span className="text-amber-600">Barba</span>
            </h1>
            <p className="text-gray-600 mb-6 px-2">
              O app definitivo para quem quer ter uma barba épica! Dicas profissionais, desafio de 90 dias e muito mais.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button size="lg" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4" asChild>
              <Link to="/desafio">
                <Trophy className="w-5 h-5 mr-2" />
                Começar Desafio 90 Dias
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50 py-4" asChild>
              <Link to="/blog">
                <Book className="w-5 h-5 mr-2" />
                Ver Dicas
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="px-4 py-6 bg-white">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            {quickStats.map((stat, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features - Card Grid */}
      <section className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
            Tudo para Sua Barba
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-600 mb-3">{feature.description}</p>
                  <Button size="sm" className={`w-full ${feature.color} hover:opacity-90 text-white py-2`} asChild>
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
      <section className="px-4 py-6 bg-white">
        <div className="max-w-md mx-auto space-y-4">
          {/* Blog Card */}
          <Card className="overflow-hidden shadow-md">
            <div className="flex">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 p-4">
                <Badge className="mb-2 bg-indigo-100 text-indigo-700 text-xs">Blog</Badge>
                <h3 className="font-semibold text-sm mb-1">Dicas de Especialistas</h3>
                <p className="text-xs text-gray-600 mb-2">Artigos completos sobre cuidados</p>
                <Button size="sm" variant="outline" className="text-xs" asChild>
                  <Link to="/blog">Ler Mais</Link>
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
                <Badge className="mb-2 bg-green-100 text-green-700 text-xs">Progresso</Badge>
                <h3 className="font-semibold text-sm mb-1">Acompanhe Sua Evolução</h3>
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
      <section className="px-4 py-8 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-3">
            Pronto para Transformar?
          </h2>
          <p className="text-amber-100 mb-6 text-sm px-4">
            Junte-se a milhares de homens que já transformaram suas barbas
          </p>
          <Button size="lg" className="w-full bg-white text-amber-600 hover:bg-gray-100 py-4 font-semibold" asChild>
            <Link to="/desafio">
              Começar Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
