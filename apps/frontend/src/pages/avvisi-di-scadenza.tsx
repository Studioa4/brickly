import React from "react";
import RequireAuth from "../components/RequireAuth";

const Avvisidiscadenza = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Avvisi di scadenza</div>
    </RequireAuth>
  );
};

export default Avvisidiscadenza;
