import { Card, CardTitle } from "@/components/ui/card";

export function ActivityHeatmap() {
  const cells = Array.from({ length: 7 * 12 }, (_, i) => i % 5);
  return (
    <Card>
      <CardTitle className="mb-4">Weekly Activity Heatmap</CardTitle>
      <div className="grid grid-cols-12 gap-1">
        {cells.map((level, idx) => (
          <div
            key={idx}
            className="h-5 rounded-sm"
            style={{
              background:
                level === 0 ? "#e5e7eb" : level === 1 ? "#99f6e4" : level === 2 ? "#5eead4" : level === 3 ? "#2dd4bf" : "#0f766e",
            }}
          />
        ))}
      </div>
    </Card>
  );
}
