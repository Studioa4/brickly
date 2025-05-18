import React from "react";
import RequireAuth from "../components/RequireAuth";

const Riepilogofinanziario = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Riepilogo finanziario</div>
    </RequireAuth>
  );
};

export default Riepilogofinanziario;
