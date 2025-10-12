import { MUSCLE_GROUPS } from "@/types/training";

interface VolumeBarProps {
  data: Record<string, number>;
  numDays?: number;
}

export const VolumeBar = ({ data, numDays }: VolumeBarProps) => {
  // Filtra solo i gruppi muscolari che sono stati effettivamente usati
  // Ordina in modo ascendente per volume in modo che le barre vadano da sinistra (min) a destra (max)
  const usedMuscleGroups = MUSCLE_GROUPS
    .filter((group) => (data[group.name] ?? 0) > 0)
    .sort((a, b) => (data[a.name] ?? 0) - (data[b.name] ?? 0));
  
  if (usedMuscleGroups.length === 0) return null;

  const maxVolume = Math.max(...Object.values(data));

  const containerStyle: React.CSSProperties = {};
  if (numDays && numDays > 0) {
    // match approx width of day columns (min 300px each in TrainingGrid)
    containerStyle.width = `${numDays * 300}px`;
  }

  return (
    <div className="bg-card border border-gray-400 rounded-lg px-2 py-2 max-w-full" style={containerStyle}>
      <h3 className="text-foreground font-bold text-lg mb-4">VOLUME PER DISTRETTO MUSCOLARE</h3>

      <div className="flex items-center justify-between mb-2">
        <div />
        <div className="text-muted-foreground font-mono text-xs">Max: {maxVolume} ex</div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="relative" style={{ minHeight: 260 }}>
          {/* baseline / x-axis */}
          <div className="absolute left-0 right-0" style={{ bottom: 56 }}>
            <div className="h-px bg-muted-foreground/30 w-full" />
          </div>

          {/* bars container: fixed height for consistent baseline alignment */}
          <div className="flex items-end space-x-6 px-2" style={{ height: 200 }}>
            {usedMuscleGroups.map((group) => {
              const volume = data[group.name] ?? 0;
              const percentage = maxVolume > 0 ? (volume / maxVolume) * 100 : 0;

              return (
                <div key={group.name} className="flex flex-col items-center" style={{ width: 96, height: 200 }}>
                  <div className="relative w-full h-full">
                    <div
                      className="absolute bottom-0 left-0 w-full transition-all duration-500 ease-out rounded-sm"
                      style={{
                        height: `${percentage}%`,
                        backgroundColor: `hsl(var(--${group.color}))`
                      }}
                    />

                    <div className="absolute bottom-0 left-0 w-full flex items-end justify-center pb-1">
                      <span className="text-sm font-bold text-background mix-blend-difference">{volume}</span>
                    </div>
                  </div>

                  <div className="mt-3 text-center text-xs font-semibold text-foreground leading-tight">
                    <span className="block" title={group.name}>{group.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
