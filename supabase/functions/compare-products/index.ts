
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { product1, product2 } = await req.json();

    const prompt = `
Você é um especialista em análise de produtos. Compare os dois produtos abaixo e forneça uma análise detalhada das diferenças, vantagens e desvantagens de cada um.

PRODUTO 1:
Nome: ${product1.nome}
Preço: ${product1.preco}

PRODUTO 2:
Nome: ${product2.nome}
Preço: ${product2.preco}

Por favor, analise e compare:
1. **Características e Funcionalidades**: Principais diferenças técnicas
2. **Preço e Custo-Benefício**: Qual oferece melhor valor
3. **Qualidade e Durabilidade**: Aspectos de construção e materiais
4. **Usabilidade**: Facilidade de uso e praticidade
5. **Recomendação Final**: Para que tipo de usuário cada produto é mais adequado

Seja objetivo, imparcial e forneça insights úteis para ajudar na decisão de compra.
Estruture a resposta de forma clara e organizada.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um especialista em análise comparativa de produtos. Sempre forneça análises detalhadas, imparciais e úteis para ajudar consumidores a tomar decisões informadas.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro na API do OpenAI');
    }

    const comparison = data.choices[0].message.content;

    return new Response(JSON.stringify({ comparison }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in compare-products function:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro ao comparar produtos', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
