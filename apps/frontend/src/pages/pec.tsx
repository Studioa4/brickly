import React from "react";
import RequireAuth from "../components/RequireAuth";

const PEC = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – PEC</div>
    </RequireAuth>
  );
};

export default PEC;
