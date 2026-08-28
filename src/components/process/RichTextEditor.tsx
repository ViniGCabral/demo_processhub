import { useState, useRef } from "react";
import { Bold, Italic, List, Heading, Image, Undo, Redo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export function RichTextEditor({ content, onChange, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const formats: string[] = [];
    if (document.queryCommandState("bold")) formats.push("bold");
    if (document.queryCommandState("italic")) formats.push("italic");
    if (document.queryCommandState("insertUnorderedList")) formats.push("list");
    setActiveFormats(formats);
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  };

  const formatButtons = [
    { command: "bold", icon: Bold, label: "Negrito" },
    { command: "italic", icon: Italic, label: "Itálico" },
    { command: "insertUnorderedList", icon: List, label: "Lista" },
  ];

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden bg-card", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-border/50 bg-muted/30">
        <button
          type="button"
          onClick={() => execCommand("formatBlock", "h3")}
          className="p-2 rounded hover:bg-muted transition-colors"
          title="Título"
        >
          <Heading className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="w-px h-4 bg-border/60 mx-1" />
        {formatButtons.map(({ command, icon: Icon, label }) => (
          <button
            key={command}
            type="button"
            onClick={() => execCommand(command)}
            className={cn(
              "p-2 rounded transition-colors",
              activeFormats.includes(command) 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-muted text-muted-foreground"
            )}
            title={label}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        <div className="w-px h-4 bg-border/60 mx-1" />
        <button
          type="button"
          onClick={() => execCommand("undo")}
          className="p-2 rounded hover:bg-muted transition-colors"
          title="Desfazer"
        >
          <Undo className="h-4 w-4 text-muted-foreground" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("redo")}
          className="p-2 rounded hover:bg-muted transition-colors"
          title="Refazer"
        >
          <Redo className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        className="min-h-[100px] p-4 outline-none prose prose-sm max-w-none focus:ring-2 focus:ring-primary/20"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
