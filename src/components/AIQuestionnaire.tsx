
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Brain, DollarSign, Target, Clock, Sparkles } from 'lucide-react';

interface AIQuestionnaireProps {
  onAnswersChange: (answers: QuestionnaireAnswers) => void;
}

export interface QuestionnaireAnswers {
  budget: string;
  purpose: string;
  priority: string;
  customNeed: string;
}

export const AIQuestionnaire = ({ onAnswersChange }: AIQuestionnaireProps) => {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    budget: '',
    purpose: '',
    priority: '',
    customNeed: ''
  });

  const updateAnswer = (key: keyof QuestionnaireAnswers, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  const questions = [
    {
      id: 'budget',
      icon: DollarSign,
      title: 'Qual seu orçamento?',
      placeholder: 'Selecione sua faixa de preço',
      type: 'select',
      options: [
        { value: 'ate-50', label: 'Até R$ 50' },
        { value: '50-150', label: 'R$ 50 - R$ 150' },
        { value: '150-300', label: 'R$ 150 - R$ 300' },
        { value: 'acima-300', label: 'Acima de R$ 300' }
      ]
    },
    {
      id: 'purpose',
      icon: Target,
      title: 'Para que vai usar?',
      placeholder: 'Escolha o uso principal',
      type: 'select',
      options: [
        { value: 'pessoal', label: 'Uso pessoal' },
        { value: 'presente', label: 'Presente' },
        { value: 'trabalho', label: 'Trabalho' },
        { value: 'casa', label: 'Casa/Família' }
      ]
    },
    {
      id: 'priority',
      icon: Sparkles,
      title: 'O que é mais importante?',
      placeholder: 'Sua prioridade principal',
      type: 'select',
      options: [
        { value: 'preco', label: 'Melhor preço' },
        { value: 'qualidade', label: 'Alta qualidade' },
        { value: 'marca', label: 'Marca conhecida' },
        { value: 'design', label: 'Design bonito' }
      ]
    }
  ];

  const completedAnswers = Object.values(answers).filter(answer => answer.trim() !== '').length;
  const progress = Math.round((completedAnswers / 4) * 100);

  return (
    <div className="space-y-4">
      {/* Header moderno */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          🤖 Me Conte Suas Preferências
        </h3>
        <p className="text-white/90 text-sm max-w-sm mx-auto leading-relaxed">
          Responda 3 perguntas rápidas e nossa IA vai te ajudar a escolher o produto ideal
        </p>
        
        {/* Barra de progresso visual */}
        <div className="mt-4 mx-auto max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/80">Progresso</span>
            <Badge variant="secondary" className="bg-white/20 text-white text-xs">
              {progress}%
            </Badge>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Perguntas simplificadas */}
      <div className="space-y-3">
        {questions.map((question, index) => {
          const IconComponent = question.icon;
          const isCompleted = answers[question.id as keyof QuestionnaireAnswers] !== '';
          
          return (
            <Card 
              key={question.id} 
              className={`
                transition-all duration-300 border-2
                ${isCompleted 
                  ? 'bg-white/15 border-green-400/50 shadow-lg' 
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
                }
                backdrop-blur-sm
              `}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                    ${isCompleted 
                      ? 'bg-green-500 shadow-lg' 
                      : 'bg-white/20'
                    }
                  `}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white text-sm">
                        {question.title}
                      </h4>
                      {isCompleted && (
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
                
                <Select 
                  value={answers[question.id as keyof QuestionnaireAnswers]} 
                  onValueChange={(value) => updateAnswer(question.id as keyof QuestionnaireAnswers, value)}
                >
                  <SelectTrigger className="bg-white/95 border-0 text-gray-900 shadow-sm hover:shadow-md transition-all duration-200">
                    <SelectValue placeholder={question.placeholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-xl">
                    {question.options.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="hover:bg-purple-50 transition-colors"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          );
        })}

        {/* Campo para necessidade específica */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 border-2 hover:bg-white/15 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-white text-sm">
                Algo específico? (opcional)
              </h4>
            </div>
            <Input
              placeholder="Ex: resistente à água, boa bateria, design moderno..."
              value={answers.customNeed}
              onChange={(e) => updateAnswer('customNeed', e.target.value)}
              className="bg-white/95 border-0 text-gray-900 placeholder:text-gray-500 shadow-sm hover:shadow-md transition-all duration-200"
            />
          </CardContent>
        </Card>
      </div>

      {/* Indicador de conclusão */}
      {completedAnswers >= 3 && (
        <div className="text-center animate-fade-in">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-4 shadow-lg">
            <p className="text-white font-semibold text-sm">
              ✨ Perfeito! Agora selecione até 5 produtos para comparar
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
