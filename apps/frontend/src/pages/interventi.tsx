import React from "react";
import RequireAuth from "../components/RequireAuth";

const Interventi = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Interventi</div>
    </RequireAuth>
  );
};

export default Interventi;
