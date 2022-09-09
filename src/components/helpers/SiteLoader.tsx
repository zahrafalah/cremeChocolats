import * as React from "react";
import { AnimatedLogo } from "./AnimatedLogo";

export const SiteLoader = () => {
  const styles: React.CSSProperties = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#BB593B",
  };

  return (
    <div style={styles}>
      <AnimatedLogo width="300px" height="157px" />
    </div>
  );
};
