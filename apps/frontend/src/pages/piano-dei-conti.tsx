import React from "react";
import RequireAuth from "../components/RequireAuth";

const Pianodeiconti = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Piano dei conti</div>
    </RequireAuth>
  );
};

export default Pianodeiconti;
