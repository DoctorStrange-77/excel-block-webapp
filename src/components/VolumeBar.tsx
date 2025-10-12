import { MUSCLE_GROUPS } from "@/types/training";

interface VolumeBarProps {
  data: Record<string, number>;
}

export const VolumeBar = ({ data }: VolumeBarProps) => {
  // Filtra solo i gruppi muscolari che sono stati effettivamente usati
  const usedMuscleGroups = MUSCLE_GROUPS.filter((group) => data[group.name] > 0);
  
  if (usedMuscleGroups.length === 0) return null;

  const maxVolume = Math.max(...Object.values(data));

  return (
    <div className="bg-card border border-border rounded-sm p-6">
      <h3 className="text-foreground font-bold text-lg mb-6">VOLUME PER DISTRETTO MUSCOLARE</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {usedMuscleGroups.map((group) => {
          const volume = data[group.name];
          const percentage = (volume / maxVolume) * 100;

          return (
            <div key={group.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-foreground font-semibold text-sm">{group.name}</span>
                <span className="text-muted-foreground font-mono text-xs">{volume} ex</span>
              </div>
              <div className="relative h-32 bg-secondary rounded-sm overflow-hidden">
                <div
                  className="absolute bottom-0 w-full transition-all duration-500 ease-out"
                  style={{ 
                    height: `${percentage}%`,
                    backgroundColor: `hsl(var(--${group.color}))`
                  }}
                />
                <div className="absolute inset-0 flex items-end justify-center pb-2">
                  <span className="text-2xl font-bold text-background mix-blend-difference">
                    {volume}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
