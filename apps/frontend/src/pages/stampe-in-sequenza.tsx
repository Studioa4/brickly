import React from "react";
import RequireAuth from "../components/RequireAuth";

const Stampeinsequenza = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Stampe in sequenza</div>
    </RequireAuth>
  );
};

export default Stampeinsequenza;
