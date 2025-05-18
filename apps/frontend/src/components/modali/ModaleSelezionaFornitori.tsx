import React, { useEffect, useRef, useState } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { ModaleAssegnaAdminStudio } from "./ModaleAssegnaAdminStudio";

export function ModaleSelezionaFornitori({ onClose, onCreati }: { onClose: () => void; onCreati: () => void }) {
  const tableRef = useRef(null);
  const tabulatorInstance = useRef<any>(null);
  const [studioCreato, setStudioCreato] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/fornitori-bd")
      .then((res) => res.json())
      .then((data) => {
        if (tableRef.current) {
          const tab = new Tabulator(tableRef.current, {
            data,
            layout: "fitColumns",
            height: "300px",
            selectable: 1,
            columns: [
              { formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", headerSort: false, width: 40 },
              { title: "Denominazione", field: "ragione_sociale", headerFilter: "input" },
              { title: "Codice Fiscale", field: "codice_fiscale", headerFilter: "input" },
              { title: "P.IVA", field: "partita_iva", headerFilter: "input" },
              { title: "Email", field: "email", headerFilter: "input" },
              { title: "PEC", field: "pec", headerFilter: "input" }
            ]
          });

          tabulatorInstance.current = tab;
        }
      });
  }, []);

  const creaStudio = async () => {
    const selezionati = tabulatorInstance.current?.getSelectedData() || [];

    if (selezionati.length === 0) {
      alert("⚠️ Seleziona un fornitore prima di procedere.");
      return;
    }

    const f = selezionati[0];

    try {
      const res = await fetch("/api/studi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          denominazione: f.ragione_sociale,
          codice_fiscale: f.codice_fiscale,
          p_iva: f.partita_iva,
          email: f.email,
          pec: f.pec,
          telefono: f.telefono,
          indirizzo: f.indirizzo,
          logo_url: "",
          comune: f.citta,
        }),
      });

      if (!res.ok) {
        if (res.status === 409) {
          alert("⚠️ Studio già esistente.");
        } else {
          alert("Errore creazione studio");
        }
        return;
      }

      const nuovoStudio = await res.json();
      setStudioCreato(nuovoStudio);
    } catch (error) {
      console.error("❌ Errore fetch studio:", error);
      alert("Errore nella richiesta.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-md w-[900px] max-h-[90vh] overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Seleziona un fornitore per creare uno studio</h2>
          <div ref={tableRef} />
          <div className="mt-4 text-right">
            <button className="bg-gray-300 px-4 py-2 rounded mr-2" onClick={onClose}>Annulla</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={creaStudio}>
              Crea Studio
            </button>
          </div>
        </div>
      </div>

      {studioCreato && (
        <ModaleAssegnaAdminStudio
          studio={studioCreato}
          onClose={() => setStudioCreato(null)}
          onSalvato={onCreati}
        />
      )}
    </>
  );
}
