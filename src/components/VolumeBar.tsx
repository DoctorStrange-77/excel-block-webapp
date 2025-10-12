import { MUSCLE_GROUPS } from "@/types/training";

interface VolumeBarProps {
  data: Record<string, number>;
}

export const VolumeBar = ({ data }: VolumeBarProps) => {
  const maxVolume = Math.max(...Object.values(data), 100);

  return (
    <div className="bg-card border border-border rounded-sm p-4 h-full">
      <h3 className="text-foreground font-bold text-sm mb-4">VOLUME</h3>
      <div className="space-y-2">
        {MUSCLE_GROUPS.map((group) => {
          const volume = data[group.name] || 0;
          const percentage = (volume / maxVolume) * 100;

          return (
            <div key={group.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground font-medium">{group.name}</span>
                <span className="text-muted-foreground">{volume}%</span>
              </div>
              <div className="h-6 bg-secondary rounded-sm overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: `hsl(var(--${group.color}))`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
