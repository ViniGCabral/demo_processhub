import { useState, useMemo, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, X, BookOpen, CheckCircle2, Shield, Link2, Search, AlertTriangle } from "lucide-react";
import { ViewEditToggle } from "./ViewEditToggle";
import { cn } from "@/lib/utils";

interface AcceptanceCriterion {
  given: string;
  when: string;
  then: string;
}

interface UserStory {
  id: string;
  storyId: string;
  role: string;
  description: string;
  criteria: AcceptanceCriterion[];
  rules: string[];
  dependencies: string[];
}

const initialStories: UserStory[] = [
  {
    id: "us-1",
    storyId: "US-001",
    role: "Requester",
    description: "As a requester, I want to search and select a material from the SAP catalog when creating a purchase request, so that the material data is automatically populated and validated without manual errors.",
    criteria: [
      { given: "the user is at the Request Creation step", when: "they search for a material code", then: "only active materials from SAP must appear in the results." },
      { given: "the user selects a material", when: "the selection is confirmed", then: "Material Description, Unit Price and Unit of Measure must be auto-populated from SAP master data." },
    ],
    rules: [
      "The user can only see materials their SAP profile has permission to request.",
      "Material Description and Unit Price are read-only and cannot be manually edited by the requester.",
    ],
    dependencies: [],
  },
  {
    id: "us-2",
    storyId: "US-002",
    role: "Requester",
    description: "As a requester, I want to receive clear feedback when my purchase request fails validation, so that I know exactly what to correct before resubmitting.",
    criteria: [
      { given: "the system runs Auto-Validate", when: "the request fails validation", then: "the requester must receive a notification listing the specific fields that failed and why." },
      { given: "the requester receives the return notification", when: "they open the request", then: "the failed fields must be highlighted in the form." },
    ],
    rules: [
      "The validation notification must be sent within 0.5 hours per the Auto-Validate SLA.",
      "A returned request can be corrected and resubmitted — it must not be permanently rejected.",
    ],
    dependencies: ["US-001"],
  },
  {
    id: "us-3",
    storyId: "US-003",
    role: "Manager",
    description: "As a manager, I want to review and approve or reject purchase requests above $5,000, so that I can ensure budget compliance before the order is placed.",
    criteria: [
      { given: "a request with total value above $5K reaches the Approval step", when: "the manager opens it", then: "all request details, justification, and enriched material data must be visible." },
      { given: "the manager clicks Approve", when: "the action is confirmed", then: "the request must proceed to the Create Purchase Order step automatically." },
    ],
    rules: [
      "Requests at or below $5K are auto-approved and must never reach the Manager Approval step.",
      "The Justification field is mandatory for the manager to complete approval on requests above $5K.",
    ],
    dependencies: ["US-001"],
  },
  {
    id: "us-4",
    storyId: "US-004",
    role: "Requester",
    description: "As a requester, I want to receive a notification with the purchase order number once my request is fully processed, so that I can track the order in SAP.",
    criteria: [
      { given: "the purchase order is created in SAP", when: "the Send Notification step executes", then: "the requester must receive an email with the PO number and expected delivery date." },
    ],
    rules: [
      "The notification must be sent to the requester's corporate email automatically — no manual action required.",
      "If PO creation fails in SAP, the notification must inform the requester of the failure and next steps.",
    ],
    dependencies: ["US-003"],
  },
];

let nextNum = 5;

// Highlight matching text with amber background
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-amber-200/80 text-foreground rounded-sm px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// Check if a story matches the search query
function storyMatchesQuery(story: UserStory, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  if (story.storyId.toLowerCase().includes(q)) return true;
  if (story.role.toLowerCase().includes(q)) return true;
  if (story.description.toLowerCase().includes(q)) return true;
  for (const c of story.criteria) {
    if (c.given.toLowerCase().includes(q) || c.when.toLowerCase().includes(q) || c.then.toLowerCase().includes(q)) return true;
  }
  for (const r of story.rules) {
    if (r.toLowerCase().includes(q)) return true;
  }
  return false;
}

// Get dependency badge text for a story
function getDependencyBadgeText(deps: string[]): string | null {
  if (deps.length === 0) return null;
  if (deps.length === 1) return `⚠ Blocked by ${deps[0]}`;
  return `⚠ Blocked by ${deps.length} stories`;
}

