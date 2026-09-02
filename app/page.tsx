'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Briefcase, 
  FileText, 
  CalendarCheck, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Target,
  CheckCircle, 
  Star,
  Brain,
  ShieldCheck,
  Video,
  Clock,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ThemeToggle"
import { motion, Variants } from "framer-motion"

export default function LandingPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Animation variants for staggered entrance
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden flex flex-col">
      {/* Subtle Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-primary/15 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 -right-32 w-96 h-96 bg-emerald-500/15 dark:bg-emerald-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-10 left-1/3 w-80 h-80 bg-teal-500/10 dark:bg-teal-600/15 rounded-full blur-[100px]" 
        />
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border transition-colors">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-8 h-8 rounded-lg overflow-hidden shadow-sm"
            >
              <Image src="/logo.svg" alt="Jobotics Logo" fill className="object-contain" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Jobotics
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <button onClick={() => scrollToSection('features')} className="hover:text-foreground transition-colors cursor-pointer">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-foreground transition-colors cursor-pointer">
              How It Works
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-foreground transition-colors cursor-pointer">
              Testimonials
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push('/auth/user/signin')}
                className="text-sm font-medium hidden sm:inline-flex hover:bg-muted cursor-pointer"
              >
                Sign In as User
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="sm" 
                onClick={() => router.push('/auth/hr/signin')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm transition-all cursor-pointer"
              >
                Sign In as HR <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-4 container mx-auto text-center flex-grow flex flex-col items-center justify-center">
        {/* Floating AI Pill Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold mb-8 cursor-default"
        >
          <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '4s' }} />
          <span>AI Powered Resume Screening & Interview Scheduler</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.1] mb-6 text-foreground"
        >
          Streamline Your Hiring with{' '}
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-primary font-black inline-block"
          >
            Intelligent AI
          </motion.span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-3xl mb-10 leading-relaxed"
        >
          Transform your recruitment with AI-powered resume screening, Gemini skill extraction, 
          and automated Google Meet interview scheduling.
        </motion.p>

        {/* Dual Primary Call-To-Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center mb-16"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Button 
              size="lg" 
              onClick={() => router.push('/auth/user/signup')}
              className="w-full sm:w-auto h-12 px-8 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md cursor-pointer transition-all"
            >
              Sign Up as User <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push('/auth/hr/signup')}
              className="w-full sm:w-auto h-12 px-8 text-base font-semibold border-border hover:bg-muted text-foreground shadow-sm cursor-pointer transition-all"
            >
              <Briefcase className="mr-2 h-4 w-4 text-primary" /> Sign Up as HR
            </Button>
          </motion.div>
        </motion.div>

        {/* Live Platform Stats */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl pt-8 border-t border-border"
        >
          {[
            { value: "10,000+", label: "Resumes Processed", color: "text-foreground" },
            { value: "500+", label: "Companies Trust Us", color: "text-foreground" },
            { value: "95%", label: "Accuracy Rate", color: "text-primary" },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-4 rounded-xl bg-card border border-border shadow-sm cursor-default"
            >
              <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 px-4 bg-muted/20 border-y border-border transition-colors">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge variant="outline" className="mb-3 border-primary/30 text-primary">
              Core Capabilities
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
              Powerful Features
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Everything you need to revolutionize your hiring process with cutting-edge AI technology.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 flex flex-col items-start group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Smart Screening</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI evaluates resumes against job requirements, ranking candidates by compatibility and highlighting key qualifications instantly.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 flex flex-col items-start group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Resume Parsing</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Advanced ML algorithms extract skills, experience, education, and achievements from PDF and DOCX formats with 99% accuracy.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 flex flex-col items-start group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Interview Scheduling</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Automated scheduling system coordinates with Google Meet, dispatches calendar invites, and manages interview logistics seamlessly.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-28 px-4 container mx-auto max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge variant="outline" className="mb-3 border-primary/30 text-primary">
            Step-by-Step
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
            How It Works
          </h2>
          <p className="text-muted-foreground text-base">
            Simple, automated steps from vacancy to final hire.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { step: "01", title: "Upload Job", desc: "Post your job requirements and qualifications.", icon: Briefcase },
            { step: "02", title: "AI Analysis", desc: "Smart algorithms screen and evaluate resumes.", icon: Brain },
            { step: "03", title: "Best Matches", desc: "Get ranked candidate list based on skill compatibility.", icon: Target },
            { step: "04", title: "Schedule", desc: "Book Google Meet interviews instantly with 1 click.", icon: CalendarCheck },
          ].map((item, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 rounded-xl bg-card border border-border shadow-sm relative flex flex-col justify-between hover:border-primary/40 transition-colors cursor-default"
            >
              <div>
                <span className="text-3xl font-black text-muted-foreground/30 font-mono block mb-4">{item.step}</span>
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-base mb-2 text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-28 px-4 bg-muted/20 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <Badge variant="outline" className="mb-3 border-primary/30 text-primary">
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-foreground">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground text-base">
              Trusted by HR professionals worldwide.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                quote: "Jobotics transformed our hiring process completely. We reduced screening time by 80% and improved candidate quality significantly.",
                author: "Ananya Verma",
                role: "HR Manager",
                initials: "AV"
              },
              {
                quote: "The AI accuracy is incredible. It consistently identifies top candidates that align perfectly with our requirements.",
                author: "Rohan Malhotra",
                role: "Senior Recruiter",
                initials: "RM"
              },
              {
                quote: "Scheduling interviews used to be a nightmare. Now it's completely automated and candidates love the seamless experience.",
                author: "Priya Desai",
                role: "Talent Acquisition Lead",
                initials: "PD"
              }
            ].map((test, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="p-6 rounded-xl bg-card border border-border shadow-sm flex flex-col justify-between cursor-default"
              >
                <div>
                  <div className="flex text-amber-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-6 leading-relaxed">
                    "{test.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                    {test.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{test.author}</p>
                    <p className="text-xs text-muted-foreground">{test.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-16 md:py-24 px-4 container mx-auto max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-12 rounded-3xl bg-card border border-border shadow-xl relative overflow-hidden text-center"
        >
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Ready to Revolutionize Your Hiring?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Join hundreds of companies already using Jobotics to find the perfect candidates faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  onClick={() => router.push('/auth/hr/signup')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base shadow-md cursor-pointer"
                >
                  Start Free Trial <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => scrollToSection('features')}
                  className="border-border text-foreground hover:bg-muted font-semibold text-base cursor-pointer"
                >
                  Explore Features
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border bg-background text-muted-foreground text-xs text-center transition-colors">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Jobotics Logo" width={20} height={20} />
            <span className="font-bold text-foreground">Jobotics</span>
            <span>— The future of recruitment is here.</span>
          </div>
          <p>© {new Date().getFullYear()} Jobotics. All rights reserved. Made with ❤️ for better hiring.</p>
        </div>
      </footer>
    </div>
  )
}