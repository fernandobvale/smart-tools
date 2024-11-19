import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { decode as base64Decode } from "https://deno.land/std@0.140.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { 
        status: 200,
        headers: corsHeaders 
      })
    }

    const { videoPath } = await req.json()
    console.log('Received video path:', videoPath)

    if (!videoPath) {
      return new Response(
        JSON.stringify({ error: 'Video path is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
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
      return new Response(
        JSON.stringify({ error: `Error downloading video: ${downloadError.message}` }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!videoFile) {
      return new Response(
        JSON.stringify({ error: 'No video file found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Converter o vídeo para áudio usando FFmpeg
    console.log('Converting video to audio...')
    const ffmpegProcess = new Deno.Command("ffmpeg", {
      args: [
        "-i", "pipe:0",        // Input from stdin
        "-vn",                 // Disable video
        "-acodec", "libmp3lame", // Use MP3 codec
        "-ab", "192k",         // Audio bitrate
        "-ar", "44100",        // Audio sample rate
        "-f", "mp3",           // Force MP3 format
        "pipe:1"               // Output to stdout
      ],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped"
    });

    // Iniciar o processo FFmpeg
    const process = ffmpegProcess.spawn();
    
    try {
      // Escrever o vídeo para o stdin do FFmpeg
      const writer = process.stdin.getWriter();
      await writer.write(await videoFile.arrayBuffer());
      await writer.close();

      // Ler o áudio convertido do stdout
      const output = await process.output();
      const audioBuffer = output.stdout;

      if (!audioBuffer || audioBuffer.length === 0) {
        const stderr = new TextDecoder().decode(output.stderr);
        console.error('FFmpeg error:', stderr);
        return new Response(
          JSON.stringify({ error: 'Failed to convert video to audio', details: stderr }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Gerar nome do arquivo de áudio
      const audioPath = `audio/${Date.now()}-${videoPath.split('/').pop()?.replace('.mp4', '.mp3')}`
      console.log('Generated audio path:', audioPath)

      // Upload do arquivo de áudio convertido
      console.log('Uploading audio file...')
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(audioPath, audioBuffer, {
          contentType: 'audio/mpeg',
          upsert: true
        })

      if (uploadError) {
        console.error('Error uploading audio:', uploadError)
        return new Response(
          JSON.stringify({ error: `Error uploading audio: ${uploadError.message}` }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Gerar URL pública do áudio
      console.log('Generating public URL...')
      const { data: publicUrl } = await supabase.storage
        .from('media')
        .getPublicUrl(audioPath)

      if (!publicUrl) {
        return new Response(
          JSON.stringify({ error: 'Failed to generate public URL' }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      console.log('Conversion completed successfully')
      return new Response(
        JSON.stringify({
          audioPath,
          publicUrl: publicUrl.publicUrl,
          message: 'Conversion completed successfully',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } catch (error) {
      console.error('Error in conversion process:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Error during conversion process',
          details: error.message
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred',
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})