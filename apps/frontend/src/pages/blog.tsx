import React from "react";
import RequireAuth from "../components/RequireAuth";

const Blog = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Blog</div>
    </RequireAuth>
  );
};

export default Blog;
