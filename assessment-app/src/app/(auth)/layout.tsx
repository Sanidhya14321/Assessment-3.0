export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-accent/10 p-4">
      <main className="w-full max-w-md">
        {children}
      </main>
    </div>
  );
}
