import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  name: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { ...corsHeaders } });
  }

  try {
    const body = await req.json();
    const { name, email }: EmailRequest = body;

    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 200) {
      return new Response(
        JSON.stringify({ error: "Invalid name" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return new Response(
        JSON.stringify({ error: "Invalid email" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Sanitize inputs for HTML injection
    const safeName = name.replace(/[<>&"']/g, (c: string) => {
      const map: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#x27;' };
      return map[c] || c;
    });

    if (!BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not set");
    }

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "Unova Cursos",
          email: "contato@unovacursos.com.br",
        },
        to: [
          {
            email: "fernandovale@unovacursos.com.br",
            name: "Fernando",
          },
          {
            email: email,
            name: safeName,
          },
        ],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Olá, ${safeName}!</h2>
            <p>Recebemos sua solicitação para se tornar um Professor Parceiro da Unova Cursos.</p>
            <p>Agradecemos o seu interesse em colaborar conosco. Quando tivermos uma demanda de curso na área que você cadastrou, entraremos em contato.</p>
            <p>Enquanto isso, convidamos você a conhecer mais sobre nossos cursos e novidades em nosso site: 
            <a href="https://www.unovacursos.com.br" style="color: #1a73e8;">www.unovacursos.com.br</a>.</p>
            <p>Fique atento ao seu e-mail para futuras comunicações.</p>
            <p>Atenciosamente,</p>
            <p><strong>Equipe Unova Cursos</strong></p>
          </div>
        `,
        subject: "Recebemos sua solicitação de Professor Parceiro",
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Brevo API error:', errorData);
      
      if (errorData.message?.includes('unrecognised IP address')) {
        return new Response(
          JSON.stringify({ error: "IP authorization required." }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
        );
      }
      
      throw new Error('Failed to send email');
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-teacher-application-email function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred sending the email" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
};

serve(handler);
