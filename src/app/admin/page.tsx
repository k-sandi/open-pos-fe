export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-2">Welcome to Open POS Admin</h2>
        <p className="text-muted-foreground">
          Use the sidebar navigation to manage users, products, categories, taxes, and customers.
        </p>
      </div>
    </div>
  );
}
