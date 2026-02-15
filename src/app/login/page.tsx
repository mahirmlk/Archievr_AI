"use client";

import Link from "next/link";
import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, BrainCircuit, CheckCircle2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

function authErrorMessage(error?: string | null) {
  if (!error) return null;
  const map: Record<string, string> = {
    Configuration: "Auth configuration error.",
    AccessDenied: "Access was denied.",
    Verification: "Verification failed. Try signing in again.",
    Default: "Sign in failed. Please try again.",
  };
  return map[error] ?? map.Default;
}

function LoginPageContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const error = searchParams.get("error");
  const errorText = useMemo(() => authErrorMessage(error), [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSignupError(null);

    try {
      if (isSignUp) {
        // Handle signup
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        const data = await response.json();

        if (!response.ok) {
          setSignupError(data.error || "Signup failed");
          setLoading(false);
          return;
        }

        // After successful signup, sign in automatically
        const result = await signIn("credentials", {
          email,
          password,
          callbackUrl: "/dashboard",
          redirect: true,
        });

        if (result?.error) {
          console.error("Auto sign-in error:", result.error);
        }
      } else {
        // Handle login
        const result = await signIn("credentials", {
          email,
          password,
          callbackUrl: "/dashboard",
          redirect: true,
        });

        if (result?.error) {
          console.error("Sign in error:", result.error);
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setSignupError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

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
          <CardTitle>{isSignUp ? "Create Account" : "Sign In"}</CardTitle>
          <p className="text-sm text-neutral-400">
            {isSignUp
              ? "Join Archievr AI to start your machine learning journey."
              : "Track progress and customize your machine learning roadmap."}
          </p>
        </div>

        {(errorText || signupError) && (
          <p className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-200">
            {signupError || errorText}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (isSignUp ? "Creating account..." : "Signing in...") : (isSignUp ? "Create Account" : "Sign in")}
            <ArrowRight className="ml-2 h-4 w-4 text-neutral-400" />
          </Button>
        </form>
        <div className="relative text-center space-y-2">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setSignupError(null);
            }}
            className="text-sm text-neutral-400 transition-colors hover:text-white"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
          <div>
            <Link href="/" className="text-xs text-neutral-400 transition-colors hover:text-white">
              Return to home
            </Link>
          </div>
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
