import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { courseName } = await req.json();

    if (!courseName || courseName.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Nome do curso é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY não configurada');
      return new Response(
        JSON.stringify({ error: 'Configuração da API não encontrada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `Você é um especialista em criar prompts para geração de imagens de capas de cursos educacionais. 

Sua tarefa é analisar o nome do curso fornecido e criar 2 prompts DIFERENTES e detalhados para gerar imagens profissionais no formato 16:9.

REGRAS CRÍTICAS OBRIGATÓRIAS:
- NUNCA inclua instruções para adicionar texto, palavras, letras, números, tipografia ou qualquer conteúdo escrito nas imagens
- As imagens devem ser PURAMENTE VISUAIS - apenas pessoas, objetos, ambientes
- Sempre enfatize "sem texto", "sem palavras", "puramente visual" em cada prompt
- Formato OBRIGATÓRIO: 16:9 landscape (orientação horizontal wide, 1920x1080 ou similar)

Para cada prompt, siga estas etapas:
1. Analise o nome do curso e identifique o tema principal
2. Descreva um ambiente relevante incluindo:
   - Localização (interior/exterior, urbano/rural, etc.)
   - Objetos e equipamentos relacionados ao tema
   - Atmosfera e iluminação apropriadas
   - Cores predominantes que transmitam profissionalismo
3. Descreva um profissional relacionado ao curso:
   - Aparência geral (idade aproximada, estilo de roupa profissional)
   - Postura e expressão que transmitam competência
   - Ações ou gestos relevantes para o curso
4. Combine todos os elementos em um prompt coeso e visualmente atraente
5. Estruture como: Descrição geral → Ambiente → Profissional → Elementos adicionais
6. IMPORTANTE: Cada prompt deve ter NO MÁXIMO 100 palavras e deve enfatizar "sem texto"
7. Os 2 prompts devem ser DIFERENTES entre si (ângulos, cenários ou estilos distintos)

Retorne APENAS um JSON válido no seguinte formato:
{
  "prompts": [
    {
      "id": 1,
      "prompt_pt": "prompt em português aqui (incluir 'sem texto' ou 'sem palavras')",
      "prompt_en": "prompt in English here (include 'no text' or 'no words')"
    },
    {
      "id": 2,
      "prompt_pt": "segundo prompt em português aqui (incluir 'sem texto' ou 'sem palavras')",
      "prompt_en": "second prompt in English here (include 'no text' or 'no words')"
    }
  ]
}

Não adicione texto antes ou depois do JSON. Apenas o JSON puro.`;

    console.log('Gerando prompts para curso:', courseName);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Nome do curso: ${courseName}` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições excedido. Aguarde alguns minutos.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos insuficientes. Adicione créditos ao Lovable AI.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('Erro na API Lovable:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Erro ao gerar prompts' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('Resposta da IA:', generatedText);

    // Parse do JSON retornado pela IA
    let prompts;
    try {
      // Remove markdown code blocks se houver
      const cleanedText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      prompts = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      console.error('Texto recebido:', generatedText);
      return new Response(
        JSON.stringify({ error: 'Erro ao processar resposta da IA' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(prompts),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro na função:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
