import { Card, CardTitle } from "@/components/ui/card";

type ActivityItem = {
  date: string;
  count: number;
};

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function levelClass(level: number) {
  if (level === 0) return "bg-neutral-900";
  if (level === 1) return "bg-neutral-700";
  if (level === 2) return "bg-neutral-500";
  if (level === 3) return "bg-neutral-300";
  return "bg-white";
}

export function ActivityHeatmap({ activities }: { activities: ActivityItem[] }) {
  const byDay = new Map<string, number>();
  for (const item of activities) {
    byDay.set(item.date, (byDay.get(item.date) ?? 0) + item.count);
  }

  const today = new Date();
  const days = Array.from({ length: 84 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (83 - index));
    const key = dateKey(date);
    const count = byDay.get(key) ?? 0;
    return { key, count };
  });

  const maxCount = Math.max(...days.map((day) => day.count), 0);

  return (
    <Card className="p-5">
      <CardTitle className="mb-3">Learning Activity (Last 12 Weeks)</CardTitle>
      <div className="grid grid-cols-12 gap-1">
        {days.map((day) => {
          const intensity = maxCount ? Math.ceil((day.count / maxCount) * 4) : 0;
          return (
            <div
              key={day.key}
              className={`h-5 rounded-sm ${levelClass(intensity)}`}
              title={`${day.key}: ${day.count} activity events`}
            />
          );
        })}
      </div>
    </Card>
  );
}
