import { CreateJobForm } from "@/components/hr/CreateJobForm"; // The job creation form

export default function CreateJobPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-grow p-4 md:p-8 container mx-auto">
        <CreateJobForm />
      </main>
    </div>
  );
}