'use client'

import React, { useState, useEffect } from 'react'
import { Briefcase, FileText, CalendarCheck, Users, ArrowRight, Sparkles, Zap, Target, CheckCircle, Star } from "lucide-react"
import { useRouter } from 'next/navigation'
import { ro } from 'date-fns/locale'

type ButtonProps = {
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  variant?: "default" | "outline"
  size?: "md" | "lg"
  className?: string
  [key: string]: any
}

const Button = ({ children, onClick, variant = "default", size = "md", className = "", ...props }: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
  const variants = {
    default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-white/80 backdrop-blur-sm"
  }
  const sizes = {
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 -right-32 w-64 h-64 bg-gradient-to-br from-pink-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-blue-500/30 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  )
}

type FeatureCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  description: string
  delay?: number
}

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div className={`group relative p-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 text-center overflow-hidden transition-all duration-700 transform hover:scale-105 hover:rotate-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Glowing effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/10 group-hover:via-purple-400/10 group-hover:to-pink-400/10 transition-all duration-500"></div>
      
      <div className="relative z-10">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 transform group-hover:scale-110"></div>
          <Icon className="relative w-16 h-16 mx-auto text-transparent bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text transform group-hover:scale-110 transition-transform duration-300" style={{WebkitBackgroundClip: 'text', backgroundClip: 'text'}} />
        </div>
        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{title}</h3>
        <p className="text-gray-600 text-base leading-relaxed">{description}</p>
      </div>
      
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-3xl"></div>
    </div>
  )
}

type TestimonialCardProps = {
  quote: string
  author: string
  delay?: number
}

const TestimonialCard = ({ quote, author, delay = 0 }: TestimonialCardProps) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div className={`group p-8 bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 text-left overflow-hidden transition-all duration-700 hover:shadow-2xl hover:scale-105 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="flex items-start mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
        ))}
      </div>
      
      <p className="text-gray-700 mb-6 text-lg leading-relaxed italic">"{quote}"</p>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
          {author.split(' ').map(n => n[0]).join('')}
        </div>
        <h4 className="font-bold text-gray-800">{author}</h4>
      </div>
    </div>
  )
}

type StatsCounterProps = {
  end: number
  label: string
  duration?: number
}

const StatsCounter = ({ end, label, duration = 2000 }: StatsCounterProps) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isVisible) return
    
    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
      requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [end, duration, isVisible])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    
    const element = document.getElementById(`counter-${label}`)
    if (element) observer.observe(element)
    
    return () => observer.disconnect()
  }, [label])

  return (
    <div id={`counter-${label}`} className="text-center">
      <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        {count}+
      </div>
      <div className="text-gray-600 text-sm uppercase tracking-wider">{label}</div>
    </div>
  )
}

export default function JoboticsLanding() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const router = useRouter();


  useEffect(() => {
    interface MousePosition {
      x: number
      y: number
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  interface HandleSignIn {
    (type: 'user' | 'hr'): void
  }

  const handleSignIn: HandleSignIn = (type) => {
    console.log(`Signing in as ${type}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Cursor follower */}
      <div 
        className="fixed w-8 h-8 pointer-events-none z-50 transition-all duration-150 ease-out"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.1) 70%, transparent 100%)',
          borderRadius: '50%',
          filter: 'blur(1px)'
        }}
      />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 relative">
          {/* Animated title */}
          <div className="mb-8 relative">
            <h1 className="text-7xl md:text-8xl font-black mb-6 relative">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                Jobotics
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 blur-2xl opacity-20 animate-pulse"></div>
            </h1>
            
            {/* Floating badges */}
            <div className="absolute -top-8 -right-8 animate-bounce">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                AI Powered
              </div>
            </div>
            <div className="absolute -bottom-4 -left-8 animate-bounce animation-delay-1000">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                Smart Hiring
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-12 relative">
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              Transform your recruitment with{' '}
              <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-powered resume screening
              </span>{' '}
              and{' '}
              <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                intelligent interview scheduling
              </span>
            </p>
            
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-pink-100/50 blur-3xl rounded-full transform scale-150"></div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-6 mb-16">
            <Button 
              onClick={() => router.push('/auth/user/signin')} 
              size="lg"
              className="group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Sign In as User
                <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </Button>
            
            <Button 
              onClick={() => router.push('/auth/hr/signin')} 
              variant="outline" 
              size="lg"
              className="group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <Briefcase className="mr-2 w-5 h-5" />
                Sign In as HR
              </span>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <StatsCounter end={10000} label="Resumes Processed" />
            <StatsCounter end={500} label="Companies Trust Us" />
            <StatsCounter end={95} label="Accuracy Rate" />
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to revolutionize your hiring process with cutting-edge AI technology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Zap}
                title="Smart Screening"
                description="AI evaluates resumes against job requirements, ranking candidates by compatibility and highlighting key qualifications instantly."
                delay={0}
              />
              <FeatureCard
                icon={FileText}
                title="Resume Parsing"
                description="Advanced ML algorithms extract skills, experience, education, and achievements from any resume format with 99% accuracy."
                delay={200}
              />
              <FeatureCard
                icon={CalendarCheck}
                title="Interview Scheduling"
                description="Automated scheduling system coordinates with multiple calendars, sends reminders, and manages interview logistics seamlessly."
                delay={400}
              />
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                How It Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: FileText, title: "Upload Job", desc: "Post your job requirements" },
                { icon: Zap, title: "AI Analysis", desc: "Smart algorithms screen resumes" },
                { icon: Target, title: "Best Matches", desc: "Get ranked candidate list" },
                { icon: CalendarCheck, title: "Schedule", desc: "Book interviews instantly" }
              ].map((step, index) => (
                <div key={index} className="relative text-center group">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform -translate-y-1/2 hidden md:block last:hidden">
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-purple-600 rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600">Trusted by HR professionals worldwide</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="Jobotics transformed our hiring process completely. We reduced screening time by 80% and improved candidate quality significantly."
                author="Ananya Verma, HR Manager"
                delay={0}
              />
              <TestimonialCard
                quote="The AI accuracy is incredible. It consistently identifies top candidates that align perfectly with our requirements."
                author="Rohan Malhotra, Senior Recruiter"
                delay={200}
              />
              <TestimonialCard
                quote="Scheduling interviews used to be a nightmare. Now it's completely automated and candidates love the seamless experience."
                author="Priya Desai, Talent Acquisition Lead"
                delay={400}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/20"></div>
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Ready to Revolutionize Your Hiring?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Join thousands of companies already using Jobotics to find the perfect candidates faster than ever before.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Button 
                onClick={() => handleSignIn('hr')} 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-2xl group"
              >
                <span className="flex items-center">
                  Start Free Trial
                  <Sparkles className="ml-2 w-5 h-5 group-hover:animate-spin" />
                </span>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Jobotics
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                The future of recruitment is here. Smart, efficient, and designed for modern hiring teams.
              </p>
            </div>
            
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400">
                © {new Date().getFullYear()} Jobotics. All rights reserved. Made with ❤️ for better hiring.
              </p>
            </div>
          </div>
        </footer>
      </main>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}