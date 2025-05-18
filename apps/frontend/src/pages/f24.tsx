import React from "react";
import RequireAuth from "../components/RequireAuth";

const F24 = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – F24</div>
    </RequireAuth>
  );
};

export default F24;
