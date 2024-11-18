import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

interface EmailRequestBody {
  applicantName: string
  applicantEmail: string
}

serve(async (req) => {
  try {
    const { applicantName, applicantEmail } = await req.json() as EmailRequestBody

    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY!,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: "Unova Cursos",
          email: "contato@unovacursos.com.br"
        },
        to: [
          {
            email: "fernandovale@unovacursos.com.br",
            name: "Fernando"
          },
          {
            email: applicantEmail,
            name: applicantName
          }
        ],
        htmlContent: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Olá, ${applicantName}!</h2>
            <p>Recebemos sua solicitação para se tornar um Professor Parceiro da Unova Cursos.</p>
            <p>Agradecemos o seu interesse em colaborar conosco. Quando tivermos uma demanda de curso na área que você cadastrou, entraremos em contato.</p>
            <p>Enquanto isso, convidamos você a conhecer mais sobre nossos cursos e novidades em nosso site: 
            <a href="https://www.unovacursos.com.br" style="color: #1a73e8;">www.unovacursos.com.br</a>.</p>
            <p>Fique atento ao seu e-mail para futuras comunicações.</p>
            <p>Atenciosamente,</p>
            <p><strong>Equipe Unova Cursos</strong></p>
          </div>
        `,
        subject: "Recebemos sua solicitação de Professor Parceiro"
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})