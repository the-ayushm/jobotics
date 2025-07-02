// components/landing/Footer.tsx
import Link from "next/link";
// import Image from "next/image"; // Uncomment if you add a logo

export function Footer() {
  return (
    // Uses bg-card for consistent card-like background in the theme
    <footer className="py-8 text-center text-sm text-muted-foreground bg-card border-t border-border"> 
      <div className="container max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Optional: Logo and Name */}
        <Link href="/" className="flex items-center space-x-2 text-foreground"> {/* Uses text-foreground */}
          {/* <Image src="/logo.svg" alt="Jobotics Logo" width={24} height={24} /> */}
          <span className="text-lg font-bold">Jobotics</span>
        </Link>
        
        <p>
          &copy; {new Date().getFullYear()} Jobotics. All rights reserved.
        </p>
        
        <div className="flex space-x-4">
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link> {/* Uses text-primary */}
          <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link> {/* Uses text-primary */}
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link> {/* Uses text-primary */}
        </div>
      </div>
    </footer>
  );
}
