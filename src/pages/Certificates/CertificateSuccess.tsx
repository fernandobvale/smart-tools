import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WhatsappLogo } from "lucide-react";
import { Link } from "react-router-dom";

export default function CertificateSuccess() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-6 text-center space-y-6">
        <div className="space-y-4">
          <div className="animate-bounce">
            🎉
          </div>
          <h1 className="text-3xl font-bold">Uhuuul! Formulário enviado com sucesso!</h1>
          <p className="text-xl text-muted-foreground">
            Agora é só aguardar que o Fernando Vale vai entrar em contato com você!
          </p>
          <p className="text-lg">
            Para agilizar o processo, que tal mandar uma mensagem pra ele?
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full gap-2" size="lg">
              <WhatsappLogo className="w-5 h-5" />
              Falar com Fernando Vale
            </Button>
          </a>

          <Link to="/certificates/manage" className="w-full">
            <Button variant="outline" className="w-full">
              Ir para Gestão de Certificados
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}