
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

    if (!product1 || !product2) {
      throw new Error('Dois produtos são necessários para comparação');
    }

    const prompt = `
    Compare estes dois produtos da Shopee de forma detalhada e objetiva:

    PRODUTO 1:
    Nome: ${product1.produto}
    Preço: ${product1.valor}
    Categoria: ${product1.categoria}

    PRODUTO 2:
    Nome: ${product2.produto}
    Preço: ${product2.valor}
    Categoria: ${product2.categoria}

    Por favor, forneça uma análise comparativa estruturada incluindo:

    1. **RESUMO EXECUTIVO**
    - Qual produto oferece melhor custo-benefício
    - Recomendação principal

    2. **COMPARAÇÃO DE PREÇOS**
    - Diferença de preço entre os produtos
    - Análise de valor pelo dinheiro

    3. **CARACTERÍSTICAS PRINCIPAIS**
    - Pontos fortes de cada produto
    - Diferenças mais relevantes

    4. **CASOS DE USO**
    - Para que tipo de pessoa cada produto é mais adequado
    - Situações onde cada um é melhor

    5. **VEREDITO FINAL**
    - Recomendação clara e justificada
    - Próximos passos para o comprador

    Seja prático, direto e focado em ajudar o usuário a tomar a melhor decisão de compra.
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
            content: 'Você é um especialista em produtos e análise comparativa. Forneça análises detalhadas, práticas e imparciais para ajudar consumidores a tomar decisões de compra informadas.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API erro: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro na comparação de produtos:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro ao comparar produtos', 
        details: error.message 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
