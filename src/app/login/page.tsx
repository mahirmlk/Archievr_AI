"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
    OAuthAccountNotLinked: "This email is already linked to another provider.",
    Configuration: "Auth configuration error.",
    AccessDenied: "Access was denied by the auth provider.",
    Verification: "Verification failed. Try signing in again.",
    Default: "Sign in failed. Please try again.",
  };
  return map[error] ?? map.Default;
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const error = searchParams.get("error");
  const errorText = useMemo(() => authErrorMessage(error), [error]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await getProviders();
      if (!mounted) return;
      const list = Object.values(data ?? {})
        .filter((provider) => provider.id !== "email" && provider.id !== "credentials")
        .map((provider) => ({ id: provider.id, name: provider.name }))
        .sort((a, b) => {
          if (a.id === "google") return -1;
          if (b.id === "google") return 1;
          return a.name.localeCompare(b.name);
        });
      setProviders(list);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
      <section className="space-y-6">
        <Badge className="inline-flex items-center gap-2 font-mono text-xs text-neutral-400">
          <LockKeyhole className="size-3.5 text-neutral-400" />
          /Secure
        </Badge>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Welcome back to Archievr AI</h1>
          <p className="max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
            Continue your AI and ML roadmap with personalized progress, resources, and analytics.
          </p>
        </div>
        <div className="grid gap-2 text-sm text-neutral-400">
          <p className="inline-flex items-center gap-2">
            <CheckCircle2 className="size-4 text-neutral-300" />
            Personalized roadmap phases and topics
          </p>
          <p className="inline-flex items-center gap-2">
            <CheckCircle2 className="size-4 text-neutral-300" />
            Saved resources and learning notes
          </p>
          <p className="inline-flex items-center gap-2">
            <CheckCircle2 className="size-4 text-neutral-300" />
            Progress tracking and completion insights
          </p>
        </div>
      </section>

      <Card className="relative w-full max-w-md space-y-6 overflow-hidden p-8 md:ml-auto">
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
          <div className="mx-auto w-fit rounded-full border border-neutral-800 bg-neutral-900 p-3 text-neutral-400">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <CardTitle>Sign In</CardTitle>
          <p className="text-sm text-neutral-400">Track progress and customize your machine learning roadmap.</p>
        </div>

        {errorText && (
          <p className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">
            {errorText}
          </p>
        )}

        <div className="relative space-y-3">
          {loading ? (
            <Button className="w-full" disabled>
              Loading providers...
            </Button>
          ) : providers.length === 0 ? (
            <p className="rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-sm text-neutral-400">
              No OAuth providers are configured. Set GitHub/Google credentials in environment variables.
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
                <ArrowRight className="ml-2 h-4 w-4 text-neutral-400" />
              </Button>
            ))
          )}
        </div>
        <div className="relative text-center">
          <Link href="/" className="text-xs text-neutral-400 transition-colors hover:text-white">
            Return to home
          </Link>
        </div>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-neutral-950" />}>
      <LoginPageContent />
    </Suspense>
  );
}
