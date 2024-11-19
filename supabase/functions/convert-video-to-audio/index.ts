import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { videoPath } = await req.json()

    if (!videoPath) {
      throw new Error('Video path is required')
    }

    // Criar cliente Supabase com a service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Baixar o arquivo de vídeo
    const { data: videoFile, error: downloadError } = await supabase.storage
      .from('media')
      .download(videoPath)

    if (downloadError) {
      throw new Error(`Error downloading video: ${downloadError.message}`)
    }

    // Gerar nome do arquivo de áudio
    const audioPath = videoPath.replace('videos/', 'audio/').replace('.mp4', '.mp3')

    // Aqui você implementaria a lógica real de conversão
    // Por enquanto, vamos apenas simular a conversão retornando o mesmo arquivo
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(audioPath, videoFile, {
        contentType: 'audio/mpeg',
        upsert: true
      })

    if (uploadError) {
      throw new Error(`Error uploading audio: ${uploadError.message}`)
    }

    console.log(`Video converted successfully: ${videoPath} -> ${audioPath}`)

    return new Response(
      JSON.stringify({
        audioPath,
        message: 'Conversion completed successfully',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})