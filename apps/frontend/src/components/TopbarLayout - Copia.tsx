export default function TopbarLayout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        <nav className="bg-gray-800 text-white p-4">Topbar Menu</nav>
        <main className="p-6">{children}</main>
      </div>
    );
  }
  