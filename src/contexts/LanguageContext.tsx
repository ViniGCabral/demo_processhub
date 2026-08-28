import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "PT" | "EN";

interface Translations {
  // Navigation
  backToDashboard: string;
  backToProcesses: string;
  
  // Dashboard
  processes: string;
  processArchitecture: string;
  processAnalysis: string;
  manageDocumentProcesses: string;
  defineProcessHierarchy: string;
  assessProcessPerformance: string;
  
  // Process List
  newProcess: string;
  searchProcesses: string;
  allAreas: string;
  import: string;
  export: string;
  area: string;
  processName: string;
  description: string;
  noProcessesFound: string;
  
  // Process Detail
  overview: string;
  pop: string;
  sop: string;
  bpmn: string;
  attributes: string;
  editProcess: string;
  processHealth: string;
  documentation: string;
  processContext: string;
  executor: string;
  approver: string;
  process: string;
  viewAndEdit: string;
  createDocumentation: string;
  viewDiagram: string;
  generateDiagram: string;
  
  // Categories
  automation: string;
  dataIntegrity: string;
  governanceCompliance: string;
  maturityScore: string;
  riskScore: string;
  highMaturity: string;
  moderateMaturity: string;
  developing: string;
  initialStage: string;
  lowRisk: string;
  moderateRisk: string;
  elevatedRisk: string;
  highRisk: string;
  
  // Assessment Page
  processAssessment: string;
  assessmentDescription: string;
  aiGeneratedAssessment: string;
  automationDescription: string;
  maturityScoreLabel: string;
  effortScoreLabel: string;
  riskScoreLabel: string;
  higherBetter: string;
  higherWorse: string;
  totalSteps: string;
  manualSteps: string;
  automatable: string;
  ofManual: string;
  potentialGain: string;
  automatingSteps: string;
  reduction: string;
  currentEffortManual: string;
  afterAutomation: string;
  insightLabel: string;
  dataIntegrityDescription: string;
  redFlags: string;
  unsafeSources: string;
  points: string;
  high: string;
  medium: string;
  low: string;
  governanceDescription: string;
  riskPoints: string;
  critical: string;
  popRequired: string;
  popRequiredDescription: string;
  goToPopSection: string;
  legendLow: string;
  legendMedium: string;
  legendHigh: string;
  // POP/SOP Editor
  noDocument: string;
  noDocumentDescription: string;
  uploadDocument: string;
  uploadExistingPop: string;
  generatePop: string;
  generatePopDescription: string;
  versions: string;
  published: string;
  draft: string;
  archived: string;
  saveDraft: string;
  publish: string;
  standardOperatingProcedure: string;
  procedureSteps: string;
  lastUpdated: string;
  status: string;
  version: string;
  selectImage: string;
  
  // BPMN
  noBpmnDiagram: string;
  noBpmnDescription: string;
  generateBpmn: string;
  generateFromDescription: string;
  fromPop: string;
  fromSop: string;
  requiresPopFirst: string;
  requiresSopFirst: string;
  bpmnDiagram: string;
  viewer: string;
  editor: string;
  
  // Settings
  settings: string;
  documentTemplates: string;
  basicSettings: string;
  logout: string;
  templateName: string;
  templateType: string;
  addTemplate: string;
  save: string;
  cancel: string;
  
  // Settings Page
  settingsCompanySettings: string;
  settingsCustomizeInfo: string;
  settingsRestoreDefaults: string;
  settingsSaveChanges: string;
  settingsRestoreConfirmTitle: string;
  settingsRestoreConfirmDesc: string;
  settingsRestore: string;
  settingsSettingsSaved: string;
  settingsSettingsRestored: string;
  
  // Areas Section
  areasOrganizationalAreas: string;
  areasConfigureAreas: string;
  areasProcesses: string;
  areasPositions: string;
  areasNoPositions: string;
  areasAddPosition: string;
  areasAddArea: string;
  areasEditArea: string;
  areasAreaCode: string;
  areasAreaName: string;
  areasDescription: string;
  areasIdentificationColor: string;
  areasCodeLength: string;
  areasNameLength: string;
  areasCodeExists: string;
  areasAreaUpdated: string;
  areasAreaAdded: string;
  areasProcessesUsingArea: string;
  areasAreaRemoved: string;
  
