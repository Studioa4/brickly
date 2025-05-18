import { Radio } from "lucide-react";

export default function TopbarLayout({ toggleRadio }: { toggleRadio: () => void }) {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <span>Topbar Menu</span>
      <button
        onClick={toggleRadio}
        className="p-2 rounded hover:bg-gray-700"
        title="Apri/Chiudi Radio"
      >
        <Radio className="w-5 h-5" />
      </button>
    </nav>
  );
}