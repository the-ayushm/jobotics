// components/landing/ContactCTASection.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function ContactCTASection() {
  const router = useRouter();
  return (
    <section className="text-center px-6 py-20 bg-background text-foreground"> {/* Uses bg-background */}
      <h2 className="text-4xl font-bold mb-6">Have Questions? Contact Us!</h2>
      <p className="text-muted-foreground text-lg mb-8 max-w-3xl mx-auto"> {/* Uses text-muted-foreground */}
        Our team is ready to assist you with any inquiries or support you might need.
      </p>
      <Button
        onClick={() => router.push('/contact')}
        size="lg"
        variant="outline"
        // Outline button uses custom jobotics-purple for border/text (vibrant purple)
        className="px-8 py-6 text-lg rounded-2xl shadow-xl
                   border-2 border-jobotics-purple text-jobotics-purple hover:bg-jobotics-purple hover:text-white
                   transition-all duration-300"
      >
        Get In Touch
      </Button>
    </section>
  );
}
