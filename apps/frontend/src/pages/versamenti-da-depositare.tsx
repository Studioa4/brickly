import React from "react";
import RequireAuth from "../components/RequireAuth";

const Versamentidadepositare = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Versamenti da depositare</div>
    </RequireAuth>
  );
};

export default Versamentidadepositare;
