import React from "react";
import RequireAuth from "../components/RequireAuth";

const IndiciISA = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Indici ISA</div>
    </RequireAuth>
  );
};

export default IndiciISA;
