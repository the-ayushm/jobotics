"use client"; // <--- This MUST be at the very top

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Export the component as UserLoginForm (named export)
export function UserLoginForm({ // Renamed from LoginForm for clarity for User specific login
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      role : "user"
    });

    setIsLoading(false);

    if (result?.error) {
      setError(result.error);
      console.error("Credentials Login Error:", result.error);
    } else if (result?.ok) {
      router.push("/dashboard/user"); // Redirect regular users to their dashboard
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/dashboard/user" });
    setIsLoading(false);
  };

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    await signIn("github", { callbackUrl: "/dashboard/user" });
    setIsLoading(false);
  };

  return (
    <Card className={cn("w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md", className)} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-gray-900 dark:text-white">Welcome back - User</CardTitle>
        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
          Login with your social account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Social Login Buttons */}
        <div className="space-y-3 mb-5">
          <Button
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
            onClick={handleGitHubSignIn}
            disabled={isLoading}
          >
            {/* GitHub Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
              <path
                d="M20.447 20.452h-3.554v-5.569c0-1.328-.025-3.037-1.852-3.037-1.853 0-2.137 1.447-2.137 2.94v5.666H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.369-1.852 3.6 0 4.267 2.368 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.06-2.06 2.062 2.062 0 012.06-2.06 2.062 2.062 0 012.06 2.06 2.062 2.062 0 01-2.06 2.06zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .77 0 1.723v20.549C0 23.23.792 24 1.771 24h20.451C23.208 24 24 23.23 24 22.271V1.723C24 .77 23.208 0 22.225 0z"
                fill="currentColor"
              />
            </svg>
            Login with Github
          </Button>
          <Button
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {/* Google Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Login with Google
          </Button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-1">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="mb-1">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In with Email"}
          </Button>
        </form> 

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/auth/user/signup" className="underline">
            Sign up
          </Link>
        </p>

         <div className="mt-4 text-center">
          <Button
            variant="ghost" // Use a ghost variant so it doesn't stand out as much as primary login buttons
            onClick={() => router.push("/auth/hr/signin")}
            disabled={isLoading}
            className="w-full text-blue-500 hover:underline cursor-pointer"
  
          >
            Are you an HR? Sign in here.
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}