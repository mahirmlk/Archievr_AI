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
      <h2 className="text-3xl font-bold tracking-tight text-white">Settings</h2>
      <Card className="space-y-3 p-5">
        <p className="font-semibold text-zinc-100">Runtime Environment Checklist</p>
        <ul className="list-inside list-disc space-y-1 text-sm text-neutral-400">
          {vars.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      </Card>
      <Card className="space-y-2 p-5">
        <p className="font-semibold text-zinc-100">Deployment</p>
        <p className="text-sm text-neutral-400">
          Deploy to Vercel with PostgreSQL. Configure environment variables in the Vercel dashboard.
        </p>
      </Card>
    </div>
  );
}
