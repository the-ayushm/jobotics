'use client'

import { Button } from "@/components/ui/button"
import { Briefcase, FileText, CalendarCheck, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function LandingPage() {
  const router = useRouter()

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800">

      {/* Hero Section */}
      <section className="text-center px-6 py-24 relative overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-7xl font-extrabold mb-6 text-primary tracking-tight"
        >
          Welcome to Jobotics
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
        >
          AI-powered Resume Screening & Interview Scheduling platform for modern recruitment teams.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col md:flex-row justify-center gap-6"
        >
          <Button onClick={() => router.push('/auth/user/signin')} size="lg" className="px-8 py-6 text-lg rounded-2xl shadow-lg">
            Sign In as User
          </Button>
          <Button onClick={() => router.push('/auth/hr/signin')} variant="outline" size="lg" className="px-8 py-6 text-lg rounded-2xl">
            Sign In as HR
          </Button>
        </motion.div>

        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-40 -right-20 w-60 h-60 bg-purple-100 rounded-full blur-3xl opacity-40"></div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl px-8 py-20">
        <motion.div whileHover={{ scale: 1.05 }} className="p-8 bg-white rounded-3xl shadow-lg text-center border border-gray-100">
          <Briefcase className="w-14 h-14 mx-auto text-primary mb-5" />
          <h3 className="text-2xl font-semibold mb-3">Smart Screening</h3>
          <p className="text-muted-foreground text-base">Let AI evaluate resumes based on job requirements and shortlist the best candidates instantly.</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-8 bg-white rounded-3xl shadow-lg text-center border border-gray-100">
          <FileText className="w-14 h-14 mx-auto text-primary mb-5" />
          <h3 className="text-2xl font-semibold mb-3">Resume Parsing</h3>
          <p className="text-muted-foreground text-base">Extract relevant skills, experience, and qualifications from any resume with precision.</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-8 bg-white rounded-3xl shadow-lg text-center border border-gray-100">
          <CalendarCheck className="w-14 h-14 mx-auto text-primary mb-5" />
          <h3 className="text-2xl font-semibold mb-3">Schedule Interviews</h3>
          <p className="text-muted-foreground text-base">Manage and schedule interviews seamlessly from within your HR dashboard.</p>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16 bg-white w-full text-center">
        <h2 className="text-4xl font-bold mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <motion.div whileHover={{ scale: 1.03 }} className="p-6 border rounded-xl shadow text-left">
            <p className="text-muted-foreground mb-4">“Jobotics has transformed our hiring process. It's quick, reliable and easy to use.”</p>
            <h4 className="font-semibold">— Ananya Verma, HR Manager</h4>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} className="p-6 border rounded-xl shadow text-left">
            <p className="text-muted-foreground mb-4">“The resume parsing accuracy is brilliant. It saves us hours of manual shortlisting.”</p>
            <h4 className="font-semibold">— Rohan Malhotra, Recruiter</h4>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} className="p-6 border rounded-xl shadow text-left">
            <p className="text-muted-foreground mb-4">“Super intuitive platform and scheduling interviews is seamless. Highly recommend it!”</p>
            <h4 className="font-semibold">— Priya Desai, Talent Acquisition</h4>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Logos */}
      <section className="px-6 py-12 bg-gradient-to-br from-gray-100 to-white w-full text-center">
        <h2 className="text-3xl font-bold mb-6">Trusted by Top Teams</h2>
        <div className="flex flex-wrap justify-center items-center gap-8 max-w-5xl mx-auto">
          <Users className="w-12 h-12 text-primary" />
          <Users className="w-12 h-12 text-primary" />
          <Users className="w-12 h-12 text-primary" />
          <Users className="w-12 h-12 text-primary" />
          <Users className="w-12 h-12 text-primary" />
        </div>
      </section>

      {/* Contact CTA */}
      <section className="text-center px-6 py-20">
        <h2 className="text-4xl font-bold mb-6">Ready to streamline your hiring?</h2>
        <p className="text-muted-foreground text-lg mb-8">Join thousands of businesses who trust Jobotics for smarter recruitment.</p>
        <Button onClick={() => router.push('/auth/hr/signin')} size="lg" className="px-8 py-6 text-lg rounded-2xl shadow-xl">
          Get Started as HR
        </Button>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Jobotics. All rights reserved.
      </footer>

    </main>
  )
}