  // Positions
  positionsManage: string;
  positionsSearch: string;
  positionsNewPosition: string;
  positionsEditPosition: string;
  positionsAddPosition: string;
  positionsPositionName: string;
  positionsOptionalDescription: string;
  positionsArea: string;
  positionsSelectArea: string;
  positionsNameLength: string;
  positionsSelectAreaRequired: string;
  positionsPositionUpdated: string;
  positionsPositionAdded: string;
  positionsPositionRemoved: string;
  positionsNoPositionsFound: string;
  positionsAllAreas: string;
  
  // First time flow
  welcomeToProcess: string;
  uploadDocumentation: string;
  uploadDocumentationDescription: string;
  startWithUpload: string;

  // Login
  loginWelcome: string;
  loginEmail: string;
  loginPassword: string;
  loginRememberMe: string;
  loginSubmit: string;
  loginForgotPassword: string;
  loginCreateAccount: string;
  loginWithGoogle: string;
  loginOr: string;
  hubFor: string;
  typewriterWord1: string;
  typewriterWord2: string;
  typewriterWord3: string;
  typewriterProcesses: string;

  // Auth
  authFillAllFields: string;
  authInvalidEmail: string;
  authPasswordMin: string;
  authPasswordMismatch: string;
  authInvalidCredentials: string;
  authEmailNotConfirmed: string;
  authAlreadyRegistered: string;
  authCheckEmail: string;
  authGenericError: string;
  authCreateYourAccount: string;
  authSignupSubtitle: string;
  authConfirmPassword: string;
  authSignupSubmit: string;
  authNoAccount: string;
  authHasAccount: string;

  // Password Reset
  resetPasswordTitle: string;
  resetPasswordDesc: string;
  resetPasswordSubmit: string;
  resetPasswordEmailSent: string;
  resetPasswordBackToLogin: string;
  resetPasswordSuccess: string;
  resetPasswordSuccessDesc: string;
  resetPasswordNewDesc: string;
}

