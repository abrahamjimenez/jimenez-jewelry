"use client";

import { useRef, useState } from "react";
import {
  ColorSwatch,
  Group,
  NumberInput,
  Button,
  Paper,
  NumberInputHandlers,
} from "@mantine/core";
import { PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import { VariantNodes } from "@/app/products/[handle]/page";

const Product = ({
  colors,
  variantNodes,
}: {
  colors: Set<string | "Gold" | "White gold">;
  variantNodes: VariantNodes[];
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const handlersRef = useRef<NumberInputHandlers>(null);

  console.log("NODES", variantNodes);
  return (
    <div>
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

      {/*  Input Buttons  */}
      <Paper p={"md"} withBorder>
        <Group className={"pt-2 pb-2"}>
          <Button
            variant={"transparent"}
            onClick={() => handlersRef.current?.decrement()}
          >
            <MinusIcon className={"size-6"} />
          </Button>

          <NumberInput
            handlersRef={handlersRef}
            hideControls
            // todo set dynamic min and max value
            min={1}
            max={20}
            defaultValue={1}
          />

          <Button
            variant={"transparent"}
            onClick={() => handlersRef.current?.increment()}
          >
            <PlusIcon className={"size-6"} />
          </Button>
        </Group>
      </Paper>

      {/* Ring Size Buttons */}
      {/* todo: When switching colors, update: ring sizes availability, images */}
      <div>
        {variantNodes.map((variant) => (
          <div key={variant.id}>
            {variant.selectedOptions.map((option) => (
              <div key={`${option.name} ${option.value}`}>
                <p>{option.value}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Paper p={"md"} withBorder>
        <Group gap="xs">
          <Button variant="default">First</Button>
          <Button variant="default">Second</Button>
          <Button variant="default">Third</Button>
        </Group>
      </Paper>
    </div>
  );
};

export default Product;
