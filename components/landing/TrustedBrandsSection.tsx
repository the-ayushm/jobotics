// components/landing/TrustedBrandsSection.tsx
"use client";

const brands = [
  "TechCorp", "InnovateLab", "FutureWorks", "DigitalDream",
  "NextGen Solutions", "AI Dynamics", "CloudTech", "DataFlow Systems"
];

export function TrustedBrandsSection() {
  return (
    <section className="py-16 px-4 bg-muted overflow-hidden text-foreground"> {/* Uses bg-muted */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground"> {/* Uses text-foreground */}
            Trusted by Leading Companies
          </h2>
          <p className="text-lg text-muted-foreground"> {/* Uses text-muted-foreground */}
            Join hundreds of companies using Jobotics to hire smarter
          </p>
        </div>
        
        <div className="relative overflow-hidden w-full">
          <div className="flex animate-marquee space-x-16 whitespace-nowrap py-4">
            {[...brands, ...brands].map((brand, index) => (
              <div 
                key={index}
                className="flex-shrink-0 px-8 py-4 rounded-xl cursor-pointer
                           bg-card hover:bg-muted/50 // Uses bg-card and hover with muted
                           transition-all duration-300 transform hover:scale-105"
              >
                <span className="text-xl font-semibold text-foreground hover:text-primary transition-colors"> {/* Uses text-foreground and hover text-primary */}
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
