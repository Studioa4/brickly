import React from "react";
import RequireAuth from "../components/RequireAuth";

const Provinceecomuni = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Province e comuni</div>
    </RequireAuth>
  );
};

export default Provinceecomuni;
