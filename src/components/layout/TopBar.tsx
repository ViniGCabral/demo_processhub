import { Settings, LogOut, ChevronDown, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import contextusLogo from "@/assets/contextus-logo.png";

interface TopBarProps {
  onLogout?: () => void;
  isClientDemo?: boolean;
}

export function TopBar({ onLogout, isClientDemo }: TopBarProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <header className="h-14 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(isClientDemo ? "/demo_natura" : "/")}
          className="flex items-center cursor-pointer"
          aria-label="Ir para o início"
        >
          <img
            src={contextusLogo}
            alt="Contextus"
            className="h-8 w-auto"
          />
        </button>

        {isClientDemo && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0C1BA8]/10 text-[#0C1BA8] border border-[#0C1BA8]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0C1BA8] animate-pulse" />
            Natura · Arquitetura de Processos
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {!isClientDemo && (
          <button
            onClick={() => navigate("/academy")}
            className="hidden md:flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-primary transition-colors"
          >
            <GraduationCap className="h-4 w-4" />
            Academia de Processos
          </button>
        )}

        {/* Language Toggle */}
        <LanguageToggle variant="dark" />

        {/* User Menu - Hidden in client demo */}
        {!isClientDemo && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">V</span>
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-sm font-medium text-foreground block">Vini</span>
                <span className="text-xs text-muted-foreground">Administrador</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border border-border shadow-lg">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-medium text-foreground">Vini</p>
              <p className="text-xs text-muted-foreground">vini@processhub.com</p>
            </div>
            <DropdownMenuItem 
              onClick={() => navigate("/settings")}
              className="gap-3 py-2.5 cursor-pointer"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>{t.basicSettings}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={onLogout} 
              className="gap-3 py-2.5 cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>{t.logout}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        )}
      </div>
    </header>
  );
}
