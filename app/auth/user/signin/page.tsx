// app/auth/user/signin/page.tsx
"use client"; // This page should also be a client component because it renders a client component

// Import the component by its correct named export
import { UserLoginForm } from '@/components/user-login-form'; // <--- Corrected import

export default function UserSignInPageWrapper() { // Changed to Wrapper to differentiate if needed, though LoginPage is fine
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <UserLoginForm /> {/* Use the correctly imported component */}
      </div>
    </div>
  );
}