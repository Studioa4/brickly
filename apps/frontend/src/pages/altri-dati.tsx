import React from "react";
import RequireAuth from "../components/RequireAuth";

const Altridati = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Altri dati</div>
    </RequireAuth>
  );
};

export default Altridati;
