interface Props {
  condomini: any[];
  condominioSelezionato: any;
  onChange: (c: any) => void;
}

export default function SelectCondominio({ condomini, condominioSelezionato, onChange }: Props) {
  return (
    <select
      className="border border-gray-300 rounded p-2 w-full max-w-md"
      value={condominioSelezionato?.id || ""}
      onChange={(e) => {
        const selected = condomini.find(c => c.id === e.target.value);
        onChange(selected || null);
      }}
    >
      <option value="">-- Seleziona condominio --</option>
      {condomini.map((c) => (
        <option key={c.id} value={c.id}>
          {c.denominazione} ({c.tipologia})
        </option>
      ))}
    </select>
  );
}
