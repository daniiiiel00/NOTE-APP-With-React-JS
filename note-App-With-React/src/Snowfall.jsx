import React from "react";
import { motion } from "framer-motion";

const Snowfall = () => {
  // Create an array of 50 snowflakes
  const snowflakes = Array.from({ length: 50 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {snowflakes.map((_, i) => {
        // Randomize size, position, and duration for each flake
        const size = Math.random() * 5 + 2;
        const initialX = Math.random() * 100; // 0 to 100vw
        const duration = Math.random() * 10 + 5; // 5 to 15 seconds
        const delay = Math.random() * 10;

        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${initialX}vw`, opacity: 0 }}
            animate={{
              y: "110vh",
              opacity: [0, 1, 1, 0],
              x: [`${initialX}vw`, `${initialX + (Math.random() * 10 - 5)}vw`],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: size,
              height: size,
              backgroundColor: "white",
              borderRadius: "50%",
              filter: "blur(1px)",
              boxShadow: "0 0 10px white",
            }}
          />
        );
      })}
    </div>
  );
};

export default Snowfall;
