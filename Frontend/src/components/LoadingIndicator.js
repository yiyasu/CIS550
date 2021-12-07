import React from "react";

function LoadingIndicator({ isLoading, children }) {
  return isLoading ? (
    <img
      alt="Loading..."
      src="https://gallega.com/wp-content/uploads/2019/08/gal-pinner.gif"
    />
  ) : (
    <div>{children}</div>
  );
}

export default LoadingIndicator;
