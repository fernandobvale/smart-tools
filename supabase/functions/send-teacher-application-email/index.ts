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
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: EmailRequest = await req.json();

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY!,
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
            name: name,
          },
        ],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Olá, ${name}!</h2>
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
      throw new Error("Failed to send email");
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);