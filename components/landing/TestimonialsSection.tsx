// components/landing/TestimonialsSection.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
// import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Johnson",
    designation: "HR Director at TechCorp",
    feedback: "Jobotics has revolutionized our hiring process. We've reduced screening time by 80% and found better candidates faster than ever before."
  },
  {
    name: "Michael Chen",
    designation: "Software Engineer",
    feedback: "As a job seeker, Jobotics matched me with my dream job in just 2 days. The AI recommendations were spot-on with my skills and preferences."
  },
  {
    name: "Emily Rodriguez",
    designation: "Talent Acquisition Manager",
    feedback: "The interview scheduling feature is a game-changer. Our coordination time has dropped dramatically, and candidates love the seamless experience."
  }
];

export function TestimonialsSection() {
  return (
    // Section background: Using default light background (from-gray-50 to-blue-50 is a subtle gradient)
    <section className="py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50 text-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground"> {/* Uses text-foreground */}
            What Our Users Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto"> {/* Uses text-muted-foreground */}
            Join thousands of satisfied HR professionals and job seekers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border-0 
                         bg-card rounded-xl shadow-md" /* Uses bg-card and default border-0 */
            >
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 italic"> {/* Uses text-muted-foreground */}
                  "{testimonial.feedback}"
                </p>
                <div className="border-t border-border pt-4"> {/* Uses border-border */}
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4> {/* Uses text-foreground */}
                  <p className="text-sm text-muted-foreground">{testimonial.designation}</p> {/* Uses text-muted-foreground */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
