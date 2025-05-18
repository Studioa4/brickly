import React from "react";
import RequireAuth from "../components/RequireAuth";

const Notaesplicativasintetica = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Nota esplicativa sintetica</div>
    </RequireAuth>
  );
};

export default Notaesplicativasintetica;
