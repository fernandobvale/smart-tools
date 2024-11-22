import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
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
            Entre em contato com o Fernando Vale para dar continuidade ao processo!
          </p>
          <p className="text-lg">
            Para agilizar o processo, que tal mandar uma mensagem pra ele?
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <a
            href="https://wa.me/5562984541954"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full gap-2" size="lg">
              <MessageCircle className="w-5 h-5" />
              Falar com Fernando Vale
            </Button>
          </a>
        </div>
      </Card>
    </div>
  );
}