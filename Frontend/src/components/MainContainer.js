import React from "react";

function MainContainer({ children, width }) {
  return (
    <div
      style={{
        width: width ? width : "90%",
        maxWidth: "760",
        margin: "1.5rem auto 0 auto",
      }}
    >
      {children}
    </div>
  );
}

export default MainContainer;