export function ToBeUserStories() {
  const [stories, setStories] = useState<UserStory[]>(initialStories);
  const [selectedId, setSelectedId] = useState<string>("us-1");
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [depInput, setDepInput] = useState("");
  const [showDepDropdown, setShowDepDropdown] = useState(false);
  const depInputRef = useRef<HTMLInputElement>(null);
  const storyRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selected = stories.find(s => s.id === selectedId) || stories[0];

  const filteredStories = useMemo(
    () => stories.filter(s => storyMatchesQuery(s, searchQuery)),
    [stories, searchQuery]
  );

  const getStoryTitle = (desc: string) => {
    const match = desc.match(/I want to (.+?)(?:,| so that)/);
    return match ? match[1] : desc.slice(0, 60);
  };

  const updateStory = (id: string, key: keyof UserStory, value: any) => {
    setStories(prev => prev.map(s => s.id === id ? { ...s, [key]: value } : s));
  };

  const addStory = () => {
    const num = nextNum++;
    const id = `us-${num}`;
    const storyId = `US-${String(num).padStart(3, "0")}`;
    setStories(prev => [...prev, { id, storyId, role: "", description: "", criteria: [{ given: "", when: "", then: "" }], rules: [""], dependencies: [] }]);
    setSelectedId(id);
  };

  const removeStory = (id: string) => {
    setStories(prev => {
      const next = prev.filter(s => s.id !== id);
      if (selectedId === id && next.length > 0) setSelectedId(next[0].id);
      return next;
    });
  };

  const updateCriterion = (storyId: string, index: number, field: keyof AcceptanceCriterion, value: string) => {
    setStories(prev => prev.map(s => {
      if (s.id !== storyId) return s;
      const criteria = [...s.criteria];
      criteria[index] = { ...criteria[index], [field]: value };
      return { ...s, criteria };
    }));
  };

  const addCriterion = (storyId: string) => {
    setStories(prev => prev.map(s => s.id !== storyId ? s : { ...s, criteria: [...s.criteria, { given: "", when: "", then: "" }] }));
  };

  const removeCriterion = (storyId: string, index: number) => {
    setStories(prev => prev.map(s => s.id !== storyId ? s : { ...s, criteria: s.criteria.filter((_, i) => i !== index) }));
  };

  const updateRule = (storyId: string, index: number, value: string) => {
    setStories(prev => prev.map(s => {
      if (s.id !== storyId) return s;
      const rules = [...s.rules];
      rules[index] = value;
      return { ...s, rules };
    }));
  };

  const addRule = (storyId: string) => {
    setStories(prev => prev.map(s => s.id !== storyId ? s : { ...s, rules: [...s.rules, ""] }));
  };

  const removeRule = (storyId: string, index: number) => {
    setStories(prev => prev.map(s => s.id !== storyId ? s : { ...s, rules: s.rules.filter((_, i) => i !== index) }));
  };

  // --- Dependency helpers ---
  const addDependencyTag = useCallback((storyId: string, depStoryId: string) => {
    const normalized = depStoryId.trim().toUpperCase();
    if (!normalized) return;
    setStories(prev => prev.map(s => {
      if (s.id !== storyId) return s;
      if (s.dependencies.includes(normalized)) return s;
      return { ...s, dependencies: [...s.dependencies, normalized] };
    }));
    setDepInput("");
    setShowDepDropdown(false);
  }, []);

  const removeDependencyTag = (storyId: string, dep: string) => {
    setStories(prev => prev.map(s => s.id !== storyId ? s : { ...s, dependencies: s.dependencies.filter(d => d !== dep) }));
  };

  const depSuggestions = useMemo(() => {
    if (!depInput.trim()) return stories.filter(s => s.id !== selected?.id && !selected?.dependencies.includes(s.storyId));
    const q = depInput.toLowerCase();
    return stories.filter(s =>
      s.id !== selected?.id &&
      !selected?.dependencies.includes(s.storyId) &&
      (s.storyId.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
    );
  }, [depInput, stories, selected]);

  const scrollToStory = (storyId: string) => {
    const story = stories.find(s => s.storyId === storyId);
    if (story) {
      setSelectedId(story.id);
      storyRefs.current[story.id]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-8 py-3 flex items-center justify-between">
        <ViewEditToggle isEditMode={isEditMode} onToggle={setIsEditMode} />
      </div>

      <div className="p-6 overflow-hidden flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="h-4.5 w-4.5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">User Stories</h2>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium ml-1">
            {stories.length}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Functional requirements extracted from the TO-BE process design.</p>

        <div className="flex flex-1 gap-0 rounded-lg overflow-hidden min-h-0 border border-border shadow-sm h-0">
          {/* LEFT PANEL — Story list */}
          <div className="w-72 shrink-0 border-r border-border bg-card flex flex-col min-h-0">
            <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Stories</p>
              {isEditMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-primary"
                  onClick={addStory}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {/* Search bar */}
            <div className="px-2 pt-2 pb-1 shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search stories..."
                  className="text-xs h-8 pl-8 pr-2 bg-muted/30 border-border"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 px-0.5">
                {filteredStories.length} of {stories.length} stories
              </p>
            </div>

            <ScrollArea className="flex-1">
              {filteredStories.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-xs text-muted-foreground/70 italic">No stories match your search.</p>
                </div>
              ) : (
                <div className="p-1.5 space-y-0.5">
                  {filteredStories.map((story) => {
                    const depBadge = getDependencyBadgeText(story.dependencies);
                    return (
                      <button
                        key={story.id}
                        ref={el => { storyRefs.current[story.id] = el; }}
                        onClick={() => setSelectedId(story.id)}
                        className={cn(
                          "w-full text-left rounded-md px-3 py-2.5 transition-all duration-150 group",
                          selectedId === story.id
                            ? "bg-primary/[0.06] border-l-[3px] border-l-primary shadow-[inset_0_0_0_0.5px_hsl(var(--primary)/0.12)]"
                            : "hover:bg-muted/60 border-l-[3px] border-l-transparent"
                        )}
                      >
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={cn(
                            "text-[11px] font-bold tracking-wide",
                            selectedId === story.id ? "text-primary" : "text-muted-foreground"
                          )}>
                            <HighlightText text={story.storyId} query={searchQuery} />
                          </span>
                          {story.role && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-[9px] px-1.5 py-0 font-medium border",
                                selectedId === story.id
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : "border-transparent"
                              )}
                            >
                              {story.role}
                            </Badge>
                          )}
                          {depBadge && (
                            <Badge
                              variant="outline"
                              className="text-[9px] px-1.5 py-0 font-medium bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800 cursor-pointer"
                              onClick={e => {
                                e.stopPropagation();
                                scrollToStory(story.dependencies[0]);
                              }}
                            >
                              {depBadge}
                            </Badge>
                          )}
                        </div>
                        <p className={cn(
                          "text-[13px] mt-1 line-clamp-2 leading-snug",
                          selectedId === story.id ? "text-foreground font-medium" : "text-muted-foreground"
                        )}>
                          <HighlightText text={getStoryTitle(story.description) || "New User Story..."} query={searchQuery} />
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* RIGHT PANEL — Story detail */}
          {selected && (
            <ScrollArea className="flex-1 bg-card">
              <div className="p-6 space-y-7">
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-bold text-primary bg-primary/[0.08] px-2 py-0.5 rounded">
                          {selected.storyId}
                        </span>
                        {!isEditMode && selected.role && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 border border-border">
                            {selected.role}
                          </Badge>
                        )}
                        {/* Blocked badge in detail header */}
                        {selected.dependencies.length > 0 && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-2 py-0.5 font-medium bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800 cursor-pointer gap-1"
                            onClick={() => scrollToStory(selected.dependencies[0])}
                          >
                            <AlertTriangle className="h-3 w-3" />
                            {getDependencyBadgeText(selected.dependencies)}
                          </Badge>
                        )}
                      </div>
                      {isEditMode ? (
                        <div className="space-y-2">
                          <Input
                            value={selected.role}
                            onChange={e => updateStory(selected.id, "role", e.target.value)}
                            placeholder="Role (e.g. Requester)"
                            className="text-sm h-8 max-w-[200px]"
                          />
                          <Textarea
                            value={selected.description}
                            onChange={e => updateStory(selected.id, "description", e.target.value)}
                            placeholder='As a [role], I want to [action] so that [benefit]...'
                            className="text-sm min-h-[60px]"
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-foreground leading-relaxed">
                          <HighlightText text={selected.description} query={searchQuery} />
                        </p>
                      )}
                    </div>
                    {isEditMode && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeStory(selected.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* Acceptance Criteria */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acceptance Criteria</h4>
                    </div>
                    {isEditMode && (
                      <Button variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => addCriterion(selected.id)}>
                        <Plus className="h-3 w-3" /> Add
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2.5">
                    {selected.criteria.map((c, i) => (
                      <div key={i} className="relative">
                        {isEditMode ? (
                          <div className="border border-border rounded-lg p-3.5 space-y-2 bg-muted/30">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold text-muted-foreground uppercase w-12 shrink-0">Given</span>
                              <Input value={c.given} onChange={e => updateCriterion(selected.id, i, "given", e.target.value)} placeholder="pre-condition..." className="text-sm h-8 flex-1" />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold text-muted-foreground uppercase w-12 shrink-0">When</span>
                              <Input value={c.when} onChange={e => updateCriterion(selected.id, i, "when", e.target.value)} placeholder="user does something..." className="text-sm h-8 flex-1" />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold text-muted-foreground uppercase w-12 shrink-0">Then</span>
                              <Input value={c.then} onChange={e => updateCriterion(selected.id, i, "then", e.target.value)} placeholder="something happens..." className="text-sm h-8 flex-1" />
                            </div>
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeCriterion(selected.id, i)}>
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <div className="rounded-lg bg-muted/40 px-4 py-3 text-sm text-foreground leading-relaxed">
                            <span className="text-muted-foreground font-semibold text-[11px] uppercase">Given </span>
                            <HighlightText text={c.given} query={searchQuery} />,{" "}
                            <span className="text-muted-foreground font-semibold text-[11px] uppercase">when </span>
                            <HighlightText text={c.when} query={searchQuery} />,{" "}
                            <span className="text-muted-foreground font-semibold text-[11px] uppercase">then </span>
                            <HighlightText text={c.then} query={searchQuery} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Rules */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Business Rules</h4>
                    </div>
                    {isEditMode && (
                      <Button variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => addRule(selected.id)}>
                        <Plus className="h-3 w-3" /> Add
                      </Button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {selected.rules.map((r, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="text-primary/60 mt-0.5 text-sm select-none">▸</span>
                        {isEditMode ? (
                          <>
                            <Input value={r} onChange={e => updateRule(selected.id, i, e.target.value)} placeholder="Rule..." className="text-sm h-8 flex-1" />
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeRule(selected.id, i)}>
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-sm text-foreground leading-relaxed">
                            <HighlightText text={r} query={searchQuery} />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dependencies — Structured tag selector */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dependencies</h4>
                    </div>
                  </div>

                  {/* Existing tags */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {selected.dependencies.length === 0 && !isEditMode && (
                      <span className="text-sm text-muted-foreground/60 italic">None</span>
                    )}
                    {selected.dependencies.map((dep, i) => {
                      const depStory = stories.find(s => s.storyId === dep);
                      return (
                        <Badge
                          key={i}
                          variant="outline"
                          className={cn(
                            "text-xs font-medium px-2.5 py-1 gap-1.5 bg-amber-50/80 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
                            depStory && "cursor-pointer"
                          )}
                          onClick={() => depStory && scrollToStory(dep)}
                        >
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          Blocked by {dep}
                          {depStory && <span className="text-amber-600/70 dark:text-amber-500/70 truncate max-w-[120px]">— {getStoryTitle(depStory.description)}</span>}
                          {isEditMode && (
                            <button
                              onClick={e => { e.stopPropagation(); removeDependencyTag(selected.id, dep); }}
                              className="ml-0.5 hover:text-destructive transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </Badge>
                      );
                    })}
                  </div>

                  {/* Autocomplete input (edit mode only) */}
                  {isEditMode && (
                    <div className="relative max-w-sm">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          ref={depInputRef}
                          value={depInput}
                          onChange={e => { setDepInput(e.target.value); setShowDepDropdown(true); }}
                          onFocus={() => setShowDepDropdown(true)}
                          onBlur={() => setTimeout(() => setShowDepDropdown(false), 200)}
                          onKeyDown={e => {
                            if (e.key === "Enter" && depInput.trim()) {
                              e.preventDefault();
                              addDependencyTag(selected.id, depInput);
                            }
                          }}
                          placeholder="Type story ID or title..."
                          className="text-xs h-8 pl-8 pr-2 bg-muted/30 border-border"
                        />
                      </div>
                      {showDepDropdown && depSuggestions.length > 0 && (
                        <div className="absolute z-20 top-full mt-1 w-full bg-popover border border-border rounded-md shadow-md max-h-40 overflow-auto">
                          {depSuggestions.map(s => (
                            <button
                              key={s.id}
                              className="w-full text-left px-3 py-2 hover:bg-muted/60 transition-colors flex items-center gap-2"
                              onMouseDown={e => {
                                e.preventDefault();
                                addDependencyTag(selected.id, s.storyId);
                              }}
                            >
                              <span className="text-[11px] font-bold text-primary shrink-0">{s.storyId}</span>
                              <span className="text-xs text-muted-foreground truncate">{getStoryTitle(s.description)}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}
