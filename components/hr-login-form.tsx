"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: true, // Let NextAuth handle the redirect
      email,
      password,
      role: "hr",
      callbackUrl: "/dashboard/hr", // Corrected path for HR dashboard
    });

    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
      console.error("HR Login Error:", result.error);
    }
    // No `router.push` here, NextAuth.js handles it.
  };

  return (
    <div className={cn("flex flex-col gap-6 bg-background text-foreground min-h-screen items-center justify-center py-10", className)} {...props}>
      <Card className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground shadow-md rounded-lg border border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back-HR</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline text-primary"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-destructive text-sm text-center">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/auth/hr/signup" className="underline underline-offset-4 text-primary">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => router.push("/auth/user/signin")}
              disabled={isLoading}
              className="w-full text-secondary-foreground hover:underline"
            >
              Are you a Candidate? Sign in here.
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <Link href="#" className="text-primary hover:underline">Terms of Service</Link>{" "}
        and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
      </div>
    </div>
  );
}