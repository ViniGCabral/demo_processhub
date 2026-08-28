import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import eloprocessLogo from "@/assets/eloprocess-logo-white.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthMode = "login" | "signup" | "forgot";

export function Login() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);

  // Typewriter animation state
  const words = [t.typewriterWord1, t.typewriterWord2, t.typewriterWord3];
  const [displayText, setDisplayText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset animation when language changes
  useEffect(() => {
    setDisplayText('');
    setWordIndex(0);
    setIsDeleting(false);
  }, [t.typewriterWord1]);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayText(displayText + currentWord[displayText.length]);
        }, 150);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 80);
      } else {
        setWordIndex((wordIndex + 1) % words.length);
        setIsDeleting(false);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex, words]);

  const validateForm = (): boolean => {
    if (!email || !password) {
      toast.error(t.authFillAllFields);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t.authInvalidEmail);
      return false;
    }
    if (password.length < 6) {
      toast.error(t.authPasswordMin);
      return false;
    }
    if (mode === "signup" && password !== confirmPassword) {
      toast.error(t.authPasswordMismatch);
      return false;
    }
    return true;
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(t.authFillAllFields);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t.authInvalidEmail);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t.resetPasswordEmailSent);
        setMode("login");
      }
    } catch {
      toast.error(t.authGenericError);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "forgot") {
      return handleForgotPassword(e);
    }

    // Prototype mode: fake authentication, no password validation
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true");
      window.dispatchEvent(new Event("fake-auth-change"));
      setLoading(false);
    }, 400);
  };


  return (
    <div className="min-h-screen flex">
      {/* Language Toggle - Top Right (Desktop) */}
      <div className="hidden lg:block absolute top-6 right-6 z-10">
        <LanguageToggle variant="dark" />
      </div>

      {/* Left Panel - Blue Gradient with Typewriter */}
      <div 
        className="hidden lg:flex lg:w-1/2 flex-col p-8"
        style={{ 
          background: 'linear-gradient(180deg, #0C1BA8 0%, #06073E 100%)' 
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src={eloprocessLogo} 
            alt="ProcessHub" 
            className="w-8 h-8"
          />
          <span className="text-white font-semibold text-xl">ProcessHub</span>
        </div>

        {/* Centered typewriter content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-4xl font-light">
              {t.hubFor}
            </h1>
            <div className="text-white text-5xl font-semibold min-h-[60px] mt-1">
              <span>{displayText}</span>
              <span 
                className="inline-block w-[2px] h-[1.2em] bg-white ml-[2px] align-middle animate-cursor-blink"
              />
            </div>
            <p className="text-white text-4xl font-light mt-1">
              {t.typewriterProcesses}
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login/Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-sm">
          {/* Mobile header with logo and language toggle */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#0C1BA8' }}
                >
                  <img 
                    src={eloprocessLogo} 
                    alt="ProcessHub" 
                    className="w-6 h-6"
                  />
                </div>
                <span className="font-semibold text-xl" style={{ color: '#272727' }}>
                  ProcessHub
                </span>
              </div>
              <LanguageToggle variant="dark" />
            </div>
          </div>

          {/* Welcome heading */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold" style={{ color: '#272727' }}>
              {mode === "login" ? t.loginWelcome : mode === "signup" ? t.authCreateYourAccount : t.resetPasswordTitle}
            </h2>
            {mode === "signup" && (
              <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
                {t.authSignupSubtitle}
              </p>
            )}
            {mode === "forgot" && (
              <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
                {t.resetPasswordDesc}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div className="space-y-1.5">
              <Input
                id="email"
                type="email"
                placeholder={t.loginEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-white border-[#E8E8EA] focus:border-[#0C1BA8] focus:ring-[#0C1BA8]"
                style={{ color: '#272727' }}
                required
                disabled={loading}
              />
            </div>

            {/* Password input with toggle (hidden in forgot mode) */}
            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <div className="relative">
                  <Input
                    id="password"
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
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm password (signup only) */}
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder={t.authConfirmPassword}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 bg-white border-[#E8E8EA] focus:border-[#0C1BA8] focus:ring-[#0C1BA8]"
                  style={{ color: '#272727' }}
                  required
                  disabled={loading}
                />
              </div>
            )}

            {/* Forgot password link (login mode only) */}
            {mode === "login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-sm hover:underline"
                  style={{ color: '#0C1BA8' }}
                >
                  {t.loginForgotPassword}
                </button>
              </div>
            )}

            {/* Submit button */}
            <Button 
              type="submit" 
              className="w-full h-11 text-white font-medium"
              style={{ backgroundColor: '#0C1BA8' }}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {mode === "login" ? t.loginSubmit : mode === "signup" ? t.authSignupSubmit : t.resetPasswordSubmit}
            </Button>
          </form>

          {/* Toggle login/signup/forgot */}
          <div className="mt-6 flex justify-center gap-2 text-sm">
            <span style={{ color: '#6B7280' }}>
              {mode === "forgot" ? "" : mode === "login" ? t.authNoAccount : t.authHasAccount}
            </span>
            <button
              type="button"
              onClick={() => {
                if (mode === "forgot") {
                  setMode("login");
                } else {
                  setMode(mode === "login" ? "signup" : "login");
                }
                setPassword("");
                setConfirmPassword("");
              }}
              className="font-medium hover:underline"
              style={{ color: '#0C1BA8' }}
            >
              {mode === "forgot" ? t.resetPasswordBackToLogin : mode === "login" ? t.loginCreateAccount : t.loginSubmit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
