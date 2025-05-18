import React from "react";
import RequireAuth from "../components/RequireAuth";

const Fatturedaconfermare = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Fatture da confermare</div>
    </RequireAuth>
  );
};

export default Fatturedaconfermare;
