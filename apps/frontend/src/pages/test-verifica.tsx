import { useState } from "react";
import ModaleVerificaCodiceFiscaleAnagrafica from "@/components/modali/ModaleVerificaCodiceFiscaleAnagrafica";

export default function TestVerifica() {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test modale verifica CF</h1>

      <ModaleVerificaCodiceFiscaleAnagrafica
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={(cf, decoded, tipo) => {
          console.log("✅ SUCCESS:", { cf, decoded, tipo });
          setOpen(false);
        }}
      />
    </div>
  );
}
