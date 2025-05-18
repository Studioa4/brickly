import React from "react";
import RequireAuth from "../components/RequireAuth";

const CU = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – CU</div>
    </RequireAuth>
  );
};

export default CU;
