import { useState } from "react";
import { Images, Check, X, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageAlternativesProps {
  currentImage: string;
  stepId: string;
  processId?: string;
  onImageSelect: (stepId: string, newImage: string) => void;
  onAnnotate?: () => void;
}

// Mapeamento de imagens alternativas contextuais por step
const stepAlternatives: Record<string, string[]> = {
  // Step 1.2 - Localizar chamado ServiceNow (interfaces de ticket/helpdesk)
  "1.2": [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=560&h=320&fit=crop",
  ],
  // Step 1.4 - Descrição do frete (formulários de logística)
  "1.4": [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1553413077-190dd305871c?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=560&h=320&fit=crop",
  ],
  // Step 1.6 - E-mail transportadoras (interfaces de email)
  "1.6": [
    "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=560&h=320&fit=crop",
  ],
  // Step 2.2 - Simulador de frete (mapas/calculadoras)
  "2.2": [
    "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1609619385076-36a873425636?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1576671081837-49000212a370?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=560&h=320&fit=crop",
  ],
  // Step 2.5 - Cálculo automático (tabelas/resultados)
  "2.5": [
    "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=560&h=320&fit=crop",
  ],
  // Step 3.1 - Comparativo de fretes (gráficos comparativos)
  "3.1": [
    "https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=560&h=320&fit=crop",
  ],
  // Step 4.2 - Valor final (formulários de aprovação)
  "4.2": [
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=560&h=320&fit=crop",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=560&h=320&fit=crop",
  ],
  
  // IT Prepaid Amortization Process (ID 7) - Outlook steps
  "7-1.1": [
    "/images/sop-it-prepaid/step-1-alt-1.jpg",
    "/images/sop-it-prepaid/step-1-alt-2.jpg",
    "/images/sop-it-prepaid/step-1-alt-3.jpg",
    "/images/sop-it-prepaid/step-2.jpg",
    "/images/sop-it-prepaid/step-7.jpg",
    "/images/sop-it-prepaid/step-8.jpg",
  ],
  "7-1.2": [
    "/images/sop-it-prepaid/step-2-alt-1.jpg",
    "/images/sop-it-prepaid/step-2-alt-2.jpg",
    "/images/sop-it-prepaid/step-2-alt-3.jpg",
    "/images/sop-it-prepaid/step-2-alt-4.jpg",
    "/images/sop-it-prepaid/step-2-alt-5.jpg",
    "/images/sop-it-prepaid/step-2-alt-6.jpg",
  ],
  "7-2.1": [
    "/images/sop-it-prepaid/step-3-alt-1.jpg",
    "/images/sop-it-prepaid/step-3-alt-2.jpg",
    "/images/sop-it-prepaid/step-3-alt-3.jpg",
    "/images/sop-it-prepaid/step-3-alt-4.jpg",
    "/images/sop-it-prepaid/step-3-alt-5.jpg",
    "/images/sop-it-prepaid/step-3-alt-6.jpg",
  ],
  "7-2.2": [
    "/images/sop-it-prepaid/step-4-alt-1.jpg",
    "/images/sop-it-prepaid/step-4-alt-2.jpg",
    "/images/sop-it-prepaid/step-4-alt-3.jpg",
    "/images/sop-it-prepaid/step-4-alt-4.jpg",
    "/images/sop-it-prepaid/step-4-alt-5.jpg",
    "/images/sop-it-prepaid/step-4-alt-6.jpg",
  ],
  "7-2.3": [
    "/images/sop-it-prepaid/step-5-alt-1.jpg",
    "/images/sop-it-prepaid/step-5-alt-2.jpg",
    "/images/sop-it-prepaid/step-5-alt-3.jpg",
    "/images/sop-it-prepaid/step-5-alt-4.jpg",
    "/images/sop-it-prepaid/step-5-alt-5.jpg",
    "/images/sop-it-prepaid/step-5-alt-6.jpg",
  ],
  "7-3.1": [
    "/images/sop-it-prepaid/step-6-alt-1.jpg",
    "/images/sop-it-prepaid/step-6-alt-2.jpg",
    "/images/sop-it-prepaid/step-6-alt-3.jpg",
    "/images/sop-it-prepaid/step-6-alt-4.jpg",
    "/images/sop-it-prepaid/step-6-alt-5.jpg",
    "/images/sop-it-prepaid/step-6-alt-6.jpg",
  ],
  "7-5.1": [
    "/images/sop-it-prepaid/step-7-alt-1.jpg",
    "/images/sop-it-prepaid/step-7-alt-2.jpg",
    "/images/sop-it-prepaid/step-7-alt-3.jpg",
    "/images/sop-it-prepaid/step-1.jpg",
    "/images/sop-it-prepaid/step-8.jpg",
    "/images/sop-it-prepaid/step-1-alt-1.jpg",
  ],
  "7-5.2": [
    "/images/sop-it-prepaid/step-8-alt-1.jpg",
    "/images/sop-it-prepaid/step-8-alt-2.jpg",
    "/images/sop-it-prepaid/step-8-alt-3.jpg",
    "/images/sop-it-prepaid/step-1.jpg",
    "/images/sop-it-prepaid/step-7.jpg",
    "/images/sop-it-prepaid/step-1-alt-2.jpg",
  ],
};

// Fallback genérico para steps sem mapeamento específico
const defaultAlternatives = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=560&h=320&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=560&h=320&fit=crop",
  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=560&h=320&fit=crop",
  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=560&h=320&fit=crop",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=560&h=320&fit=crop",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=560&h=320&fit=crop",
];

