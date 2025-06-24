import { Toaster } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {

  
  console.log(process.env.AUTH_SECRET)

  return (
    <div className="flex h-screen w-full">
      <main className="flex-1 overflow-auto">
        {children}
        <Toaster />
      </main>
    </div>
  );
}