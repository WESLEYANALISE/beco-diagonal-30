
import { useToast } from "@/hooks/use-toast";

export const useToastNotifications = () => {
  const { toast } = useToast();

  const showSuccess = (message: string, description?: string) => {
    toast({
      title: "✅ " + message,
      description,
      variant: "default",
    });
  };

  const showError = (message: string, description?: string) => {
    toast({
      title: "❌ " + message,
      description,
      variant: "destructive",
    });
  };

  const showInfo = (message: string, description?: string) => {
    toast({
      title: "ℹ️ " + message,
      description,
      variant: "default",
    });
  };

  const showLoading = (message: string) => {
    toast({
      title: "⏳ " + message,
      description: "Aguarde...",
      variant: "default",
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showLoading
  };
};
