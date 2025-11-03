import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function optimizeImage(base64Url: string) {
  try {
    // Decodificar base64
    const base64Data = base64Url.replace(/^data:image\/\w+;base64,/, '');
    const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Carregar imagem
    let image = await Image.decode(imageBytes);

    // Forçar aspect ratio 16:9 (1920x1080)
    const targetWidth = 1920;
    const targetHeight = 1080;
    image = image.resize(targetWidth, targetHeight);

    // Comprimir progressivamente até <100KB
    let quality = 85;
    let compressedBytes: Uint8Array;
    let attempts = 0;
    const maxSize = 100000; // 100KB

    do {
      compressedBytes = await image.encodeJPEG(quality);
      
      if (compressedBytes.length < maxSize) break;
      
      quality -= 10;
      attempts++;
      
      // Se mesmo com qualidade baixa ainda está grande, reduzir dimensões
      if (quality < 40 && compressedBytes.length > maxSize) {
        image = image.resize(1280, 720);
        quality = 85;
      }
      
    } while (compressedBytes.length > maxSize && attempts < 10);

    // Converter para base64
    const base64Compressed = btoa(String.fromCharCode(...compressedBytes));
    const finalImageUrl = `data:image/jpeg;base64,${base64Compressed}`;

    console.log(`Imagem otimizada: ${compressedBytes.length} bytes, qualidade: ${quality}%, dimensões: ${image.width}x${image.height}`);

    return {
      image: finalImageUrl,
      size: compressedBytes.length,
      format: 'jpeg',
      dimensions: `${image.width}x${image.height}`
    };
  } catch (error) {
    console.error('Erro ao otimizar imagem:', error);
    throw new Error('Falha ao processar imagem');
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, courseName } = await req.json();

    if (!prompt || prompt.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Prompt é obrigatório' }),
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

    console.log('Gerando imagem para curso:', courseName);
    console.log('Prompt:', prompt.substring(0, 100) + '...');

    const enhancedPrompt = `Create a professional course cover image in 16:9 landscape format (1920x1080 pixels wide horizontal orientation).

CRITICAL REQUIREMENTS:
- The image MUST contain ONLY VISUAL ELEMENTS
- Absolutely NO TEXT, NO WORDS, NO LETTERS, NO TYPOGRAPHY of any kind
- NO written content, labels, titles, or captions
- Focus purely on photography, illustrations, or realistic graphics
- The image must be purely visual without any textual elements

Course theme: ${prompt}`;

    console.log('Prompt aprimorado:', enhancedPrompt.substring(0, 150) + '...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [
          { 
            role: 'user', 
            content: enhancedPrompt
          }
        ],
        modalities: ['image', 'text']
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
        JSON.stringify({ error: 'Erro ao gerar imagem' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    // Extrair a imagem do resultado
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error('Imagem não encontrada na resposta:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'Imagem não foi gerada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Imagem recebida da IA, iniciando otimização...');

    // Processar e otimizar a imagem
    const optimizedImage = await optimizeImage(imageUrl);

    console.log('Imagem processada com sucesso:', optimizedImage.size, 'bytes');

    return new Response(
      JSON.stringify(optimizedImage),
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
