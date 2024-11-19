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
    console.log('Received video path:', videoPath)

    if (!videoPath) {
      throw new Error('Video path is required')
    }

    // Criar cliente Supabase com a service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Baixar o arquivo de vídeo
    console.log('Downloading video file...')
    const { data: videoFile, error: downloadError } = await supabase.storage
      .from('media')
      .download(videoPath)

    if (downloadError) {
      console.error('Error downloading video:', downloadError)
      throw new Error(`Error downloading video: ${downloadError.message}`)
    }

    if (!videoFile) {
      console.error('No video file found')
      throw new Error('No video file found')
    }

    // Gerar nome do arquivo de áudio
    const audioPath = `audio/${Date.now()}-${videoPath.split('/').pop()?.replace('.mp4', '.mp3')}`
    console.log('Generated audio path:', audioPath)

    // Upload do arquivo como áudio
    console.log('Uploading audio file...')
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(audioPath, videoFile, {
        contentType: 'audio/mpeg',
        upsert: true
      })

    if (uploadError) {
      console.error('Error uploading audio:', uploadError)
      throw new Error(`Error uploading audio: ${uploadError.message}`)
    }

    // Gerar URL pública do áudio
    console.log('Generating public URL...')
    const { data: publicUrl } = await supabase.storage
      .from('media')
      .getPublicUrl(audioPath)

    if (!publicUrl) {
      console.error('Failed to generate public URL')
      throw new Error('Failed to generate public URL')
    }

    console.log('Conversion completed successfully')
    return new Response(
      JSON.stringify({
        audioPath,
        publicUrl: publicUrl.publicUrl,
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
    console.error('Error in conversion process:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.stack
      }),
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