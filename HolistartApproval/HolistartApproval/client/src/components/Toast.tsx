import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const showToast = (message: string, type: "success" | "error" = "success") => {
  const { toast } = useToast();
  
  toast({
    title: type === "success" ? "Success" : "Error",
    description: message,
    variant: type === "error" ? "destructive" : "default",
    duration: 3000,
  });
};
