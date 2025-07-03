"use client"

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
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState("")
  const [company, setCompany] = useState("")
  const companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "TCS",
    "Infosys",
    "Wipro",
  ]
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/hr/signup", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        company,
        password
      })
    })
    const data = await res.json()
    if (res.ok) {
      console.log("Signup successful !", data)
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false
      })
      if (signInResult?.error) {
        console.log("Sign in failed!", signInResult.error)
        alert("Sign in failed!")
      } else {
        console.log("Sign in successful!", signInResult)
        router.push("/dashboard/hr")
      }
    } else {
      console.log("Signup failed!", data.message)
      alert("Signup failed!")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back-HR</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <div className="flex flex-col gap-5">
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="john doe"
                    required
                    onChange={(e) => {
                      setName(e.target.value)
                    }}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    onChange={(e) => {
                      setEmail(e.target.value)
                    }}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="98909887534"
                    required
                    onChange={(e) => {
                      setPhone(e.target.value)
                    }}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="company">Company</Label>
                  <select
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    className="border rounded h-10 px-3"
                  >
                    <option value="">Select a company</option>
                    {companies.map((comp) => (
                      <option key={comp} value={comp}>
                        {comp}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input id="password" type="password" required
                    onChange={(e) => {
                      setPassword(e.target.value)
                    }} />
                </div>
                <Button type="submit" className="w-full">
                  SignUp
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/auth/hr/signin" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
          <Button
            variant="ghost" // Use a ghost variant so it doesn't stand out as much as primary login buttons
            onClick={() => router.push("/auth/user/signup")}
            className="w-full text-blue-500 hover:underline cursor-pointer"
          >
            Are you a Candidate? SignUp here.
          </Button>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  )
}