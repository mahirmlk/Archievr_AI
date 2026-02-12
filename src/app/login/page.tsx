"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import { ArrowRight, BrainCircuit, CheckCircle2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

type ProviderItem = { id: string; name: string };

function authErrorMessage(error?: string | null) {
  if (!error) return null;
  const map: Record<string, string> = {
    OAuthSignin: "OAuth sign-in could not be started.",
    OAuthCallback: "OAuth callback failed. Check your provider redirect URI.",
    OAuthCreateAccount: "Account creation from OAuth failed.",
    OAuthAccountNotLinked: "This email is already linked to another provider. Use the same provider or enable account linking.",
    Configuration: "Auth configuration error. Check NEXTAUTH_URL, NEXTAUTH_SECRET and provider credentials.",
    AccessDenied: "Access was denied by the auth provider.",
    Verification: "Verification failed. Try signing in again.",
    Default: "Sign in failed. Please try again.",
  };
  return map[error] ?? map.Default;
}

export default function LoginPage() {
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const errorText = useMemo(() => authErrorMessage(error), [error]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setError(searchParams.get("error"));
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await getProviders();
      if (!mounted) return;
      const list = Object.values(data ?? {})
        .filter((provider) => provider.id !== "email" && provider.id !== "credentials")
        .map((provider) => ({ id: provider.id, name: provider.name }));
      setProviders(list);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-5xl items-center gap-10 px-6 py-12 pb-28 md:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6">
        <Badge className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-wide">
          <LockKeyhole className="size-3.5" />
          Secure Access
        </Badge>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Welcome back to Archievr AI</h1>
          <p className="max-w-xl text-balance text-muted-foreground sm:text-lg">
            Continue building your AI/ML roadmap with your personalized progress, resources, and topic analytics.
          </p>
        </div>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <p className="inline-flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary" />
            Personalized roadmap phases and topics
          </p>
          <p className="inline-flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary" />
            Saved resources and learning notes
          </p>
          <p className="inline-flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary" />
            Progress tracking and completion insights
          </p>
        </div>
      </section>

      <Card className="relative w-full max-w-md space-y-6 overflow-hidden rounded-2xl p-8 md:ml-auto">
        <div className="pointer-events-none absolute inset-0 top-0 left-0 right-0 h-1/2 overflow-hidden">
          <FlickeringGrid
            className="h-full w-full"
            squareSize={2}
            gridGap={2}
            style={{
              maskImage: "linear-gradient(to bottom, black, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
            }}
          />
        </div>

        <div className="relative space-y-2 text-center">
          <div className="mx-auto w-fit rounded-full border bg-background p-3">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <CardTitle>Sign In</CardTitle>
          <p className="text-sm text-muted-foreground">Track progress and customize your AI/ML roadmap.</p>
        </div>

        {errorText && (
          <p className="rounded-lg border border-red-300/70 bg-red-50/80 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            {errorText}
          </p>
        )}

        <div className="relative space-y-3">
          {loading ? (
            <Button className="w-full" disabled>
              Loading providers...
            </Button>
          ) : providers.length === 0 ? (
            <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
              No OAuth providers are configured. Set GitHub/Google client ID and secret in environment variables.
            </p>
          ) : (
            providers.map((provider) => (
              <Button
                key={provider.id}
                className="w-full"
                variant="outline"
                onClick={() => signIn(provider.id, { callbackUrl: "/dashboard" })}
              >
                Continue with {provider.name}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ))
          )}
        </div>
        <div className="relative text-center">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
            Return to home
          </Link>
        </div>
      </Card>
    </main>
  );
}
