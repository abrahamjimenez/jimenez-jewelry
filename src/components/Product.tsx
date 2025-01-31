"use client";

import { ColorSwatch, Group } from "@mantine/core";
import { useState } from "react";

const Product = ({
  colors,
}: {
  colors: Set<string | "Gold" | "White gold">;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <Group>
      {Array.from(colors).map((color, index) => (
        <div key={index}>
          <ColorSwatch
            color={
              color === "Gold"
                ? "gold"
                : color === "White gold"
                  ? "#f8f8f8"
                  : ""
            }
            withShadow={activeIndex === index}
            onClick={() => setActiveIndex(index)}
            style={{
              cursor: "pointer",
              border: activeIndex === index ? "2px solid black" : "none",
            }}
          />
        </div>
      ))}
    </Group>
  );
};

export default Product;
