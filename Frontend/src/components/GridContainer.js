import React from "react";

function GridContainer({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {children}
    </div>
  );
}

export default GridContainer;
