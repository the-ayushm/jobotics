"use client"; // <-- ADD THIS LINE

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function SignUpForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(""); // Phone is optional for users based on schema
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleCredentialsSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/user/signup", { // API route for regular user signup
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, phone, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Something went wrong during signup.");
                console.error("Signup validation/server error:", data);
                return;
            }

            // After successful signup, attempt to auto-login
            const signInResult = await signIn("credentials", {
                redirect: false, // Handle redirect manually
                email,
                password,
            });

            if (signInResult?.error) {
                setError("Signup successful, but auto-login failed: " + signInResult.error + ". Please login manually.");
                router.push("/auth/user/signin"); // Redirect to login page if auto-login fails
            } else if (signInResult?.ok) {
                router.push("/dashboard/user"); // Redirect to user dashboard after successful signup & login
            }


        } catch (err: any) {
            console.error("Signup network error:", err);
            setError("Failed to connect to server. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialSignIn = async (provider: "google" | "github") => {
        setIsLoading(true);
        setError(null);
        // NextAuth will handle creating user in DB via adapter and then redirecting
        await signIn(provider, { callbackUrl: "/dashboard/user" });
        setIsLoading(false); // This might not be reached if redirect happens quickly
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create Your User Account</CardTitle>
                    <CardDescription>
                        Sign up with your Google or GitHub account, or use email and password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCredentialsSignUp}>
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => handleSocialSignIn("github")}
                                    disabled={isLoading}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                                        <path
                                            d="M20.447 20.452h-3.554v-5.569c0-1.328-.025-3.037-1.852-3.037-1.853 0-2.137 1.447-2.137 2.94v5.666H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.369-1.852 3.6 0 4.267 2.368 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.06-2.06 2.062 2.062 0 012.06-2.06 2.062 2.062 0 012.06 2.06 2.062 2.062 0 01-2.06 2.06zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .77 0 1.723v20.549C0 23.23.792 24 1.771 24h20.451C23.208 24 24 23.23 24 22.271V1.723C24 .77 23.208 0 22.225 0z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Sign Up with Github
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => handleSocialSignIn("google")}
                                    disabled={isLoading}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Sign Up with Google
                                </Button>
                            </div>
                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                            <div className="grid gap-6">

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-2">
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

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel" // Changed to tel
                                        placeholder="9898758788"
                                        required 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Signing Up..." : "Sign Up"}
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link href="http://localhost:3000/auth/user/signin" className="underline underline-offset-4">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </form>
                    <Button
            variant="ghost" // Use a ghost variant so it doesn't stand out as much as primary login buttons
            onClick={() => router.push("/auth/hr/signup")}
            disabled={isLoading}
            className="w-full text-blue-500 hover:underline cursor-pointer"
  
          >
            Are you an HR? Sign up here.
          </Button>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <Link href="#">Privacy Policy</Link>.
            </div>
        </div>
    )
}