import { useState } from 'react';
import { Calendar, Camera, Trophy, Upload, Target, TrendingUp, Award, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from '@/components/Header';
const Desafio = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const progressPercentage = currentDay / 90 * 100;
  const milestones = [{
    day: 30,
    title: "Primeiros Resultados",
    description: "Pelos começam a aparecer",
    completed: currentDay >= 30
  }, {
    day: 60,
    title: "Crescimento Visível",
    description: "Densidade aumenta significativamente",
    completed: currentDay >= 60
  }, {
    day: 90,
    title: "Transformação Completa",
    description: "Barba cheia conquistada!",
    completed: currentDay >= 90
  }];
  const weeklyTips = ["Semana 1-2: Seja paciente, os primeiros pelos podem demorar para aparecer", "Semana 3-4: Comece a ver pequenos pelos brotando", "Semana 5-8: Crescimento mais visível, mantenha a constância", "Semana 9-12: Densidade aumentando, resultados ficando evidentes"];
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setSelectedPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Desafio 90 Dias</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Acompanhe sua jornada de transformação dia a dia e documente seu progresso
          </p>
        </div>

        <Tabs defaultValue="progresso" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="progresso">Meu Progresso</TabsTrigger>
            <TabsTrigger value="foto">Foto do Dia</TabsTrigger>
            <TabsTrigger value="dicas">Dicas Semanais</TabsTrigger>
            
          </TabsList>

          <TabsContent value="progresso" className="space-y-8">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                  Seu Progresso
                </CardTitle>
                <CardDescription>
                  Dia {currentDay} de 90 - Continue firme!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Progresso Geral</span>
                      <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{currentDay}</div>
                      <div className="text-sm text-gray-600">Dias Completos</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{90 - currentDay}</div>
                      <div className="text-sm text-gray-600">Dias Restantes</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{Math.floor(currentDay / 7)}</div>
                      <div className="text-sm text-gray-600">Semanas</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-green-600" />
                  Marcos da Jornada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.map((milestone, index) => <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${milestone.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {milestone.completed ? <Award className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Dia {milestone.day}: {milestone.title}</h3>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                      </div>
                      <Badge variant={milestone.completed ? "default" : "secondary"}>
                        {milestone.completed ? "Conquistado" : "Em Progresso"}
                      </Badge>
                    </div>)}
                </div>
              </CardContent>
            </Card>

            {/* Daily Action */}
            <Card>
              <CardHeader>
                <CardTitle>Ação do Dia</CardTitle>
                <CardDescription>
                  Marque como concluído após aplicar o minoxidil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold">Aplicar Minoxidil</h3>
                    <p className="text-sm text-gray-600">2ml pela manhã e à noite</p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Marcar como Feito
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="foto" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-6 h-6 text-blue-600" />
                  Foto do Dia {currentDay}
                </CardTitle>
                <CardDescription>
                  Documente seu progresso com uma foto diária
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {selectedPhoto ? <div className="space-y-4">
                      <img src={selectedPhoto} alt="Foto do dia" className="max-w-xs mx-auto rounded-lg shadow-md" />
                      <Button variant="outline" onClick={() => setSelectedPhoto(null)}>
                        Trocar Foto
                      </Button>
                    </div> : <div className="space-y-4">
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                      <div>
                        <p className="text-lg font-medium">Envie sua foto do dia</p>
                        <p className="text-sm text-gray-600">PNG, JPG até 10MB</p>
                      </div>
                      <div>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo-upload" />
                        <Button asChild>
                          <label htmlFor="photo-upload" className="cursor-pointer">
                            Escolher Arquivo
                          </label>
                        </Button>
                      </div>
                    </div>}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Observações do Dia</h3>
                  <Textarea placeholder="Como você se sente hoje? Notou alguma mudança? Compartilhe suas observações..." value={notes} onChange={e => setNotes(e.target.value)} rows={4} />
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Salvar Registro do Dia
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Photo Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Galeria da Evolução</CardTitle>
                <CardDescription>
                  Suas fotos dos últimos dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                  {Array.from({
                  length: Math.min(currentDay, 12)
                }, (_, i) => <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                      Dia {currentDay - i}
                    </div>)}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Ver Todas as Fotos
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dicas" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Dicas Semanais
                </CardTitle>
                <CardDescription>
                  Orientações específicas para cada fase do desafio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {weeklyTips.map((tip, index) => <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Semanas {index * 2 + 1}-{index * 2 + 2}</h3>
                      <p className="text-gray-600">{tip}</p>
                    </div>)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dica do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Consistência é a Chave
                  </h3>
                  <p className="text-blue-800">
                    Aplicar o minoxidil na mesma hora todos os dias ajuda a criar o hábito. 
                    Configure lembretes no seu celular para não esquecer!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comunidade" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Transformações da Comunidade</CardTitle>
                <CardDescription>
                  Inspire-se com as histórias de outros participantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {[{
                  name: "João Silva",
                  day: 90,
                  before: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop",
                  after: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=150&h=150&fit=crop"
                }, {
                  name: "Pedro Santos",
                  day: 75,
                  before: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=150&h=150&fit=crop",
                  after: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=150&h=150&fit=crop"
                }].map((transformation, index) => <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-center">
                          <img src={transformation.before} alt="Antes" className="w-16 h-16 rounded-full object-cover" />
                          <span className="text-xs text-gray-600">Antes</span>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl">→</div>
                        </div>
                        <div className="text-center">
                          <img src={transformation.after} alt="Depois" className="w-16 h-16 rounded-full object-cover" />
                          <span className="text-xs text-gray-600">Depois</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{transformation.name}</h3>
                          <p className="text-sm text-gray-600">Dia {transformation.day}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">
                        "Incrível como o minoxidil transformou minha barba! Consistência realmente funciona."
                      </p>
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default Desafio;