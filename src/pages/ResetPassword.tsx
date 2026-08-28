import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import eloprocessLogo from "@/assets/eloprocess-logo-white.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ResetPassword() {
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error(t.authPasswordMin);
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t.authPasswordMismatch);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.error(error.message);
      } else {
        setSuccess(true);
        toast.success(t.resetPasswordSuccess);
      }
    } catch {
      toast.error(t.authGenericError);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0C1BA8' }}>
              <img src={eloprocessLogo} alt="ProcessHub" className="w-6 h-6" />
            </div>
            <span className="font-semibold text-xl" style={{ color: '#272727' }}>ProcessHub</span>
          </div>
          <h2 className="text-2xl font-semibold" style={{ color: '#272727' }}>{t.resetPasswordSuccess}</h2>
          <p className="text-sm" style={{ color: '#6B7280' }}>{t.resetPasswordSuccessDesc}</p>
          <Button
            className="w-full h-11 text-white font-medium"
            style={{ backgroundColor: '#0C1BA8' }}
            onClick={() => window.location.href = '/'}
          >
            {t.loginSubmit}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-white">
      <div className="absolute top-6 right-6">
        <LanguageToggle variant="dark" />
      </div>
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0C1BA8' }}>
            <img src={eloprocessLogo} alt="ProcessHub" className="w-6 h-6" />
          </div>
          <span className="font-semibold text-xl" style={{ color: '#272727' }}>ProcessHub</span>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold" style={{ color: '#272727' }}>{t.resetPasswordTitle}</h2>
          <p className="text-sm mt-2" style={{ color: '#6B7280' }}>{t.resetPasswordNewDesc}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={t.loginPassword}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-white border-[#E8E8EA] focus:border-[#0C1BA8] focus:ring-[#0C1BA8] pr-10"
              style={{ color: '#272727' }}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <Input
            type={showPassword ? "text" : "password"}
            placeholder={t.authConfirmPassword}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-11 bg-white border-[#E8E8EA] focus:border-[#0C1BA8] focus:ring-[#0C1BA8]"
            style={{ color: '#272727' }}
            required
            disabled={loading}
          />

          <Button
            type="submit"
            className="w-full h-11 text-white font-medium"
            style={{ backgroundColor: '#0C1BA8' }}
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {t.resetPasswordSubmit}
          </Button>
        </form>
      </div>
    </div>
  );
}