const getAlternatives = (stepId: string, processId?: string): string[] => {
  // Try process-specific key first
  if (processId) {
    const processKey = `${processId}-${stepId}`;
    if (stepAlternatives[processKey]) {
      return stepAlternatives[processKey];
    }
  }
  
  // DEMO MODE: For new processes (unknown IDs), try IT Prepaid alternatives
  const demoKey = `7-${stepId}`;
  if (stepAlternatives[demoKey]) {
    return stepAlternatives[demoKey];
  }
  
  // Fallback to generic stepId
  return stepAlternatives[stepId] || defaultAlternatives;
};

export function ImageAlternatives({ currentImage, stepId, processId, onImageSelect, onAnnotate }: ImageAlternativesProps) {
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const alternatives = getAlternatives(stepId, processId);

  const handleSelectImage = (image: string) => {
    setSelectedImage(image);
  };

  const handleConfirmSelection = () => {
    if (selectedImage) {
      onImageSelect(stepId, selectedImage);
      setIsDialogOpen(false);
      setSelectedImage(null);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={currentImage} 
          alt="Step illustration"
          className="w-full rounded-lg border border-border/60 shadow-sm"
        />
        
        {/* Hover overlay with action buttons */}
        <div 
          className={cn(
            "absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center gap-3 transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/95 hover:bg-white text-foreground rounded-lg shadow-lg transition-all hover:scale-105"
          >
            <Images className="h-4 w-4" />
            <span className="text-sm font-medium">
              {language === "PT" ? "Alternativas" : "Alternatives"}
            </span>
          </button>
          {onAnnotate && (
            <button
              onClick={onAnnotate}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/95 hover:bg-white text-foreground rounded-lg shadow-lg transition-all hover:scale-105"
            >
              <Pencil className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language === "PT" ? "Editar" : "Edit"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Alternatives Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {language === "PT" ? "Imagens Alternativas" : "Alternative Images"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {language === "PT" 
                ? "A IA selecionou automaticamente a melhor imagem, mas você pode escolher uma das alternativas abaixo:"
                : "AI automatically selected the best image, but you can choose one of the alternatives below:"
              }
            </p>

            {/* Current Image */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {language === "PT" ? "Imagem Atual" : "Current Image"}
              </span>
              <div className="relative">
                <img 
                  src={currentImage}
                  alt="Current"
                  className="w-full max-h-48 object-cover rounded-lg border-2 border-primary shadow-sm"
                />
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  {language === "PT" ? "Selecionada pela IA" : "AI Selected"}
                </div>
              </div>
            </div>

            {/* Alternative Images Grid */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {language === "PT" ? "Alternativas" : "Alternatives"}
              </span>
              <div className="grid grid-cols-3 gap-3">
                {alternatives.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectImage(image)}
                    className={cn(
                      "relative rounded-lg overflow-hidden border-2 transition-all hover:scale-[1.02]",
                      selectedImage === image 
                        ? "border-primary ring-2 ring-primary/20" 
                        : "border-border/60 hover:border-primary/40"
                    )}
                  >
                    <img 
                      src={image}
                      alt={`Alternative ${index + 1}`}
                      className="w-full h-28 object-cover"
                    />
                    {selectedImage === image && (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white px-1.5 py-0.5 rounded text-xs">
                      {index + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {language === "PT" ? "Cancelar" : "Cancel"}
              </button>
              <button
                onClick={handleConfirmSelection}
                disabled={!selectedImage}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                  selectedImage 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {language === "PT" ? "Usar esta imagem" : "Use this image"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
