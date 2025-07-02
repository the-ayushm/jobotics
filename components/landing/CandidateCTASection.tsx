// components/landing/CandidateCTASection.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function CandidateCTASection() {
  const router = useRouter();

  return (
    // Section with the prominent gradient background from the reference (direct hex for exact match)
    <section className="py-24 px-4 bg-gradient-to-r from-jobotics-blue via-jobotics-indigo to-jobotics-purple text-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-6 text-white" // Text white on this dark gradient
        >
          Looking for your dream job?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-blue-100 mb-12" // Lighter blue text
        >
          Upload your resume and let our AI find the perfect job match for you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            onClick={() => router.push('/auth/user/signup')}
            size="lg"
            // Button is white with text color from custom jobotics-blue
            className="text-lg px-12 py-6 rounded-2xl shadow-2xl
                       bg-white text-jobotics-blue hover:bg-gray-100
                       transform hover:scale-105 transition-all duration-300"
          >
            Upload Resume & Get Matches
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
