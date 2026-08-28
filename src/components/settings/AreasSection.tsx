import { useState, useMemo } from 'react';
import { Plus, Trash2, Pencil, Users, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettingsStore, Area, Position } from '@/stores/settingsStore';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

const colorPresets = [
  '#0C1BA8',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
];

interface AreaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  area?: Area | null;
}

function AreaDialog({ open, onOpenChange, area }: AreaDialogProps) {
  const { addArea, updateArea, settings } = useSettingsStore();
  const { t } = useLanguage();
  const [code, setCode] = useState(area?.code || '');
  const [name, setName] = useState(area?.name || '');
  const [description, setDescription] = useState(area?.description || '');
  const [color, setColor] = useState(area?.color || colorPresets[0]);

  const isEditing = !!area;

  const handleSave = () => {
    if (!code.trim() || code.length < 2 || code.length > 4) {
      toast.error(t.areasCodeLength);
      return;
    }
    if (!name.trim() || name.length < 3 || name.length > 50) {
      toast.error(t.areasNameLength);
      return;
    }
    
    const codeExists = settings.areas.some(
      (a) => a.code.toUpperCase() === code.toUpperCase() && a.id !== area?.id
    );
    if (codeExists) {
      toast.error(t.areasCodeExists);
      return;
    }

    if (isEditing) {
      updateArea(area.id, { code: code.toUpperCase(), name, description, color });
      toast.success(t.areasAreaUpdated);
    } else {
      addArea({ code: code.toUpperCase(), name, description, color });
      toast.success(t.areasAreaAdded);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? t.areasEditArea : t.areasAddArea}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="section-title block mb-2">{t.areasAreaCode}</label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ex: S2P"
              maxLength={4}
              className="uppercase"
            />
          </div>
          <div>
            <label className="section-title block mb-2">{t.areasAreaName}</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Source to Pay"
              maxLength={50}
            />
          </div>
          <div>
            <label className="section-title block mb-2">{t.areasDescription}</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Processo de compra até pagamento"
              rows={3}
            />
          </div>
          <div>
            <label className="section-title block mb-2">{t.areasIdentificationColor}</label>
            <div className="flex gap-2 flex-wrap">
              {colorPresets.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    color === c ? 'ring-2 ring-foreground ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.cancel}
          </Button>
          <Button variant="corporate" onClick={handleSave}>
            {t.save}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface PositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position?: Position | null;
  defaultAreaId?: string;
}

function PositionDialog({ open, onOpenChange, position, defaultAreaId }: PositionDialogProps) {
  const { addPosition, updatePosition, settings } = useSettingsStore();
  const { t } = useLanguage();
  const [name, setName] = useState(position?.name || '');
  const [description, setDescription] = useState(position?.description || '');
  const [areaId, setAreaId] = useState(position?.areaId || defaultAreaId || settings.areas[0]?.id || '');

  const isEditing = !!position;

  const handleSave = () => {
    if (!name.trim() || name.length < 2 || name.length > 50) {
      toast.error(t.positionsNameLength);
      return;
    }
    if (!areaId) {
      toast.error(t.positionsSelectAreaRequired);
      return;
    }

    if (isEditing) {
      updatePosition(position.id, { name, description, areaId });
      toast.success(t.positionsPositionUpdated);
    } else {
      addPosition({ name, description, areaId });
      toast.success(t.positionsPositionAdded);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? t.positionsEditPosition : t.positionsAddPosition}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="section-title block mb-2">{t.positionsPositionName} *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Analista Jr"
              maxLength={50}
            />
          </div>
          <div>
            <label className="section-title block mb-2">{t.positionsOptionalDescription}</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Responsável por análises iniciais"
              rows={2}
            />
          </div>
          <div>
            <label className="section-title block mb-2">{t.positionsArea} *</label>
            <Select value={areaId} onValueChange={setAreaId}>
              <SelectTrigger>
                <SelectValue placeholder={t.positionsSelectArea} />
              </SelectTrigger>
              <SelectContent>
                {settings.areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: area.color }}
                      />
                      {area.code} - {area.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.cancel}
          </Button>
          <Button variant="corporate" onClick={handleSave}>
            {t.save}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface PositionsListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  areaId?: string;
}

function PositionsListDialog({ open, onOpenChange, areaId }: PositionsListDialogProps) {
  const { settings, deletePosition, getPositionsByArea } = useSettingsStore();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [positionDialogOpen, setPositionDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [defaultAreaIdForPosition, setDefaultAreaIdForPosition] = useState<string>('');

  // Get the area for the title
  const selectedArea = areaId ? settings.areas.find(a => a.id === areaId) : null;

  const filteredPositions = useMemo(() => {
    // If areaId is provided, only show positions from that area
    let positions = areaId 
      ? getPositionsByArea(areaId)
      : (settings.positions || []);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      positions = positions.filter(p => 
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }
    
    return positions;
  }, [settings.positions, areaId, searchQuery, getPositionsByArea]);

  const handleAddPosition = () => {
    setSelectedPosition(null);
    setDefaultAreaIdForPosition(areaId || '');
    setPositionDialogOpen(true);
  };

  const handleEditPosition = (position: Position) => {
    setSelectedPosition(position);
    setDefaultAreaIdForPosition(position.areaId);
    setPositionDialogOpen(true);
  };

  const handleDeletePosition = (position: Position) => {
    deletePosition(position.id);
    toast.success(t.positionsPositionRemoved);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {selectedArea ? (
                <span className="flex items-center gap-2">
                  {t.positionsManage} - 
                  <span 
                    className="px-2 py-0.5 rounded text-sm font-medium"
                    style={{ backgroundColor: selectedArea.color + '20', color: selectedArea.color }}
                  >
                    {selectedArea.code}
                  </span>
                </span>
              ) : t.positionsManage}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col sm:flex-row gap-3 py-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.positionsSearch}
                className="pl-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button variant="corporate" onClick={handleAddPosition}>
              <Plus className="h-4 w-4 mr-1" />
              {t.positionsNewPosition}
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto min-h-0">
            {filteredPositions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{t.positionsNoPositionsFound}</p>
                <Button
                  variant="link"
                  onClick={handleAddPosition}
                  className="mt-2"
                >
                  {t.positionsAddPosition}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPositions.map((position) => {
                  const area = settings.areas.find((a) => a.id === position.areaId);
                  return (
                    <div
                      key={position.id}
                      className="flex items-center justify-between bg-muted/30 rounded-lg p-3 group hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {area && (
                          <Badge
                            variant="outline"
                            className="text-xs shrink-0"
                            style={{ borderColor: area.color, color: area.color }}
                          >
                            {area.code}
                          </Badge>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{position.name}</p>
                          {position.description && (
                            <p className="text-xs text-muted-foreground truncate">{position.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <button
                          onClick={() => handleEditPosition(position)}
                          className="text-muted-foreground hover:text-primary p-1.5 rounded hover:bg-background"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePosition(position)}
                          className="text-muted-foreground hover:text-destructive p-1.5 rounded hover:bg-background"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <PositionDialog
        open={positionDialogOpen}
        onOpenChange={setPositionDialogOpen}
        position={selectedPosition}
        defaultAreaId={defaultAreaIdForPosition}
      />
    </>
  );
}

export function AreasSection() {
  const { settings, deleteArea, getPositionsByArea } = useSettingsStore();
  const { t } = useLanguage();
  const [areaDialogOpen, setAreaDialogOpen] = useState(false);
  const [positionsListDialogOpen, setPositionsListDialogOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [selectedAreaIdForPositions, setSelectedAreaIdForPositions] = useState<string>('');

  const handleEditArea = (area: Area) => {
    setSelectedArea(area);
    setAreaDialogOpen(true);
  };

  const handleAddArea = () => {
    setSelectedArea(null);
    setAreaDialogOpen(true);
  };

  const handleDeleteArea = (area: Area) => {
    if (area.processCount > 0) {
      toast.error(`${area.processCount} ${t.areasProcessesUsingArea}`);
      return;
    }
    deleteArea(area.id);
    toast.success(t.areasAreaRemoved);
  };

  const handleOpenPositions = (areaId?: string) => {
    setSelectedAreaIdForPositions(areaId || '');
    setPositionsListDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Áreas Section */}
      <div>
        <div className="border-b border-border pb-4 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">{t.areasOrganizationalAreas}</h2>
          <p className="text-sm text-muted-foreground">
            {t.areasConfigureAreas}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settings.areas.map((area) => {
            const areaPositions = getPositionsByArea(area.id);
            
            return (
              <div
                key={area.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: area.color }}
                      />
                      <span className="font-semibold text-foreground">{area.code}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEditArea(area); }}
                        className="text-muted-foreground hover:text-primary p-1"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteArea(area); }}
                        className="text-muted-foreground hover:text-destructive p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{area.name}</p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-muted-foreground">{area.processCount} {t.areasProcesses}</p>
                    <button 
                      onClick={() => handleOpenPositions(area.id)}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Users className="h-3 w-3" />
                      {areaPositions.length} {t.areasPositions}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div
            onClick={handleAddArea}
            className="border-2 border-dashed border-border bg-muted/30 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-sidebar-accent transition-colors min-h-[120px]"
          >
            <Plus className="h-6 w-6 text-muted-foreground mb-1" />
            <span className="text-sm text-muted-foreground">{t.areasAddArea}</span>
          </div>
        </div>
      </div>

      <AreaDialog
        open={areaDialogOpen}
        onOpenChange={setAreaDialogOpen}
        area={selectedArea}
      />

      <PositionsListDialog
        open={positionsListDialogOpen}
        onOpenChange={setPositionsListDialogOpen}
        areaId={selectedAreaIdForPositions}
      />
    </div>
  );
}