import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Login } from "./pages/Login";
import { ResetPassword } from "./pages/ResetPassword";
import { Dashboard } from "./pages/Dashboard";
import { ProcessList } from "./pages/ProcessList";
import { NewProcess } from "./pages/NewProcess";
import { ProcessDetail } from "./pages/ProcessDetail";
import { Settings } from "./pages/Settings";
import { ProcessArchitecture } from "./pages/ProcessArchitecture";
import { UseCases } from "./pages/UseCases";
import { SavedUseCases } from "./pages/SavedUseCases";
import { OrgIntelligenceHub } from "./pages/OrgIntelligenceHub";
import { ProcessAnalysis } from "./pages/ProcessAnalysis";
import { DiscoverOpportunities } from "./pages/DiscoverOpportunities";
import { TransformProcesses } from "./pages/TransformProcesses";
import { Normatives } from "./pages/Normatives";
import NotFound from "./pages/NotFound";
import { supabase } from "@/integrations/supabase/client";
import { useProcessStore } from "@/stores/processStore";
import type { Session, User } from "@supabase/supabase-js";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchProcesses = useProcessStore((s) => s.fetchProcesses);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch processes when user is authenticated
  useEffect(() => {
    if (session && user) {
      fetchProcesses();
    }
  }, [session, user, fetchProcesses]);

  // Prototype mode: fake login flag (no password validation)
  const [fakeAuth, setFakeAuth] = useState(
    () => localStorage.getItem("isAuthenticated") === "true"
  );

  useEffect(() => {
    const sync = () => setFakeAuth(localStorage.getItem("isAuthenticated") === "true");
    window.addEventListener("fake-auth-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("fake-auth-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Prototype mode without a real session: seed demo processes locally
  useEffect(() => {
    if (fakeAuth && !session) {
      const s = useProcessStore.getState();
      if (!s.loaded && s.processes.length === 0) s.seedInitialProcesses();
    }
  }, [fakeAuth, session]);


  const handleLogout = async () => {
    localStorage.removeItem("isAuthenticated");
    setFakeAuth(false);
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAuthenticated = (!!session && !!user) || fakeAuth;

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {!isAuthenticated ? (
              <Routes>
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<Login />} />
              </Routes>
            ) : (
              <Routes>
                <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
                <Route path="/processes" element={<ProcessList onLogout={handleLogout} />} />
                <Route path="/processes/new" element={<NewProcess onLogout={handleLogout} />} />
                <Route path="/processes/:id" element={<ProcessDetail onLogout={handleLogout} />} />
                <Route path="/architecture" element={<ProcessArchitecture onLogout={handleLogout} />} />
                <Route path="/use-cases" element={<UseCases onLogout={handleLogout} />} />
                <Route path="/saved-use-cases" element={<SavedUseCases onLogout={handleLogout} />} />
                <Route path="/process-analysis" element={<ProcessAnalysis onLogout={handleLogout} />} />
                <Route path="/org-intelligence-hub" element={<OrgIntelligenceHub onLogout={handleLogout} />} />
                <Route path="/org-intelligence-hub/discover" element={<DiscoverOpportunities onLogout={handleLogout} />} />
                <Route path="/org-intelligence-hub/transform" element={<TransformProcesses onLogout={handleLogout} />} />
                <Route path="/settings" element={<Settings onLogout={handleLogout} />} />
                <Route path="/normatives/*" element={<Normatives onLogout={handleLogout} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
