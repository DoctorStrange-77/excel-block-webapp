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
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg px-6 py-6 max-w-full shadow-lg" style={containerStyle}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-foreground font-black text-2xl tracking-tight">VOLUME PER DISTRETTO MUSCOLARE</h3>
        <div className="text-sm text-muted-foreground font-medium">
          Totale esercizi: <span className="text-primary font-bold">{Object.values(data).reduce((a, b) => a + b, 0)}</span>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="relative bg-background/30 rounded-md p-4" style={{ minHeight: 360 }}>
          {/* Grid di riferimento orizzontale */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <div 
              key={percent}
              className="absolute left-0 right-0 border-t border-muted-foreground/10"
              style={{ bottom: `${72 + (240 * percent / 100)}px` }}
            >
              <span className="absolute -left-8 -top-2 text-xs text-muted-foreground/60 font-mono">
                {Math.round((maxVolume * percent) / 100)}
              </span>
            </div>
          ))}

          <div className="flex items-end justify-around space-x-4 px-2" style={{ height: 240 }}>
            {usedFamilies.map((family) => (
              <div key={family.label} className="flex flex-col items-center group" style={{ width: 120, height: 240 }}>
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-border/50">
                  {/* stacked segments con gradiente */}
                  {(() => {
                    let cum = 0;
                    return family.children.map((child, idx) => {
                      const hPercent = maxVolume > 0 ? (child.volume / maxVolume) * 100 : 0;
                      const bottomPercent = (cum / maxVolume) * 100;
                      cum += child.volume;
                      return (
                        <div
                          key={child.name}
                          className="absolute left-0 w-full transition-all duration-500 ease-out hover:brightness-110"
                          style={{
                            bottom: `${bottomPercent}%`,
                            height: `${hPercent}%`,
                            background: `linear-gradient(180deg, hsl(var(--${child.color})) 0%, hsl(var(--${child.color}) / 0.85) 100%)`,
                            borderTop: idx === 0 ? undefined : '1px solid rgba(0,0,0,0.3)',
                            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1)'
                          }}
                          title={`${child.name}: ${child.volume} ex`}
                        />
                      );
                    });
                  })()}

                  {/* Badge con valore in basso */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    <div className="bg-background/90 backdrop-blur-sm text-primary font-black text-lg px-3 py-1 rounded-full border-2 border-primary/50 shadow-lg">
                      {family.total}
                    </div>
                  </div>

                  {/* Legenda migliorata per famiglie multi-segmento */}
                  {family.children.length > 1 && (
                    <div className="absolute top-2 right-2 bg-background/95 backdrop-blur-sm rounded-md p-2 text-[9px] max-h-32 overflow-auto shadow-md border border-border/50" style={{ maxWidth: 160 }}>
                      {family.children.map((c) => (
                        <div key={c.name} className="flex items-center gap-1.5 mb-1 last:mb-0">
                          <span 
                            className="inline-block w-2.5 h-2.5 rounded-full shadow-sm" 
                            style={{ backgroundColor: `hsl(var(--${c.color}))` }} 
                          />
                          <span className="font-bold truncate text-foreground" style={{ maxWidth: 90 }}>
                            {segmentDisplayName(family.label, c.name)}
                          </span>
                          <span className="font-mono text-muted-foreground ml-auto">{c.volume}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Etichetta famiglia */}
                <div className="mt-4 text-center">
                  <span 
                    className="block text-xs font-black text-foreground/90 leading-tight tracking-wide px-2 py-1 rounded-md bg-background/50 group-hover:bg-primary/10 transition-colors" 
                    title={family.label}
                  >
                    {family.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
