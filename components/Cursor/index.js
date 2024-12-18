import React, { useEffect, useState } from "react";
import AnimatedCursor from "react-animated-cursor";
import { useTheme } from "next-themes";

const Cursor = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensure hydration compatibility with Next.js
  }, []);

  // Dynamically set cursor color based on the theme
  const cursorColor = theme === "dark" ? "255, 255, 255" : "0, 0, 0";

  return (
    <>
      {isMounted && (
        <AnimatedCursor
          innerSize={8}
          outerSize={30}
          color={cursorColor} // RGB color values
          outerAlpha={0.4}
          innerScale={0.7}
          outerScale={1.5}
          clickables={["a", "button", ".link"]} // Interactive elements
        />
      )}
    </>
  );
};

export default Cursor;
