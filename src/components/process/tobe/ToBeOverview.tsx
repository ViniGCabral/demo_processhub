import { useState, useRef, useEffect } from "react";
import { Sparkles, Video, FileText, Upload, Bot, Send, Loader2, Paperclip, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ToBeOverviewProps {
  onGenerated?: () => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi! I've finished processing the TO-BE requirements for this process. I generated:\n\n- **BPMN Diagram** with 6 automated tasks\n- **Data Dictionary** with 3 fields mapped\n- **2 User Stories** with acceptance criteria\n- **3 System Integrations** (SAP, Workday, ServiceNow)\n\nYou can explore each section in the sidebar. How can I help you refine the requirements?",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: "2",
    role: "user",
    content: "Can we add a step for budget validation before the approval?",
    timestamp: new Date(Date.now() - 90000),
  },
  {
    id: "3",
    role: "assistant",
    content: "Absolutely! I've added a **\"Validate Budget Availability\"** task in the BPMN between the data enrichment and the approval gateway. Here's what changed:\n\n- **BPMN**: New task calls Workday API to check `budget_available` for the cost center\n- **Fields**: Added `budget_remaining` (Number) field from Workday\n- **User Story US-1**: Updated acceptance criteria to include budget check result display\n\nWould you like me to also add a business rule for what happens when the budget is insufficient?",
    timestamp: new Date(Date.now() - 60000),
  },
];

let msgId = 4;

