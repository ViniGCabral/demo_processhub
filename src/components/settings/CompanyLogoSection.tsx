import { useRef, useState } from 'react';
import { ImagePlus, Upload, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettingsStore } from '@/stores/settingsStore';
import { toast } from 'sonner';

export function CompanyLogoSection() {
  const { settings, setCompanyLogo, setCompanyName } = useSettingsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Formato não permitido. Use PNG, JPG ou SVG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setCompanyLogo({
          filename: file.name,
          filesize: formatFileSize(file.size),
          dimensions: `${img.width} x ${img.height} px`,
          uploadedAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
          type: file.type,
          url: e.target?.result as string,
        });
        toast.success('Logo atualizado com sucesso');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleRemove = () => {
    setCompanyLogo(null);
    toast.success('Logo removido');
  };

  return (
    <div>
      {/* Company Name */}
      <div className="border-b border-border pb-6 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">Nome da Empresa</h2>
        <p className="text-sm text-muted-foreground mb-3">
          O nome será usado nos relatórios e na geração de casos de uso com IA.
        </p>
        <Input
          value={settings.companyName || ""}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Ex: Petrobras, Ambev, Vale..."
          className="max-w-md"
        />
      </div>

      <div className="border-b border-border pb-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">Logo da Empresa</h2>
        <p className="text-sm text-muted-foreground">
          Faça upload do logo da sua empresa. Ele aparecerá nas documentações e relatórios baixados.
        </p>
      </div>

      {settings.companyLogo ? (
        <div className="bg-muted/30 border border-border rounded-lg p-6">
          <div className="flex items-center gap-6">
            <div className="border border-border rounded-lg p-3 bg-card">
              <img
                src={settings.companyLogo.url}
                alt="Logo da empresa"
                className="max-w-[200px] max-h-[120px] object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">{settings.companyLogo.filename}</p>
              <p className="text-xs text-muted-foreground">{settings.companyLogo.filesize}</p>
              <p className="text-xs text-muted-foreground">{settings.companyLogo.dimensions}</p>
              <p className="text-xs text-muted-foreground mt-1">Atualizado em {settings.companyLogo.uploadedAt}</p>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-sidebar-accent text-primary border-0 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Substituir
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive border-border hover:bg-destructive/10 text-xs"
                  onClick={handleRemove}
                >
                  Remover
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary bg-sidebar-accent'
              : 'border-border bg-muted/30 hover:border-primary hover:bg-sidebar-accent'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-foreground text-sm">Nenhum logo enviado</p>
          <p className="text-xs text-muted-foreground mt-1">Clique para fazer upload ou arraste um arquivo</p>
          <p className="text-xs text-muted-foreground mt-2">(PNG, JPG, SVG - máx 5MB)</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
      />

      <div className="flex gap-3 bg-warning/10 border border-warning/30 rounded-lg p-3 mt-6">
        <Info className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-warning">Recomendações</p>
          <p className="text-sm text-warning/90">
            Use um logo com fundo transparente (PNG) para melhor resultado. Tamanho ideal: 1920x1080px ou menor.
          </p>
        </div>
      </div>
    </div>
  );
}
