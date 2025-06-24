import { useState } from 'react';
import { Heart, ShoppingCart, Star, User, Search, MapPin, Shield, Truck, Award, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from '@/components/Header';
import VideoCarouselHome from '@/components/VideoCarouselHome';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { useOptimizedProducts } from '@/hooks/useOptimizedProducts';
import OptimizedProductCard from '@/components/OptimizedProductCard';

interface Product {
  id: number;
  produto: string;
  valor: string;
  video: string;
  imagem1: string;
  imagem2: string;
  imagem3: string;
  imagem4: string;
  imagem5: string;
  link: string;
  categoria: string;
  uso?: string;
}

const Index = () => {
  const { products, loading } = useOptimizedProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const testimonials = [
    {
      name: "Carlos M.",
      text: "Produtos de qualidade e entrega rápida! Recomendo.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Ana S.",
      text: "Excelente atendimento e produtos originais.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Roberto L.",
      text: "Melhor site para compras online. Muito satisfeito!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    }
  ];

  const stats = [
    { icon: User, label: "Clientes Satisfeitos", value: "50K+" },
    { icon: ShoppingCart, label: "Produtos Vendidos", value: "200K+" },
    { icon: Star, label: "Avaliação Média", value: "4.9/5" },
    { icon: MapPin, label: "Cidades Atendidas", value: "1000+" }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Compra Segura",
      description: "Seus dados protegidos com criptografia SSL"
    },
    {
      icon: Truck,
      title: "Entrega Rápida",
      description: "Frete grátis para todo o Brasil"
    },
    {
      icon: Award,
      title: "Garantia de Qualidade",
      description: "Produtos originais com garantia"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Descubra Produtos Incríveis
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Os melhores produtos com qualidade garantida e entrega rápida para todo o Brasil
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-12">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-10 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Carousel - Produtos em Destaque */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Produtos em Destaque</h2>
            <p className="text-gray-600">Veja nossos produtos mais populares em ação</p>
          </div>
          <VideoCarouselHome onProductClick={handleProductClick} />
        </div>
      </section>

      {/* Produtos Populares - Grid sem vídeo */}
      <section className="py-12 bg-white/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Produtos Populares</h2>
            <p className="text-gray-600">Descubra os produtos mais vendidos</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg aspect-square"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.shuffled().slice(0, 8).map((product) => (
                <OptimizedProductCard
                  key={product.id}
                  product={product}
                  compact={true}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Por que Escolher Nossa Loja?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">O que nossos clientes dizem</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para encontrar seu produto ideal?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Explore nossa coleção completa e encontre exatamente o que você precisa
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Explorar Produtos
          </Button>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          isOpen={!!selectedProduct}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default Index;
