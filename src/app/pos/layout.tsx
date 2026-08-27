export default function POSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-14 items-center border-b px-6 bg-primary text-primary-foreground">
        <h1 className="text-lg font-bold">Open POS - Terminal</h1>
      </header>
      <main className="flex-1 overflow-hidden h-[calc(100vh-3.5rem)]">
        {children}
      </main>
    </div>
  );
}
