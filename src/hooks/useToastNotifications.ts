
import { useToast } from "@/hooks/use-toast";

export const useToastNotifications = () => {
  const { toast } = useToast();

  const showSuccess = (message: string, description?: string) => {
    toast({
      title: "✅ ⚡ " + message,
      description: description ? `🌟 ${description}` : "Magia realizada com sucesso!",
      variant: "default",
      className: "bg-gradient-to-r from-magical-emerald/90 to-magical-mysticalPurple/90 border-magical-gold text-magical-starlight shadow-xl",
    });
  };

  const showError = (message: string, description?: string) => {
    toast({
      title: "❌ 🔥 " + message,
      description: description ? `⚠️ ${description}` : "A magia falhou! Tente novamente.",
      variant: "destructive", 
      className: "bg-gradient-to-r from-magical-crimson/90 to-magical-darkGold/90 border-magical-gold text-magical-starlight shadow-xl",
    });
  };

  const showInfo = (message: string, description?: string) => {
    toast({
      title: "ℹ️ 🔮 " + message,
      description: description ? `✨ ${description}` : "Informação mágica revelada!",
      variant: "default",
      className: "bg-gradient-to-r from-magical-mysticalPurple/90 to-magical-deepPurple/90 border-magical-gold text-magical-starlight shadow-xl",
    });
  };

  const showMagicalLoading = (message: string, description?: string) => {
    toast({
      title: "🔄 ⚡ " + message,
      description: description ? `🌙 ${description}` : "Preparando a magia... Aguarde!",
      variant: "default",
      className: "bg-gradient-to-r from-magical-darkBlue/90 to-magical-midnight/90 border-magical-gold text-magical-starlight shadow-xl animate-pulse",
    });
  };

  const showMagicalSuccess = (spell: string, result: string) => {
    toast({
      title: `🪄 ${spell} - Sucesso!`,
      description: `✨ ${result}`,
      variant: "default",
      className: "bg-gradient-to-r from-magical-gold/90 to-magical-bronze/90 border-magical-starlight text-magical-midnight shadow-2xl animate-magical-glow",
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showMagicalLoading,
    showMagicalSuccess
  };
};
