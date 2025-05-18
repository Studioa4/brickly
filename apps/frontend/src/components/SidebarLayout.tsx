export default function SidebarLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex">
        <aside className="w-64 bg-gray-800 text-white p-4">Sidebar Menu</aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    );
  }
  