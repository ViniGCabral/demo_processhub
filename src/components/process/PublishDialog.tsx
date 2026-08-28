import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  currentVersion: string;
  newVersion: string;
}

export function PublishDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  currentVersion,
  newVersion 
}: PublishDialogProps) {
  const { language } = useLanguage();

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {language === "PT" ? "Publicar Nova Versão" : "Publish New Version"}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              {language === "PT" 
                ? `Você está prestes a publicar a versão ${newVersion} deste documento.`
                : `You are about to publish version ${newVersion} of this document.`
              }
            </p>
            <p>
              {language === "PT"
                ? `A versão atual (${currentVersion}) será arquivada automaticamente.`
                : `The current version (${currentVersion}) will be automatically archived.`
              }
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {language === "PT" ? "Cancelar" : "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {language === "PT" ? "Publicar" : "Publish"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
