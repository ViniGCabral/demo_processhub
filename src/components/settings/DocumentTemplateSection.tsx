import { useRef, useState } from 'react';
import { FileText, Upload, Info, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useSettingsStore } from '@/stores/settingsStore';
import { toast } from 'sonner';

export function DocumentTemplateSection() {
  const { settings, setDocumentationTemplate, setUseDefaultTemplate } = useSettingsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.text',
    ];
    const validExtensions = ['.docx', '.odt'];
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!validTypes.includes(file.type) && !hasValidExtension) {
      toast.error('Formato não permitido. Use DOCX ou ODT.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setDocumentationTemplate({
        filename: file.name,
        filesize: formatFileSize(file.size),
        uploadedAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
        type: file.type || 'application/octet-stream',
        url: e.target?.result as string,
      });
      toast.success('Template atualizado com sucesso');
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
    setDocumentationTemplate(null);
    toast.success('Template removido');
  };

  const getFileTypeLabel = (type: string) => {
    if (type.includes('wordprocessingml') || type.includes('.docx')) return 'Microsoft Word (.docx)';
    if (type.includes('opendocument') || type.includes('.odt')) return 'LibreOffice (.odt)';
    return 'Documento';
  };

  return (
    <div>
      <div className="border-b border-border pb-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">Template de Documentação</h2>
        <p className="text-sm text-muted-foreground">
          Faça upload de um template de documentação personalizado. Será usado como base ao baixar POPs em PDF.
        </p>
      </div>

      {settings.documentationTemplate && !settings.useDefaultTemplate ? (
        <div className="bg-muted/30 border border-border rounded-lg p-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">{settings.documentationTemplate.filename}</p>
              <p className="text-xs text-muted-foreground">{getFileTypeLabel(settings.documentationTemplate.type)}</p>
              <p className="text-xs text-muted-foreground">{settings.documentationTemplate.filesize}</p>
              <p className="text-xs text-muted-foreground mt-1">Atualizado em {settings.documentationTemplate.uploadedAt}</p>
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
                  className="text-primary border-primary text-xs"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = settings.documentationTemplate!.url;
                    link.download = settings.documentationTemplate!.filename;
                    link.click();
                  }}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Baixar Original
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
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-foreground text-sm">Nenhum template enviado</p>
          <p className="text-xs text-muted-foreground mt-1">Um template padrão será usado</p>
          <p className="text-xs text-muted-foreground mt-2">(DOCX, ODT - máx 10MB)</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,.odt,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
      />

      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg mt-4">
        <Checkbox
          id="useDefaultTemplate"
          checked={settings.useDefaultTemplate}
          onCheckedChange={(checked) => setUseDefaultTemplate(!!checked)}
        />
        <label htmlFor="useDefaultTemplate" className="text-sm font-medium text-foreground cursor-pointer">
          Usar template padrão da PlataformaHub
        </label>
      </div>

      <div className="flex gap-3 bg-warning/10 border border-warning/30 rounded-lg p-3 mt-6">
        <Info className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-warning">Como Customizar</p>
          <p className="text-sm text-warning/90">
            Prepare um template em Word ou LibreOffice com sua identidade visual. O sistema preencherá automaticamente com os dados da POP. Manter estrutura de placeholders: {'{processo}'}, {'{data}'}, {'{responsavel}'}, etc.
          </p>
        </div>
      </div>
    </div>
  );
}
