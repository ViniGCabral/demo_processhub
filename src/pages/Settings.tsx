import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Building2, Users, FileText, RotateCcw, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TopBar } from '@/components/layout/TopBar';
import { CompanyLogoSection } from '@/components/settings/CompanyLogoSection';
import { AreasSection } from '@/components/settings/AreasSection';
import { DocumentTemplateSection } from '@/components/settings/DocumentTemplateSection';
import { TaxonomySection } from '@/components/settings/TaxonomySection';
import { useSettingsStore } from '@/stores/settingsStore';
import { useLanguage } from '@/contexts/LanguageContext';

import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SettingsProps {
  onLogout: () => void;
}

type SettingsSection = 'logo' | 'areas' | 'template' | 'taxonomy';

export function Settings({ onLogout }: SettingsProps) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { resetToDefaults } = useSettingsStore();
  const [activeSection, setActiveSection] = useState<SettingsSection>('logo');
  const [showResetDialog, setShowResetDialog] = useState(false);

  const navItems = [
    { id: 'logo' as const, label: language === 'PT' ? 'Logo da Empresa' : 'Company Logo', icon: Building2 },
    { id: 'areas' as const, label: t.areasOrganizationalAreas, icon: Users },
    { id: 'taxonomy' as const, label: language === 'PT' ? 'Taxonomia da Cadeia de Valor' : 'Value Chain Taxonomy', icon: Layers },
    { id: 'template' as const, label: language === 'PT' ? 'Template de Documentação' : 'Documentation Template', icon: FileText },
  ];


  const handleReset = () => {
    resetToDefaults();
    toast.success(t.settingsSettingsRestored);
    setShowResetDialog(false);
  };

  const handleSave = () => {
    toast.success(t.settingsSettingsSaved);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'logo':
        return <CompanyLogoSection />;
      case 'areas':
        return <AreasSection />;
      case 'taxonomy':
        return <TaxonomySection />;

      case 'template':
        return <DocumentTemplateSection />;
      default:
        return <CompanyLogoSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onLogout={onLogout} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-60 bg-surface-subtle border-r border-border flex-shrink-0">
          <div className="p-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
                    isActive
                      ? 'bg-sidebar-accent text-primary border-l-[3px] border-primary -ml-0.5 pl-[14px]'
                      : 'text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-background overflow-auto">
          {/* Header */}
          <div className="bg-card border-b border-border px-8 py-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ChevronLeft className="h-4 w-4" />
              Home &gt; {t.settings}
            </button>
            <h1 className="text-2xl font-semibold text-foreground mb-1">{t.settingsCompanySettings}</h1>
            <p className="text-sm text-muted-foreground">
              {t.settingsCustomizeInfo}
            </p>
          </div>

          {/* Section content */}
          <div className="p-8">
            <div className="bg-card border border-border rounded-xl p-8 max-w-4xl">
              {renderSection()}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <div className="bg-card border-t border-border px-8 py-4 flex justify-end gap-3">
        <Button
          variant="outline"
          className="text-destructive hover:bg-destructive/10"
          onClick={() => setShowResetDialog(true)}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          {t.settingsRestoreDefaults}
        </Button>
        <Button variant="outline" onClick={() => navigate('/')}>
          {t.cancel}
        </Button>
        <Button variant="corporate" onClick={handleSave}>
          {t.settingsSaveChanges}
        </Button>
      </div>

      {/* Reset confirmation dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.settingsRestoreConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.settingsRestoreConfirmDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t.settingsRestore}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}