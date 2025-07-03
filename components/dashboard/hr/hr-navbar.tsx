// components/dashboard/hr-navbar.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Home, Briefcase, Users, CalendarCheck, Settings, LogOut, Menu, UserCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { ModeToggle } from "@/components/mode-toggle"; // Optional theme toggle

export function HrNavbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard/hr", icon: Home },
    { name: "Applicants", href: "/dashboard/hr/applicants", icon: Users },
    { name: "Job Listings", href: "/dashboard/hr/jobs", icon: Briefcase },
    { name: "Interviews", href: "/dashboard/hr/interviews", icon: CalendarCheck },
  ];

  return (
    <nav
      className="sticky top-0 z-50 w-full py-3 px-4 md:px-6
                 bg-background/40 backdrop-blur-md rounded-b-lg border-b border-l border-r border-border
                 shadow-lg transition-all duration-300"
      suppressHydrationWarning // Keep this for browser extension issues
    >
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo and App Name */}
        {/* For the logo Link, it's fine as it directly wraps text/image, no Button involved */}
        <Link href="/" className="flex items-center space-x-2" suppressHydrationWarning>
          <Image src="/logo.svg" alt="Jobotics Logo" width={32} height={32} className="rounded-md" />
          <span className="text-2xl font-bold text-foreground hidden sm:inline">Jobotics HR</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Button
              key={link.name}
              asChild
              variant="ghost"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              suppressHydrationWarning // Keep this for browser extension issues
            >
              <Link href={link.href}>
                <link.icon className="h-5 w-5" />
                {link.name}
              </Link>
            </Button>
          ))}
        </div>

        {/* User Avatar and Dropdown Menu */}
        <div className="flex items-center space-x-3">
          {/* Optional: Theme Toggle */}
          {/* <ModeToggle /> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full" suppressHydrationWarning>
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={session?.user?.image || "https://github.com/shadcn.png"} alt={session?.user?.name || "User"} />
                  <AvatarFallback>{session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'HR'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session?.user?.name || "HR User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email || "hr@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* DropdownMenu.Item uses onClick directly, no Link needed here if just routing */}
              <DropdownMenuItem onClick={() => router.push('/dashboard/hr/profile')}>
                <UserCircle2 className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/hr/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" suppressHydrationWarning>
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navLinks.map((link) => (
                  <DropdownMenuItem key={link.name} onClick={() => router.push(link.href)}>
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.name}
                  </DropdownMenuItem>
                ))}
                 <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/hr/profile')}>
                    <UserCircle2 className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/hr/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}