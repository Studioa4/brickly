import React from "react";
import RequireAuth from "../components/RequireAuth";

const Fatturedaregistrare = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Fatture da registrare</div>
    </RequireAuth>
  );
};

export default Fatturedaregistrare;
