import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProcessEditFormProps {
  process: {
    name: string;
    area: string;
    description: string;
    executor: string;
    approver: string;
  };
  onSave: () => void;
}

const areas = ["Finance", "HR", "Operations", "IT", "Legal", "Marketing"];
const frequencies = ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly", "On Demand"];

export function ProcessEditForm({ process, onSave }: ProcessEditFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState({
    name: process.name,
    area: process.area,
    description: process.description,
    l1: "",
    l2: "",
    l3: "",
    l4: "",
    executor: process.executor,
    approver: process.approver,
    avgTime: "",
    frequency: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-1">Edit Process</h1>
        <p className="text-muted-foreground">Update process information and settings</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Required Fields */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="font-medium text-foreground mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Process Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter process name"
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="area">Area *</Label>
              <Select value={formData.area} onValueChange={(v) => updateField("area", v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe the process objectives and scope"
                className="mt-1.5 min-h-24"
                required
              />
            </div>
          </div>
        </div>

        {/* Advanced Fields */}
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
          >
            <span className="font-medium text-foreground">Advanced Settings</span>
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {showAdvanced && (
            <div className="p-6 pt-2 border-t border-border space-y-4">
              {/* Value Chain */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="l1">L1 Value Chain</Label>
                  <Input
                    id="l1"
                    value={formData.l1}
                    onChange={(e) => updateField("l1", e.target.value)}
                    placeholder="Level 1"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="l2">L2 Value Chain</Label>
                  <Input
                    id="l2"
                    value={formData.l2}
                    onChange={(e) => updateField("l2", e.target.value)}
                    placeholder="Level 2"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="l3">L3 Value Chain</Label>
                  <Input
                    id="l3"
                    value={formData.l3}
                    onChange={(e) => updateField("l3", e.target.value)}
                    placeholder="Level 3"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="l4">L4 Value Chain</Label>
                  <Input
                    id="l4"
                    value={formData.l4}
                    onChange={(e) => updateField("l4", e.target.value)}
                    placeholder="Level 4"
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Stakeholders */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="executor">Executor</Label>
                  <Input
                    id="executor"
                    value={formData.executor}
                    onChange={(e) => updateField("executor", e.target.value)}
                    placeholder="Role or team"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="approver">Approver</Label>
                  <Input
                    id="approver"
                    value={formData.approver}
                    onChange={(e) => updateField("approver", e.target.value)}
                    placeholder="Role or team"
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Time & Frequency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="avgTime">Average Execution Time</Label>
                  <Input
                    id="avgTime"
                    value={formData.avgTime}
                    onChange={(e) => updateField("avgTime", e.target.value)}
                    placeholder="e.g., 2 hours"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Execution Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(v) => updateField("frequency", v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((freq) => (
                        <SelectItem key={freq} value={freq}>
                          {freq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          <Button type="button" variant="corporate-outline" onClick={onSave}>
            Cancel
          </Button>
          <Button type="submit" variant="corporate">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
