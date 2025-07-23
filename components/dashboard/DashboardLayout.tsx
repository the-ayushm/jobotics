// components/dashboard/DashboardLayout.tsx
"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  Settings as SettingsIcon,
  Moon,
  Sun
} from "lucide-react";
import { Toaster } from "sonner";
import Image from "next/image";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function DashboardLayout({ children, activeSection, onSectionChange }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // FIX 1: Removed Profile and Settings from main navItems
  const navItems = [
    { name: "Dashboard", id: "dashboard", icon: LayoutDashboard },
    { name: "Available Jobs", id: "available-jobs", icon: Briefcase },
    { name: "My Applications", id: "my-applications", icon: FileText },
  ];

  const getUserInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  // Animation variants (no changes needed here)
  const navItemVariants = {
    inactive: {
      scale: 1,
      backgroundColor: "transparent",
      boxShadow: "0 0 0 0 rgba(0,0,0,0)"
    },
    active: {
      scale: 1.02,
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      boxShadow: "0 8px 25px -8px hsl(var(--primary) / 0.3)"
    },
    hover: {
      scale: 1.05,
      backgroundColor: "hsl(var(--primary) / 0.1)",
      boxShadow: "0 4px 15px -4px hsl(var(--primary) / 0.2)"
    }
  };

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    // FIX 2: Use bg-background for main container
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Animated Glassmorphism Header */}
      <motion.header
        className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-lg rounded-b-2xl mx-2 mt-2"
        variants={headerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="flex items-center justify-between p-4 md:px-6">
          {/* Left Side - Branding */}
          <div className="flex items-center space-x-4">
            {/* Mobile Hamburger Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10 rounded-xl">
                    <Menu className="h-6 w-6" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 bg-card border-r border-border"> {/* FIX: Use bg-card and border-border */}
                <SheetHeader className="p-6 border-b border-border bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
                  <SheetTitle className="text-xl font-bold text-primary">
                    Dashboard Menu
                  </SheetTitle>
                  <SheetDescription className="text-sm text-muted-foreground">
                    Navigate through your dashboard sections
                  </SheetDescription>
                </SheetHeader>

                <nav className="flex flex-col p-4 space-y-3">
                  <AnimatePresence>
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant={activeSection === item.id ? "default" : "ghost"}
                          className={`justify-start text-base flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 w-full ${
                            activeSection === item.id
                              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                              : 'hover:bg-primary/5'
                          }`}
                          onClick={() => {
                            onSectionChange(item.id);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Profile and Settings in Mobile Menu */}
                  <div className="border-t border-border pt-4 mt-4 space-y-2">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button
                        variant={activeSection === "profile" ? "default" : "ghost"}
                        className={`justify-start text-base flex items-center gap-3 w-full py-3 px-4 rounded-xl transition-all duration-300 ${
                          activeSection === "profile"
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                            : 'hover:bg-primary/5'
                        }`}
                        onClick={() => {
                          onSectionChange("profile");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <User className="h-5 w-5" />
                        Profile
                      </Button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button
                        variant={activeSection === "settings" ? "default" : "ghost"}
                        className={`justify-start text-base flex items-center gap-3 w-full py-3 px-4 rounded-xl transition-all duration-300 ${
                          activeSection === "settings"
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                            : 'hover:bg-primary/5'
                        }`}
                        onClick={() => {
                          onSectionChange("settings");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <SettingsIcon className="h-5 w-5" />
                        Settings
                      </Button>
                    </motion.div>

                    {/* Dark Mode Toggle in Mobile */}
                    <motion.div
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/30"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: theme === "dark" ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="mr-3"
                        >
                          {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        </motion.div>
                        <span className="text-sm font-medium">Dark Mode</span>
                      </div>
                      <Switch
                        checked={theme === "dark"}
                        onCheckedChange={toggleTheme}
                        className="ml-2"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Button
                        variant="ghost"
                        className="justify-start text-base flex items-center gap-3 w-full py-3 px-4 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                      </Button>
                    </motion.div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo and Brand */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="relative">
                  <Image
                    src="/logo.svg"
                    alt="Jobotics Logo"
                    width={40}
                    height={40}
                    className="rounded-xl shadow-sm"
                  />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
                  Jobotics
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Center - Desktop Navigation - FIXED SECTION */}
          <nav className="hidden md:flex items-center space-x-2 bg-muted/30 rounded-2xl p-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={navItemVariants}
                initial="inactive"
                animate={activeSection === item.id ? "active" : "inactive"}
                whileHover="hover"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Button
                  variant="ghost"
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
                    activeSection === item.id
                      ? 'text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => onSectionChange(item.id)}
                >
                  {/* Active indicator background */}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      layoutId="activeTab"
                      style={{
                        background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)"
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}

                  {/* Content - SINGLE SET ONLY */}
                  <div className="relative z-10 flex items-center gap-2">
                    <motion.div
                      animate={{ scale: activeSection === item.id ? 1.1 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <item.icon className="h-4 w-4" />
                    </motion.div>
                    <span>{item.name}</span>
                  </div>
                </Button>
              </motion.div>
            ))}
          </nav>

          {/* Right Side - User Profile & Actions */}
          <div className="flex items-center gap-4">
            {/* Personalized Greeting */}
            <motion.div
              className="hidden sm:block text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm font-medium text-foreground">
                Hello, {session?.user?.name || session?.user?.email}!
              </p>
              <p className="text-xs text-muted-foreground">
                Welcome back to your dashboard
              </p>
            </motion.div>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" className="relative h-12 w-12 rounded-full hover:ring-2 hover:ring-primary/30 transition-all duration-300">
                    <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-lg">
                      <AvatarImage
                        src={session?.user?.image || "https://github.com/shadcn.png"}
                        alt={session?.user?.name || "User avatar"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold text-lg">
                        {getUserInitials(session?.user?.name, session?.user?.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium leading-none">
                      {session?.user?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-primary/5 rounded-lg p-3 transition-colors duration-200"
                    onClick={() => onSectionChange('profile')}
                  >
                    <User className="mr-3 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </motion.div>

                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-primary/5 rounded-lg p-3 transition-colors duration-200"
                    onClick={() => onSectionChange('settings')}
                  >
                    <SettingsIcon className="mr-3 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </motion.div>

                <DropdownMenuSeparator />

                {/* Dark Mode Toggle in Desktop */}
                <DropdownMenuItem className="cursor-pointer p-3 rounded-lg" onClick={(e) => e.preventDefault()}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <motion.div
                        animate={{ rotate: theme === "dark" ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="mr-3"
                      >
                        {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      </motion.div>
                      <span>Dark Mode</span>
                    </div>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={toggleTheme}
                      className="ml-2"
                    />
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive hover:bg-destructive/5 hover:text-destructive rounded-lg p-3 transition-colors duration-200"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area with Animation */}
      <motion.main
        className="flex-grow p-6 md:p-8 bg-gray-50 dark:bg-gray-950"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>

      {/* Animated Footer */}
      <motion.footer
        className="bg-background/50 backdrop-blur-sm border-t border-border mt-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} ResumeScreening. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {["Privacy Policy", "Terms of Service", "Support"].map((link, index) => (
                <motion.div
                  key={link}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="hover:text-primary transition-colors duration-200"
                  >
                    {link}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.footer>

      <Toaster richColors position="bottom-right" />
    </div>
  );
}