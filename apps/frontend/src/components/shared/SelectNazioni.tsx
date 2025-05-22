import { useState, useEffect, useRef } from "react";

const toFlag = (countryCode) =>
  typeof countryCode === "string"
    ? countryCode
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(127397 + char.charCodeAt())
        )
    : "";

const nazioni = [
  { code: "IT", name: "Italia" },
  { code: "FR", name: "Francia" },
  { code: "DE", name: "Germania" },
  { code: "ES", name: "Spagna" },
  { code: "CH", name: "Svizzera" },
  { code: "US", name: "Stati Uniti" },
  { code: "GB", name: "Regno Unito" },
  { code: "PT", name: "Portogallo" },
  { code: "BE", name: "Belgio" },
  { code: "AT", name: "Austria" },
  { code: "GR", name: "Grecia" },
  { code: "NL", name: "Paesi Bassi" },
  { code: "BR", name: "Brasile" },
  { code: "CN", name: "Cina" },
  { code: "JP", name: "Giappone" },
  { code: "CA", name: "Canada" },
  { code: "AR", name: "Argentina" },
  { code: "IN", name: "India" },
  { code: "AU", name: "Australia" },
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AM", name: "Armenia" },
  { code: "AZ", name: "Azerbaigian" },
  { code: "BG", name: "Bulgaria" },
  { code: "CL", name: "Cile" },
  { code: "CO", name: "Colombia" },
  { code: "HR", name: "Croazia" },
  { code: "CY", name: "Cipro" },
  { code: "CZ", name: "Repubblica Ceca" },
  { code: "DK", name: "Danimarca" },
  { code: "EG", name: "Egitto" },
  { code: "EE", name: "Estonia" },
  { code: "FI", name: "Finlandia" },
  { code: "HU", name: "Ungheria" },
  { code: "ID", name: "Indonesia" },
  { code: "IE", name: "Irlanda" },
  { code: "IL", name: "Israele" },
  { code: "KZ", name: "Kazakistan" },
  { code: "KR", name: "Corea del Sud" },
  { code: "LV", name: "Lettonia" },
  { code: "LT", name: "Lituania" },
  { code: "LU", name: "Lussemburgo" },
  { code: "MT", name: "Malta" },
  { code: "MX", name: "Messico" },
  { code: "MD", name: "Moldavia" },
  { code: "MC", name: "Monaco" },
  { code: "ME", name: "Montenegro" },
  { code: "MA", name: "Marocco" },
  { code: "NO", name: "Norvegia" },
  { code: "PL", name: "Polonia" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "SM", name: "San Marino" },
  { code: "RS", name: "Serbia" },
  { code: "SK", name: "Slovacchia" },
  { code: "SI", name: "Slovenia" },
  { code: "ZA", name: "Sudafrica" },
  { code: "SE", name: "Svezia" },
  { code: "TH", name: "Thailandia" },
  { code: "TR", name: "Turchia" },
  { code: "UA", name: "Ucraina" },
  { code: "VN", name: "Vietnam" }
];

export default function AutocompleteNazioni({ value, onChange }) {
  const [inputValue, setInputValue] = useState(value || "");
  const [showList, setShowList] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const filtered = nazioni.filter((n) =>
    n.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (name) => {
    setInputValue(name);
    setShowList(false);
    onChange(name);
  };

  return (
    <div className="relative">
      <input
        type="text"
        className="border p-2 rounded w-full"
        value={inputValue}
        placeholder="🌐 Seleziona stato"
        onFocus={() => setShowList(true)}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {showList && (
        <ul
          ref={listRef}
          className="absolute z-50 bg-white border rounded w-full max-h-60 overflow-y-auto shadow text-sm"
        >
          {filtered.map((nazione) => (
            <li
              key={nazione.code}
              onClick={() => handleSelect(nazione.name)}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            >
              <span>{toFlag(nazione.code)}</span>
              <span>{nazione.name}</span>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="p-2 text-gray-500 italic">Nessuna corrispondenza</li>
          )}
        </ul>
      )}
    </div>
  );
}
