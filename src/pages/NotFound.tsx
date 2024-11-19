import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground animate-fade-in">
      <div className="text-9xl font-bold mb-4">404</div>
      <div className="text-4xl font-semibold mb-8">Oops! Página não encontrada</div>
      
      <div className="text-xl text-muted-foreground text-center mb-8 max-w-md">
        Parece que você se perdeu no espaço digital... 🚀
        <br />
        <span className="text-lg">
          (ou talvez um desenvolvedor preguiçoso esqueceu de criar esta página 😴)
        </span>
      </div>

      <div className="space-y-4 text-center">
        <p className="text-lg text-muted-foreground mb-6">
          Enquanto isso, que tal voltar para um lugar seguro?
        </p>
        
        <Button 
          onClick={() => navigate("/dashboard")}
          size="lg"
          className="animate-bounce"
        >
          Voltar para o Dashboard 🏠
        </Button>
      </div>
    </div>
  );
};

export default NotFound;