import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface CertificateNotification {
  studentName: string;
  studentEmail: string;
  orderNumber: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentName, studentEmail, orderNumber }: CertificateNotification = await req.json();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Certificados <no-reply@unovacursos.com.br>",
        to: ["fernandovale@unovacursos.com.br"],
        subject: "Novo Certificado Cadastrado para Envio",
        html: `
          <h2>Novo Certificado Cadastrado</h2>
          <p>Um novo certificado foi cadastrado no sistema para envio:</p>
          <ul>
            <li><strong>Nome do Aluno:</strong> ${studentName}</li>
            <li><strong>Email do Aluno:</strong> ${studentEmail}</li>
            <li><strong>Número do Pedido:</strong> ${orderNumber}</li>
          </ul>
          <p>Por favor, acesse o sistema para mais detalhes.</p>
        `,
      }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);