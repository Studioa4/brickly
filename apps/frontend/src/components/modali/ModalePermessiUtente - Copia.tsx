import { useState } from "react";
import { Lock } from "lucide-react";

type Props = {
  open: boolean;
  livelloCorrente: number;
  onClose: () => void;
  onSalva: (livello: number) => void;
};

export default function ModalePermessiUtente({ open, livelloCorrente, onClose, onSalva }: Props) {
  const [selectedLevel, setSelectedLevel] = useState<number>(livelloCorrente ?? 1);

  if (!open) return null;

  const descrizioni: Record<number, string> = {
    1: "Solo lettura",
    2: "Livello 1 e caricamento",
    3: "Livello 2 e modifica",
    4: "Livello 3 e eliminazione",
    5: "Livello 4 e gestione esercizi",
  };

  const colori: Record<number, string> = {
    1: "bg-gray-100",
    2: "bg-blue-100",
    3: "bg-yellow-100",
    4: "bg-orange-100",
    5: "bg-red-100",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-2">Gestione permessi</h2>
        <p className="mb-4 text-sm text-gray-700">
          <strong>Livello attuale:</strong> {livelloCorrente} - {descrizioni[livelloCorrente]}
        </p>

        <div className="space-y-3 mb-4">
          {[1, 2, 3, 4, 5].map((livello) => (
            <label
              key={livello}
              className={`flex items-start gap-3 cursor-pointer p-3 rounded ${colori[livello]} ${
                selectedLevel === livello ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <input
                type="radio"
                name="permessi"
                value={livello}
                checked={selectedLevel === livello}
                onChange={() => setSelectedLevel(livello)}
                className="mt-1"
              />
              <div className="flex items-start gap-2">
                <div className="flex items-center gap-1 font-bold text-sm text-gray-800">
                  <Lock size={16} />
                  {livello}
                </div>
                <div>
                  <span className="font-semibold">Livello {livello}</span>
                  <p className="text-sm text-gray-600">{descrizioni[livello]}</p>
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Annulla
          </button>
          <button
            onClick={() => onSalva(selectedLevel)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Salva
          </button>
        </div>
      </div>
    </div>
  );
}