const translations: Record<Language, Translations> = {
  PT: {
    // Navigation
    backToDashboard: "Voltar ao Dashboard",
    backToProcesses: "Voltar aos Processos",
    
    // Dashboard
    processes: "Processos",
    processArchitecture: "Arquitetura de Processos",
    processAnalysis: "Análise de Processos",
    manageDocumentProcesses: "Gerencie e documente seus processos organizacionais",
    defineProcessHierarchy: "Defina a hierarquia e estrutura dos processos",
    assessProcessPerformance: "Avalie a performance e maturidade dos processos",
    
    // Process List
    newProcess: "Novo Processo",
    searchProcesses: "Buscar processos...",
    allAreas: "Todas as Áreas",
    import: "Importar",
    export: "Exportar",
    area: "Área",
    processName: "Nome do Processo",
    description: "Descrição",
    noProcessesFound: "Nenhum processo encontrado com os critérios informados.",
    
    // Process Detail
    overview: "Visão Geral",
    pop: "POP",
    sop: "POP",
    bpmn: "BPMN",
    attributes: "Atributos",
    editProcess: "Editar Processo",
    processHealth: "Saúde do Processo",
    documentation: "Documentação",
    processContext: "Contexto do Processo",
    executor: "Executor",
    approver: "Aprovador",
    process: "Processo",
    viewAndEdit: "Visualizar e editar documentação",
    createDocumentation: "Criar documentação do processo",
    viewDiagram: "Visualizar diagrama do processo",
    generateDiagram: "Gerar diagrama BPMN",
    
    // Categories
    automation: "Automação",
    dataIntegrity: "Data Integrity",
    governanceCompliance: "Governança e Compliance",
    maturityScore: "Maturidade",
    riskScore: "Risco",
    highMaturity: "Alta maturidade",
    moderateMaturity: "Maturidade moderada",
    developing: "Em desenvolvimento",
    initialStage: "Estágio inicial",
    lowRisk: "Baixo risco",
    moderateRisk: "Risco moderado",
    elevatedRisk: "Risco elevado",
    highRisk: "Alto risco",
    
    // POP Editor
    noDocument: "Sem Documento POP",
    noDocumentDescription: "Crie a documentação do processo enviando materiais existentes ou gerando do zero.",
    uploadDocument: "Enviar Documento",
    uploadExistingPop: "Envie um POP existente ou vídeo com transcrição",
    generatePop: "Gerar POP",
    generatePopDescription: "Gere documentação a partir das entradas do processo",
    versions: "Versões",
    published: "Publicado",
    draft: "Rascunho",
    archived: "Arquivado",
    saveDraft: "Salvar Rascunho",
    publish: "Publicar",
    standardOperatingProcedure: "Procedimento Operacional Padrão",
    procedureSteps: "Etapas do Procedimento",
    lastUpdated: "Última Atualização",
    status: "Status",
    version: "Versão",
    selectImage: "Selecionar imagem",
    
    // BPMN
    noBpmnDiagram: "Sem Diagrama BPMN",
    noBpmnDescription: "Crie um diagrama de processo para visualizar o fluxo de trabalho e pontos de decisão.",
    generateBpmn: "Gerar BPMN",
    generateFromDescription: "Criar diagrama a partir da descrição do processo",
    fromPop: "A partir do POP",
    fromSop: "A partir do POP",
    requiresPopFirst: "Requer documento POP primeiro",
    requiresSopFirst: "Requer documento POP primeiro",
    bpmnDiagram: "Diagrama BPMN",
    viewer: "Visualizar",
    editor: "Editar",
    
    // Settings
    settings: "Configurações",
    documentTemplates: "Modelos de Documentos",
    basicSettings: "Configurações Básicas",
    logout: "Sair",
    templateName: "Nome do Modelo",
    templateType: "Tipo",
    addTemplate: "Adicionar Modelo",
    save: "Salvar",
    cancel: "Cancelar",
    
    // Settings Page
    settingsCompanySettings: "Configurações da Empresa",
    settingsCustomizeInfo: "Customize as informações padrão da sua organização",
    settingsRestoreDefaults: "Restaurar Padrões",
    settingsSaveChanges: "Salvar Alterações",
    settingsRestoreConfirmTitle: "Restaurar configurações padrão?",
    settingsRestoreConfirmDesc: "Esta ação irá restaurar todas as configurações aos valores padrão. Esta ação não pode ser desfeita.",
    settingsRestore: "Restaurar",
    settingsSettingsSaved: "Configurações salvas com sucesso",
    settingsSettingsRestored: "Configurações restauradas aos padrões",
    
    // Areas Section
    areasOrganizationalAreas: "Áreas Organizacionais",
    areasConfigureAreas: "Configure as áreas da empresa que aparecerão ao criar novos processos.",
    areasProcesses: "processos",
    areasPositions: "cargos",
    areasNoPositions: "Nenhum cargo cadastrado",
    areasAddPosition: "Adicionar Cargo",
    areasAddArea: "Adicionar Área",
    areasEditArea: "Editar Área",
    areasAreaCode: "Sigla da Área",
    areasAreaName: "Nome da Área",
    areasDescription: "Descrição",
    areasIdentificationColor: "Cor de Identificação",
    areasCodeLength: "Sigla deve ter entre 2 e 4 caracteres",
    areasNameLength: "Nome deve ter entre 3 e 50 caracteres",
    areasCodeExists: "Sigla já existe",
    areasAreaUpdated: "Área atualizada",
    areasAreaAdded: "Área adicionada",
    areasProcessesUsingArea: "processo(s) usam esta área",
    areasAreaRemoved: "Área removida",
    
    // Positions
    positionsManage: "Gerenciar Cargos",
    positionsSearch: "Buscar cargos...",
    positionsNewPosition: "Novo Cargo",
    positionsEditPosition: "Editar Cargo",
    positionsAddPosition: "Adicionar Cargo",
    positionsPositionName: "Nome do Cargo",
    positionsOptionalDescription: "Descrição (Opcional)",
    positionsArea: "Área",
    positionsSelectArea: "Selecione uma área",
    positionsNameLength: "Nome deve ter entre 2 e 50 caracteres",
    positionsSelectAreaRequired: "Selecione uma área",
    positionsPositionUpdated: "Cargo atualizado",
    positionsPositionAdded: "Cargo adicionado",
    positionsPositionRemoved: "Cargo removido",
    positionsNoPositionsFound: "Nenhum cargo encontrado",
    positionsAllAreas: "Todas as áreas",
    
    // First time flow
    welcomeToProcess: "Bem-vindo ao Processo",
    uploadDocumentation: "Envie sua Documentação",
    uploadDocumentationDescription: "Para começar, envie um documento existente ou vídeo para gerar a documentação do processo automaticamente.",
    startWithUpload: "Começar com Upload",

    // Login
    loginWelcome: "Bem-vindo de volta",
    loginEmail: "seu@empresa.com",
    loginPassword: "Digite sua senha",
    loginRememberMe: "Lembrar-me neste computador",
    loginSubmit: "Entrar",
    loginForgotPassword: "Esqueceu sua senha?",
    loginCreateAccount: "Criar conta",
    loginWithGoogle: "Entrar com Google",
    loginOr: "ou",
    hubFor: "Seu hub para",
    typewriterWord1: "Documentar",
    typewriterWord2: "Armazenar",
    typewriterWord3: "Analisar",
    typewriterProcesses: "processos",

    // Auth
    authFillAllFields: "Preencha todos os campos",
    authInvalidEmail: "E-mail inválido",
    authPasswordMin: "A senha deve ter pelo menos 6 caracteres",
    authPasswordMismatch: "As senhas não coincidem",
    authInvalidCredentials: "E-mail ou senha incorretos",
    authEmailNotConfirmed: "Confirme seu e-mail antes de fazer login",
    authAlreadyRegistered: "Este e-mail já está cadastrado",
    authCheckEmail: "Conta criada! Verifique seu e-mail para confirmar o cadastro.",
    authGenericError: "Ocorreu um erro. Tente novamente.",
    authCreateYourAccount: "Crie sua conta",
    authSignupSubtitle: "Preencha os campos abaixo para começar",
    authConfirmPassword: "Confirme sua senha",
    authSignupSubmit: "Criar conta",
    authNoAccount: "Não tem uma conta?",
    authHasAccount: "Já tem uma conta?",

    // Password Reset
    resetPasswordTitle: "Redefinir senha",
    resetPasswordDesc: "Digite seu e-mail e enviaremos um link para redefinir sua senha.",
    resetPasswordSubmit: "Enviar link",
    resetPasswordEmailSent: "Link de redefinição enviado! Verifique seu e-mail.",
    resetPasswordBackToLogin: "Voltar ao login",
    resetPasswordSuccess: "Senha redefinida com sucesso!",
    resetPasswordSuccessDesc: "Sua senha foi atualizada. Você já pode fazer login.",
    resetPasswordNewDesc: "Digite sua nova senha abaixo.",
    
    // Assessment Page
    processAssessment: "Avaliação do Processo",
    assessmentDescription: "Avaliação de maturidade e riscos do processo.",
    aiGeneratedAssessment: "Avaliação gerada automaticamente por I.A.",
    automationDescription: "Avaliação de eficiência e automação do processo",
    maturityScoreLabel: "Score de Maturidade",
    effortScoreLabel: "Score de Esforço",
    riskScoreLabel: "Score de Risco",
    higherBetter: "quanto maior, melhor",
    higherWorse: "quanto maior, pior",
    totalSteps: "Total de Steps",
    manualSteps: "Steps Manuais",
    automatable: "Possíveis de Automatizar",
    ofManual: "dos manuais",
    potentialGain: "Ganho Potencial",
    automatingSteps: "automatizando",
    reduction: "de redução",
    currentEffortManual: "Esforço atual em steps manuais",
    afterAutomation: "Após automação",
    insightLabel: "Insight",
    dataIntegrityDescription: "Avaliação de qualidade e segurança dos dados",
    redFlags: "RED FLAGS",
    unsafeSources: "FONTES INSEGURAS",
    points: "pontos",
    high: "Alto",
    medium: "Médio",
    low: "Baixo",
    governanceDescription: "Avaliação de conformidade e controles",
    riskPoints: "PONTOS DE RISCO",
    critical: "CRÍTICO",
    popRequired: "POP/SOP Necessário",
    popRequiredDescription: "A avaliação de atributos do processo está disponível apenas após criar a documentação POP/SOP.",
    goToPopSection: "Vá para a seção POP/SOP para criar a documentação primeiro.",
    legendLow: "Baixo",
    legendMedium: "Médio",
    legendHigh: "Alto",
  },
  EN: {
    // Navigation
    backToDashboard: "Back to Dashboard",
    backToProcesses: "Back to Processes",
    
    // Dashboard
    processes: "Processes",
    processArchitecture: "Process Architecture",
    processAnalysis: "Process Analysis",
    manageDocumentProcesses: "Manage and document your organizational processes",
    defineProcessHierarchy: "Define process hierarchy and structure",
    assessProcessPerformance: "Assess process performance and maturity",
    
    // Process List
    newProcess: "New Process",
    searchProcesses: "Search processes...",
    allAreas: "All Areas",
    import: "Import",
    export: "Export",
    area: "Area",
    processName: "Process Name",
    description: "Description",
    noProcessesFound: "No processes found matching your criteria.",
    
    // Process Detail
    overview: "Overview",
    pop: "SOP",
    sop: "SOP",
    bpmn: "BPMN",
    attributes: "Attributes",
    editProcess: "Edit Process",
    processHealth: "Process Health",
    documentation: "Documentation",
    processContext: "Process Context",
    executor: "Executor",
    approver: "Approver",
    process: "Process",
    viewAndEdit: "View and edit documentation",
    createDocumentation: "Create process documentation",
    viewDiagram: "View process diagram",
    generateDiagram: "Generate BPMN diagram",
    
    // Categories
    automation: "Automation",
    dataIntegrity: "Data Integrity",
    governanceCompliance: "Governance & Compliance",
    maturityScore: "Maturity",
    riskScore: "Risk",
    highMaturity: "High maturity",
    moderateMaturity: "Moderate maturity",
    developing: "Developing",
    initialStage: "Initial stage",
    lowRisk: "Low risk",
    moderateRisk: "Moderate risk",
    elevatedRisk: "Elevated risk",
    highRisk: "High risk",
    
    // POP Editor
    noDocument: "No SOP Document",
    noDocumentDescription: "Create process documentation by uploading existing materials or generating from scratch.",
    uploadDocument: "Upload Document",
    uploadExistingPop: "Upload an existing SOP or video with transcription",
    generatePop: "Generate SOP",
    generatePopDescription: "Generate documentation from process inputs",
    versions: "Versions",
    published: "Published",
    draft: "Draft",
    archived: "Archived",
    saveDraft: "Save Draft",
    publish: "Publish",
    standardOperatingProcedure: "Standard Operating Procedure",
    procedureSteps: "Procedure Steps",
    lastUpdated: "Last Updated",
    status: "Status",
    version: "Version",
    selectImage: "Select image",
    
    // BPMN
    noBpmnDiagram: "No BPMN Diagram",
    noBpmnDescription: "Create a process diagram to visualize the workflow and decision points.",
    generateBpmn: "Generate BPMN",
    generateFromDescription: "Create diagram from process description",
    fromPop: "From SOP",
    fromSop: "From SOP",
    requiresPopFirst: "Requires SOP document first",
    requiresSopFirst: "Requires SOP document first",
    bpmnDiagram: "BPMN Diagram",
    viewer: "Viewer",
    editor: "Editor",
    
    // Settings
    settings: "Settings",
    documentTemplates: "Document Templates",
    basicSettings: "Basic Settings",
    logout: "Logout",
    templateName: "Template Name",
    templateType: "Type",
    addTemplate: "Add Template",
    save: "Save",
    cancel: "Cancel",
    
    // Settings Page
    settingsCompanySettings: "Company Settings",
    settingsCustomizeInfo: "Customize your organization's default information",
    settingsRestoreDefaults: "Restore Defaults",
    settingsSaveChanges: "Save Changes",
    settingsRestoreConfirmTitle: "Restore default settings?",
    settingsRestoreConfirmDesc: "This action will restore all settings to default values. This action cannot be undone.",
    settingsRestore: "Restore",
    settingsSettingsSaved: "Settings saved successfully",
    settingsSettingsRestored: "Settings restored to defaults",
    
    // Areas Section
    areasOrganizationalAreas: "Organizational Areas",
    areasConfigureAreas: "Configure company areas that will appear when creating new processes.",
    areasProcesses: "processes",
    areasPositions: "positions",
    areasNoPositions: "No positions registered",
    areasAddPosition: "Add Position",
    areasAddArea: "Add Area",
    areasEditArea: "Edit Area",
    areasAreaCode: "Area Code",
    areasAreaName: "Area Name",
    areasDescription: "Description",
    areasIdentificationColor: "Identification Color",
    areasCodeLength: "Code must be between 2 and 4 characters",
    areasNameLength: "Name must be between 3 and 50 characters",
    areasCodeExists: "Code already exists",
    areasAreaUpdated: "Area updated",
    areasAreaAdded: "Area added",
    areasProcessesUsingArea: "process(es) use this area",
    areasAreaRemoved: "Area removed",
    
    // Positions
    positionsManage: "Manage Positions",
    positionsSearch: "Search positions...",
    positionsNewPosition: "New Position",
    positionsEditPosition: "Edit Position",
    positionsAddPosition: "Add Position",
    positionsPositionName: "Position Name",
    positionsOptionalDescription: "Description (Optional)",
    positionsArea: "Area",
    positionsSelectArea: "Select an area",
    positionsNameLength: "Name must be between 2 and 50 characters",
    positionsSelectAreaRequired: "Select an area",
    positionsPositionUpdated: "Position updated",
    positionsPositionAdded: "Position added",
    positionsPositionRemoved: "Position removed",
    positionsNoPositionsFound: "No positions found",
    positionsAllAreas: "All areas",
    
    // First time flow
    welcomeToProcess: "Welcome to the Process",
    uploadDocumentation: "Upload your Documentation",
    uploadDocumentationDescription: "To get started, upload an existing document or video to automatically generate process documentation.",
    startWithUpload: "Start with Upload",

    // Login
    loginWelcome: "Welcome back",
    loginEmail: "you@company.com",
    loginPassword: "Enter your password",
    loginRememberMe: "Remember me on this computer",
    loginSubmit: "Sign in",
    loginForgotPassword: "Forgot password?",
    loginCreateAccount: "Create account",
    loginWithGoogle: "Sign in with Google",
    loginOr: "or",
    hubFor: "Your hub to",
    typewriterWord1: "Document",
    typewriterWord2: "Store",
    typewriterWord3: "Analyze",
    typewriterProcesses: "processes",

    // Auth
    authFillAllFields: "Please fill all fields",
    authInvalidEmail: "Invalid email address",
    authPasswordMin: "Password must be at least 6 characters",
    authPasswordMismatch: "Passwords do not match",
    authInvalidCredentials: "Invalid email or password",
    authEmailNotConfirmed: "Please confirm your email before signing in",
    authAlreadyRegistered: "This email is already registered",
    authCheckEmail: "Account created! Check your email to confirm your registration.",
    authGenericError: "An error occurred. Please try again.",
    authCreateYourAccount: "Create your account",
    authSignupSubtitle: "Fill in the fields below to get started",
    authConfirmPassword: "Confirm your password",
    authSignupSubmit: "Create account",
    authNoAccount: "Don't have an account?",
    authHasAccount: "Already have an account?",

    // Password Reset
    resetPasswordTitle: "Reset password",
    resetPasswordDesc: "Enter your email and we'll send you a link to reset your password.",
    resetPasswordSubmit: "Send link",
    resetPasswordEmailSent: "Reset link sent! Check your email.",
    resetPasswordBackToLogin: "Back to login",
    resetPasswordSuccess: "Password reset successfully!",
    resetPasswordSuccessDesc: "Your password has been updated. You can now sign in.",
    resetPasswordNewDesc: "Enter your new password below.",
    
    // Assessment Page
    processAssessment: "Process Assessment",
    assessmentDescription: "Maturity and risk assessment of the process.",
    aiGeneratedAssessment: "Assessment automatically generated by A.I.",
    automationDescription: "Efficiency and automation assessment of the process",
    maturityScoreLabel: "Maturity Score",
    effortScoreLabel: "Effort Score",
    riskScoreLabel: "Risk Score",
    higherBetter: "higher is better",
    higherWorse: "higher is worse",
    totalSteps: "Total Steps",
    manualSteps: "Manual Steps",
    automatable: "Automatable",
    ofManual: "of manual",
    potentialGain: "Potential Gain",
    automatingSteps: "automating",
    reduction: "reduction",
    currentEffortManual: "Current effort in manual steps",
    afterAutomation: "After automation",
    insightLabel: "Insight",
    dataIntegrityDescription: "Data quality and security assessment",
    redFlags: "RED FLAGS",
    unsafeSources: "UNSAFE SOURCES",
    points: "points",
    high: "High",
    medium: "Medium",
    low: "Low",
    governanceDescription: "Compliance and controls assessment",
    riskPoints: "RISK POINTS",
    critical: "CRITICAL",
    popRequired: "SOP/POP Required",
    popRequiredDescription: "Process attributes assessment is only available after creating the SOP/POP documentation.",
    goToPopSection: "Go to the SOP/POP section to create the documentation first.",
    legendLow: "Low",
    legendMedium: "Medium",
    legendHigh: "High",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('processhub-language');
    return (saved === 'EN' || saved === 'PT') ? saved : 'PT';
  });

  useEffect(() => {
    localStorage.setItem('processhub-language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
