import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { decode as base64Decode } from "https://deno.land/std@0.140.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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
      throw new Error('Failed to convert video to audio');
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