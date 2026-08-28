import { useState, useRef, useEffect } from "react";
import { Bot, Send, PanelRightClose, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FieldData {
  name: string;
  format: string;
  editableAtStages: string;
  requiredAtStages: string;
  input: string;
  helpText: string;
  notes: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
}

interface ProcessAIChatProps {
  open: boolean;
  onToggle: () => void;
  onAddField?: (field: FieldData) => void;
}

function extractFieldName(msg: string): string {
  const patterns = [
    /add (?:a )?field (?:for |called |named )["']?([^"'\n,.]+)["']?/i,
    /create (?:a )?field (?:for |called |named )["']?([^"'\n,.]+)["']?/i,
    /new field ["']?([^"'\n,.]+)["']?/i,
    /adicionar (?:o )?campo (?:de |para |chamado )["']?([^"'\n,.]+)["']?/i,
    /campo (?:de |para )["']?([^"'\n,.]+)["']?/i,
    /add ["']?([^"'\n,.]+)["']? field/i,
  ];
  for (const p of patterns) {
    const m = msg.match(p);
    if (m?.[1]) {
      return m[1].trim().replace(/\b\w/g, c => c.toUpperCase());
    }
  }
  // fallback: last 1-3 words after "add" or "create"
  const simple = msg.match(/(?:add|create|adicionar)\s+(.{2,30})$/i);
  if (simple?.[1]) return simple[1].trim().replace(/\b\w/g, c => c.toUpperCase());
  return "New Field";
}

function inferFormat(msg: string): string {
  const lower = msg.toLowerCase();
  if (/\b(date|data)\b/.test(lower)) return "Date";
  if (/\b(number|quantity|qty|amount|número|quantidade)\b/.test(lower)) return "Number";
  if (/\b(dropdown|list|select|lista)\b/.test(lower)) return "Dropdown";
  if (/\b(decimal|price|preço|value|valor|currency|moeda)\b/.test(lower)) return "Decimal";
  if (/\b(boolean|yes.?no|sim.?não|checkbox)\b/.test(lower)) return "Boolean";
  if (/\b(text\s?area|long text|descrição longa|multiline)\b/.test(lower)) return "Text area";
  return "Text";
}

function inferInput(msg: string, format: string): string {
  const lower = msg.toLowerCase();
  if (/sap/.test(lower)) return "From SAP";
  if (/workday/.test(lower)) return "From Workday";
  if (format === "Dropdown") return "Options to be defined";
  return "Manual input";
}

function inferRequired(msg: string): string {
  const lower = msg.toLowerCase();
  if (/optional|não obrigatório|not required/i.test(lower)) return "";
  return "Request Creation";
}

function buildFieldFromMessage(msg: string): FieldData {
  const name = extractFieldName(msg);
  const format = inferFormat(msg);
  return {
    name,
    format,
    editableAtStages: "Request Creation",
    requiredAtStages: inferRequired(msg),
    input: inferInput(msg, format),
    helpText: "",
    notes: "",
  };
}

function buildAIResponse(field: FieldData): string {
  const req = field.requiredAtStages
    ? "It's set as editable and required at the Request Creation stage."
    : "It's set as editable and optional.";
  return `Got it. I've added **${field.name}** as a ${field.format} field to the Data Dictionary. ${req} You can adjust the details directly in the table if needed.`;
}

function TypingIndicator() {
  return (
    <div className="flex gap-2">
      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Bot className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="bg-background border border-border rounded-lg rounded-tl-none px-4 py-3 flex gap-1 items-center">
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function renderContent(text: string) {
  // Simple bold markdown rendering
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

let msgId = 0;

export function ProcessAIChat({ open, onToggle, onAddField }: ProcessAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "ai",
      content: "Hi! I'm your Process AI assistant. I can help you add fields to the Data Dictionary. Try saying something like \"add a field for Supplier Name\" or \"create a date field for Delivery Date\".",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = { id: `msg-${++msgId}`, role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    const field = buildFieldFromMessage(text);
    const response = buildAIResponse(field);

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: ChatMessage = { id: `msg-${++msgId}`, role: "ai", content: response };
      setMessages(prev => [...prev, aiMsg]);
      onAddField?.(field);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) {
    return (
      <div className="fixed right-0 top-[56px] h-[calc(100vh-56px)] w-12 border-l border-border bg-card flex flex-col items-center z-10">
        <button
          onClick={onToggle}
          className="mt-3 h-9 w-9 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
          title="Open Process AI"
        >
          <MessageSquare className="h-4 w-4 text-primary" />
        </button>
      </div>
    );
  }

  return (
    <aside className="w-[320px] shrink-0 border-l border-border bg-card fixed right-0 top-[56px] h-[calc(100vh-56px)] flex flex-col z-10">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
        <span className="font-semibold text-sm text-foreground flex-1">Process AI</span>
        <button onClick={onToggle} className="text-muted-foreground hover:text-foreground transition-colors">
          <PanelRightClose className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-4 bg-muted/30">
        {messages.map((msg) =>
          msg.role === "ai" ? (
            <div key={msg.id} className="flex gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="bg-background border border-border rounded-lg rounded-tl-none px-3 py-2 text-sm text-foreground max-w-[85%]">
                {renderContent(msg.content)}
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex justify-end">
              <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none px-3 py-2 text-sm max-w-[85%]">
                {msg.content}
              </div>
            </div>
          )
        )}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border flex gap-2">
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about this process..."
          className="text-sm h-9"
          disabled={isTyping}
        />
        <Button size="sm" className="h-9 px-3 shrink-0" onClick={handleSend} disabled={isTyping || !inputValue.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
