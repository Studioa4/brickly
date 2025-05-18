import { useEffect, useRef } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';

export function ImpostazioniTable({ data, onEditClick }: { data: any[]; onEditClick: (utente: any) => void }) {
  const tableRef = useRef(null);

  useEffect(() => {
    if (tableRef.current) {
      const table = new Tabulator(tableRef.current, {
        data,
        layout: 'fitColumns',
        height: 'auto',
        columns: [
          { title: 'Nome', field: 'nome_reale', headerFilter: 'input' },
          { title: 'Cognome', field: 'cognome', headerFilter: 'input' },
          { title: 'Studio', field: 'nome_studio', headerFilter: 'input' },
          { title: 'Alias', field: 'alias_nome', headerFilter: 'input' },
          { title: 'Ruolo', field: 'ruolo', headerFilter: 'input' },
          {
            title: 'Attivo',
            field: 'attivo',
            headerFilter: 'select',
            headerFilterParams: { values: { true: "Attivo", false: "Non attivo" } },
            formatter: cell => cell.getValue() ? "✔️" : "❌"
          },
          {
            title: 'Permessi',
            field: 'permessi',
            headerFilter: false,
            formatter: cell => Object.keys(cell.getValue() || {}).join(', ')
          },
          {
            title: 'Azioni',
            formatter: () => '<button class="btn">✏️</button>',
            width: 90,
            hozAlign: 'center',
            headerFilter: false,
            cellClick: (e, cell) => {
              const utente = cell.getRow().getData();
              onEditClick(utente);
            }
          }
        ]
      });

      return () => table.destroy();
    }
  }, [data, onEditClick]);

  return <div ref={tableRef} />;
}
