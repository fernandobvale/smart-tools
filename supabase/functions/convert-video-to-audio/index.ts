import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { videoPath } = await req.json()
    
    if (!videoPath) {
      throw new Error('Video path is required')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate audio file path
    const audioPath = videoPath.replace('videos/', 'audio/').replace('.mp4', '.mp3')

    // For now, we'll just simulate the conversion by copying the file
    // In a real implementation, you'd use ffmpeg or a similar tool to convert the video
    const { data: videoData, error: videoError } = await supabaseClient.storage
      .from('media')
      .download(videoPath)

    if (videoError) {
      throw videoError
    }

    // Upload the "converted" file
    const { error: uploadError } = await supabaseClient.storage
      .from('media')
      .upload(audioPath, videoData)

    if (uploadError) {
      throw uploadError
    }

    return new Response(
      JSON.stringify({ audioPath }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})