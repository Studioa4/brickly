import React from "react";
import RequireAuth from "../components/RequireAuth";

const Dossier = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Dossier</div>
    </RequireAuth>
  );
};

export default Dossier;
