"use client"; // This component must be a client component

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter

export const AppBar = () => {
  const { data: session, status } = useSession(); // Access session data
  const router = useRouter(); // Initialize router

  // Function to handle sign-out
  const handleSignOut = async () => {
    // signOut() by default redirects to the homepage (/) or NextAuth's configured signOut page.
    // You can specify a callbackUrl to redirect to a specific page after logout.
    if (session && session.user?.role === "hr") {
      await signOut({ callbackUrl: "/auth/hr/signin" }); 
    } else {
      await signOut({ callbackUrl: "/auth/user/signin" });
    }

  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-lg m-4">
      <Link href="/" className="text-xl font-bold rounded-lg px-2 py-1 hover:bg-gray-700">
        ResumeScreening
      </Link>

      <div className="flex gap-4">
        {status === "loading" && (
          <span className="text-gray-400">Loading session...</span>
        )}
        {status === "authenticated" ? (
          <>
            <span className="flex items-center">
              Welcome, {session.user?.name || session.user?.email}! (Role: {session.user?.role})
            </span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/auth/user/signin")} // Redirect to user signin page
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              User Sign In
            </button>
            <button
              onClick={() => router.push("/auth/hr/signin")} // Redirect to HR signin page
              className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition-colors"
            >
              HR Sign In
            </button>
          </>
        )}
      </div>
    </nav>
  );
};