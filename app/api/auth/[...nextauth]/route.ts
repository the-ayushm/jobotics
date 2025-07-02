// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Import authOptions from the new location

// NextAuth.js handles the GET and POST requests for authentication
const handler = NextAuth(authOptions);

// Export the handlers expected by Next.js App Router
export { handler as GET, handler as POST };
