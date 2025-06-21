
import { ArrowRight, Users, Calendar, Video, ShoppingCart, Trophy, Clock, Star, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Transforme Sua <span className="text-amber-600">Barba</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              O aplicativo definitivo para quem quer ter uma barba épica! Dicas profissionais, 
              desafio de 90 dias, lembretes automáticos e produtos originais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white" asChild>
                <Link to="/desafio">
                  Começar Desafio 90 Dias
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50" asChild>
                <Link to="/blog">
                  Ver Dicas
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Tudo que Você Precisa para Sua Barba
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Trophy className="w-12 h-12 text-amber-600 mb-4" />
                <CardTitle>Desafio 90 Dias</CardTitle>
                <CardDescription>
                  Acompanhe sua evolução dia a dia com fotos e registros de progresso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-amber-600 hover:bg-amber-700" asChild>
                  <Link to="/desafio">Começar Agora</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Lembretes Inteligentes</CardTitle>
                <CardDescription>
                  Conecte com Google Calendar e nunca mais esqueça de aplicar o minoxidil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                  <Link to="/lembrete">Configurar</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <ShoppingCart className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Minoxidil Original</CardTitle>
                <CardDescription>
                  Kirkland 5% original direto do fornecedor confiável
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                  <Link to="/loja">Comprar</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Video className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Vídeos Motivacionais</CardTitle>
                <CardDescription>
                  Histórias de transformação e dicas dos especialistas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                  <Link to="/videos">Assistir</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-indigo-600 mb-4" />
                <CardTitle>Blog de Dicas</CardTitle>
                <CardDescription>
                  Artigos completos sobre cuidados, produtos e técnicas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" asChild>
                  <Link to="/blog">Ler Mais</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Star className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Comunidade</CardTitle>
                <CardDescription>
                  Compartilhe sua jornada e inspire outros homens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Em Breve
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-amber-100">Homens Transformados</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">90%</div>
              <div className="text-amber-100">Taxa de Sucesso</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">365</div>
              <div className="text-amber-100">Dias de Suporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Pronto para Transformar Sua Barba?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de homens que já transformaram suas barbas com nosso método comprovado
          </p>
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white" asChild>
            <Link to="/desafio">
              <Zap className="w-5 h-5 mr-2" />
              Começar Transformação
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
