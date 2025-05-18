
import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import api from '../api/client';

const UtentiTable = () => {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);

  const fetchUtenti = async () => {
    const res = await api.get('/superadmin/utenti');
    setRowData(res.data);
  };

  useEffect(() => {
    fetchUtenti();
  }, []);

  const handleRoleChange = async (id: string, nuovoRuolo: string) => {
    try {
      await api.patch(`/superadmin/utenti/${id}`, { ruolo: nuovoRuolo });
      fetchUtenti();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Errore aggiornamento ruolo');
    }
  };

  const columnDefs = [
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Nome', field: 'nome', sortable: true, filter: true },
    { headerName: 'Cognome', field: 'cognome', sortable: true, filter: true },
    { headerName: 'Codice Fiscale', field: 'codice_fiscale', sortable: true, filter: true },
    {
      headerName: 'Ruolo',
      field: 'ruolo',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['superadmin', 'admin', 'operatore']
      },
      onCellValueChanged: (params: any) => {
        const { id } = params.data;
        const nuovoRuolo = params.newValue;
        if (nuovoRuolo !== params.oldValue) {
          handleRoleChange(id, nuovoRuolo);
        }
      }
    }
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        onGridReady={params => setGridApi(params.api)}
      />
    </div>
  );
};

export default UtentiTable;
