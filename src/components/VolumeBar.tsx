import { MUSCLE_GROUPS } from "@/types/training";

interface VolumeBarProps {
  data: Record<string, number>;
  numDays?: number;
}

export const VolumeBar = ({ data, numDays }: VolumeBarProps) => {
  // Family definitions: match common groups into families (case-insensitive)
  const FAMILY_DEFINITIONS: { key: string; label: string; matcher: RegExp }[] = [
    { key: "PETTORALI", label: "PETTORALI", matcher: /PETTORALE|PETTORALI/i },
    { key: "DELTOIDI", label: "DELTOIDI", matcher: /DELTOID/i },
    { key: "BICIPITI", label: "BICIPITI", matcher: /BICIPIT/i },
    { key: "DORSO", label: "DORSO", matcher: /DORSO|GRAN DORSALE|CENTRO SCHIENA/i },
    { key: "TRICIPITI", label: "TRICIPITI", matcher: /TRICIPIT/i },
    { key: "FEMORALI", label: "FEMORALI", matcher: /FEMORAL|FEMORALI/i },
    { key: "QUADRICIPITI", label: "QUADRICIPITI", matcher: /QUADRICIPIT/i },
    { key: "GLUTEI", label: "GLUTEI", matcher: /GLUTEO|GLUTEI|GLUTE/i },
  ];

  // Collect groups with volume > 0
  const childGroups = MUSCLE_GROUPS.map((g) => ({ ...g, volume: data[g.name] ?? 0 })).filter((g) => g.volume > 0);
  if (childGroups.length === 0) return null;

  // Bucket into families
  const familyMap: Record<string, { label: string; children: { name: string; color: string; volume: number }[]; total: number }> = {};
  for (const child of childGroups) {
    const match = FAMILY_DEFINITIONS.find((f) => f.matcher.test(child.name));
    const key = match ? match.key : child.name; // fallback to own name
    const label = match ? match.label : child.name;
    if (!familyMap[key]) familyMap[key] = { label, children: [], total: 0 };
    familyMap[key].children.push({ name: child.name, color: child.color, volume: child.volume });
    familyMap[key].total += child.volume;
  }

  const usedFamilies = Object.values(familyMap).filter((f) => f.total > 0).sort((a, b) => a.total - b.total);
  if (usedFamilies.length === 0) return null;

  // shared max across all families (single axis)
  const maxVolume = Math.max(...usedFamilies.map((f) => f.total));

  const shortLabel = (full: string) => {
    if (!full) return full;
    // remove leading token (often family) and return the rest, strip parentheses
    const cleaned = full.replace(/[()]/g, "").trim();
    const parts = cleaned.split(/\s+/);
    if (parts.length <= 1) return cleaned.toUpperCase();
    const tail = parts.slice(1).join(' ');
    const t = tail.toUpperCase();
    return t.length > 18 ? t.slice(0, 15) + '…' : t;
  };

  const segmentDisplayName = (familyLabel: string, full: string) => {
    if (!full) return full;
    const u = full.toUpperCase();
    if (familyLabel === 'GLUTEI') {
      if (/PICCOL/i.test(u)) return 'PICCOLO';
      if (/MEDIO/i.test(u)) return 'MEDIO';
      if (/GRANDE|GRAN\b|MAGN/i.test(u)) return 'GRANDE';
      // fallback: try last word
      const parts = u.replace(/[()]/g, '').split(/\s+/);
      return parts[parts.length - 1].slice(0, 12);
    }
    // For other families, use shortLabel
    return shortLabel(full);
  };

  const containerStyle: React.CSSProperties = {};
  if (numDays && numDays > 0) {
    // match approx width of day columns (min 300px each in TrainingGrid)
    containerStyle.width = `${numDays * 300}px`;
  }

  return (
    <div className="bg-card border border-gray-400 rounded-lg px-2 py-2 max-w-full" style={containerStyle}>
      <h3 className="text-foreground font-bold text-lg mb-4">VOLUME PER DISTRETTO MUSCOLARE</h3>
      <div className="w-full overflow-x-auto">
        <div className="relative" style={{ minHeight: 320 }}>
          {/* baseline */}
          <div className="absolute left-0 right-0" style={{ bottom: 72 }}>
            <div className="h-px bg-muted-foreground/30 w-full" />
          </div>

          <div className="flex items-end space-x-6 px-2" style={{ height: 240 }}>
            {usedFamilies.map((family) => (
              <div key={family.label} className="flex flex-col items-center" style={{ width: 110, height: 240 }}>
                <div className="relative w-full h-full rounded-sm overflow-hidden">
                  {/* stacked segments */}
                  {(() => {
                    let cum = 0;
                    return family.children.map((child, idx) => {
                      const hPercent = maxVolume > 0 ? (child.volume / maxVolume) * 100 : 0;
                      const bottomPercent = (cum / maxVolume) * 100;
                      cum += child.volume;
                      return (
                        <div
                          key={child.name}
                          className="absolute left-0 w-full transition-all duration-500 ease-out"
                          style={{
                            bottom: `${bottomPercent}%`,
                            height: `${hPercent}%`,
                            backgroundColor: `hsl(var(--${child.color}))`,
                            borderTop: idx === 0 ? undefined : '2px solid rgba(0,0,0,0.45)'
                          }}
                          title={`${child.name}: ${child.volume} ex`}
                        />
                      );
                    });
                  })()}

                  {/* value centered at bottom */}
                  <div className="absolute bottom-0 left-0 w-full flex items-end justify-center pb-1">
                    <span className="text-sm font-bold text-background mix-blend-difference">{family.total}</span>
                  </div>

                  {/* compact legend inside bar for multi-segment families */}
                  {family.children.length > 1 && (
                    <div className="absolute top-1 right-1 text-[10px] text-foreground max-h-36 overflow-auto space-y-1" style={{ maxWidth: 180 }}>
                      {family.children.map((c) => (
                        <div key={c.name} className="flex items-center gap-2 whitespace-nowrap">
                          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: `hsl(var(--${c.color}))` }} />
                          <span className="font-semibold truncate" style={{ maxWidth: 110 }}>{segmentDisplayName(family.label, c.name)}</span>
                          <span className="font-mono text-muted-foreground">{c.volume}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3 text-center text-xs font-semibold text-foreground leading-tight">
                  <span className="block" title={family.label}>{family.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