export function ToBeOverview({ onGenerated }: ToBeOverviewProps) {
  const [isGenerated, setIsGenerated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showUploadCards, setShowUploadCards] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [transcriptionFile, setTranscriptionFile] = useState<File | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const transcriptionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleProcess = () => {
    if (!videoFile && !transcriptionFile) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsGenerated(true);
      onGenerated?.();
    }, 3000);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg: ChatMessage = {
      id: String(msgId++),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    setTimeout(() => {
      const reply: ChatMessage = {
        id: String(msgId++),
        role: "assistant",
        content: "I've analyzed your request and updated the relevant TO-BE artifacts. You can check the changes in the corresponding tabs on the sidebar. Is there anything else you'd like to adjust?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideoFile(file);
  };

  const handleTranscriptionSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setTranscriptionFile(file);
  };

  // --- Upload State (before generation) ---
  if (!isGenerated) {
    const hasAnyFile = !!videoFile || !!transcriptionFile;

    return (
      <div className="max-w-3xl mx-auto py-12 px-6">
        {/* Hidden file inputs */}
        <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoSelect} />
        <input ref={transcriptionInputRef} type="file" accept=".txt,.docx,.pdf,.doc" className="hidden" onChange={handleTranscriptionSelect} />

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Create TO-BE Process Requirements
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Upload the process recording and our AI will generate the BPMN, Data Dictionary, User Stories, and Integrations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Video card */}
          <Card
            className={cn(
              "border-2 transition-colors cursor-pointer group",
              videoFile
                ? "border-green-500/50 bg-green-500/5"
                : "border-dashed border-border hover:border-primary/40"
            )}
            onClick={() => !videoFile && videoInputRef.current?.click()}
          >
            <CardContent className="flex flex-col items-center justify-center py-10 text-center relative">
              {videoFile && (
                <button
                  onClick={e => { e.stopPropagation(); setVideoFile(null); }}
                  className="absolute top-3 right-3 h-6 w-6 rounded-full bg-muted hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <div className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center mb-4 transition-colors",
                videoFile ? "bg-green-500/10" : "bg-muted group-hover:bg-primary/10"
              )}>
                {videoFile ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <Video className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </div>
              <p className="font-medium text-foreground text-sm mb-1">1. Process Video</p>
              {videoFile ? (
                <p className="text-xs text-green-600 font-medium">{videoFile.name}</p>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground mb-4">MP4, MOV or WebM — up to 500MB</p>
                  <Button variant="outline" size="sm" className="gap-2" onClick={e => { e.stopPropagation(); videoInputRef.current?.click(); }}>
                    <Upload className="h-3.5 w-3.5" />
                    Upload Video
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Transcription card */}
          <Card
            className={cn(
              "border-2 transition-colors cursor-pointer group",
              transcriptionFile
                ? "border-green-500/50 bg-green-500/5"
                : "border-dashed border-border hover:border-primary/40"
            )}
            onClick={() => !transcriptionFile && transcriptionInputRef.current?.click()}
          >
            <CardContent className="flex flex-col items-center justify-center py-10 text-center relative">
              {transcriptionFile && (
                <button
                  onClick={e => { e.stopPropagation(); setTranscriptionFile(null); }}
                  className="absolute top-3 right-3 h-6 w-6 rounded-full bg-muted hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <div className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center mb-4 transition-colors",
                transcriptionFile ? "bg-green-500/10" : "bg-muted group-hover:bg-primary/10"
              )}>
                {transcriptionFile ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <FileText className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </div>
              <p className="font-medium text-foreground text-sm mb-1">2. Transcription</p>
              {transcriptionFile ? (
                <p className="text-xs text-green-600 font-medium">{transcriptionFile.name}</p>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground mb-4">TXT, DOCX or PDF — optional</p>
                  <Button variant="outline" size="sm" className="gap-2" onClick={e => { e.stopPropagation(); transcriptionInputRef.current?.click(); }}>
                    <Upload className="h-3.5 w-3.5" />
                    Upload File
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-lg px-5 py-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Generating TO-BE Requirements...</p>
                <p className="text-xs text-muted-foreground">Analyzing video and creating BPMN, Fields, User Stories & Integrations</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <Button
            size="lg"
            className="gap-2 px-8"
            onClick={handleProcess}
            disabled={isProcessing || !hasAnyFile}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Process with AI
              </>
            )}
          </Button>
          {!hasAnyFile && (
            <p className="text-xs text-muted-foreground mt-3">Upload at least one file to continue</p>
          )}
        </div>
      </div>
    );
  }

  // --- Chat State (after generation) ---
  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Chat header */}
      <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-sm bg-primary/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Process Requirements Assistant</h2>
            <p className="text-xs text-muted-foreground">Ask questions, request edits, or upload new recordings</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs gap-1 rounded-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
          TO-BE Generated
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto bg-muted/20">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-3", msg.role === "user" && "justify-end")}>
              {msg.role === "assistant" && (
                <div className="h-7 w-7 rounded-sm bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[75%] rounded-sm px-4 py-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary [&_*]:text-white text-white"
                    : "bg-card border border-border text-foreground"
                )}
              >
                {msg.content.split("\n").map((line, i) => {
                  const parts = line.split(/(\*\*[^*]+\*\*)/g);
                  return (
                    <p key={i} className={cn(i > 0 && "mt-1.5", !line && "mt-3")}>
                      {parts.map((part, j) =>
                        part.startsWith("**") && part.endsWith("**") ? (
                          <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
                        ) : (
                          <span key={j}>{part}</span>
                        )
                      )}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Upload new video (collapsible) */}
      {showUploadCards && (
        <div className="border-t border-border bg-card px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Upload New Recording</p>
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setShowUploadCards(false)}>Close</Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card className="border border-dashed border-border hover:border-primary/40 transition-colors cursor-pointer group rounded-sm">
                <CardContent className="flex items-center gap-3 py-3 px-4">
                  <Video className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Process Video</p>
                    <p className="text-[10px] text-muted-foreground">MP4, MOV or WebM</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-dashed border-border hover:border-primary/40 transition-colors cursor-pointer group rounded-sm">
                <CardContent className="flex items-center gap-3 py-3 px-4">
                  <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Transcription</p>
                    <p className="text-[10px] text-muted-foreground">TXT, DOCX or PDF</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border bg-card px-6 py-3 shrink-0">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-primary rounded-sm" onClick={() => setShowUploadCards(prev => !prev)} title="Upload new recording">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Ask about requirements, request changes, or refine artifacts..."
            className="text-sm h-9 flex-1 rounded-sm"
          />
          <Button size="sm" className="h-9 px-3 shrink-0 rounded-sm" onClick={handleSend} disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
