import { Card } from "@/components/ui/card";

const vars = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "GITHUB_ID",
  "GITHUB_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "BLOB_READ_WRITE_TOKEN",
];

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Settings</h2>
      <Card className="space-y-2">
        <p className="font-medium">Runtime Environment Checklist</p>
        <ul className="list-inside list-disc space-y-1 text-sm text-[var(--muted)]">
          {vars.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <p className="font-medium">Deployment</p>
        <p className="text-sm text-[var(--muted)]">
          Deploy to Vercel with PostgreSQL. Configure environment variables in the Vercel dashboard.
        </p>
      </Card>
    </div>
  );
}
