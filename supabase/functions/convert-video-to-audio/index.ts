import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { 
        status: 204,
        headers: corsHeaders 
      });
    }

    const { videoPath } = await req.json();
    console.log('Received video path:', videoPath);

    if (!videoPath) {
      return new Response(
        JSON.stringify({ error: 'Video path is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Download video file
    console.log('Downloading video file...');
    const { data: videoFile, error: downloadError } = await supabaseAdmin.storage
      .from('media')
      .download(videoPath);

    if (downloadError) {
      console.error('Error downloading video:', downloadError);
      throw new Error(`Error downloading video: ${downloadError.message}`);
    }

    if (!videoFile) {
      throw new Error('No video file found');
    }

    // Initialize FFmpeg
    console.log('Initializing FFmpeg...');
    const ffmpeg = new FFmpeg();
    
    console.log('Loading FFmpeg...');
    await ffmpeg.load({
      coreURL: "https://unpkg.com/@ffmpeg/core@0.12.4/dist/ffmpeg-core.js",
      wasmURL: "https://unpkg.com/@ffmpeg/core@0.12.4/dist/ffmpeg-core.wasm",
    });

    // Convert ArrayBuffer to Uint8Array
    const videoData = new Uint8Array(await videoFile.arrayBuffer());
    
    // Write input file
    console.log('Writing input file...');
    await ffmpeg.writeFile('input.mp4', videoData);
    
    // Run FFmpeg command
    console.log('Converting video to audio...');
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-vn',
      '-acodec', 'libmp3lame',
      '-ab', '192k',
      '-ar', '44100',
      'output.mp3'
    ]);

    // Read the output file
    console.log('Reading output file...');
    const audioData = await ffmpeg.readFile('output.mp3');

    // Generate audio file name
    const audioPath = `audio/${Date.now()}-${videoPath.split('/').pop()?.replace('.mp4', '.mp3')}`;
    console.log('Generated audio path:', audioPath);

    // Upload the converted audio
    console.log('Uploading audio file...');
    const { error: uploadError } = await supabaseAdmin.storage
      .from('media')
      .upload(audioPath, audioData, {
        contentType: 'audio/mpeg',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading audio:', uploadError);
      throw new Error(`Error uploading audio: ${uploadError.message}`);
    }

    // Generate public URL
    console.log('Generating public URL...');
    const { data: publicUrl } = await supabaseAdmin.storage
      .from('media')
      .getPublicUrl(audioPath);

    console.log('Conversion completed successfully');
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
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred',
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});