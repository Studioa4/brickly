import React from "react";
import RequireAuth from "../components/RequireAuth";

const Movimentidaconfermare = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Movimenti da confermare</div>
    </RequireAuth>
  );
};

export default Movimentidaconfermare;
