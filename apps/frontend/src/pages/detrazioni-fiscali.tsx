import React from "react";
import RequireAuth from "../components/RequireAuth";

const Detrazionifiscali = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Detrazioni fiscali</div>
    </RequireAuth>
  );
};

export default Detrazionifiscali;
