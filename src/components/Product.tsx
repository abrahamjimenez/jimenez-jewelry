"use client";

import { useEffect, useRef, useState } from "react";
import {
  ColorSwatch,
  Group,
  NumberInput,
  Button,
  Paper,
  NumberInputHandlers,
} from "@mantine/core";
import { PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import { ProductData } from "@/app/products/[handle]/page";
import Image from "next/image";

const Product = ({
  colors,
  sizes,
  data,
}: {
  colors: Set<string>;
  sizes: Set<string>;
  data: ProductData;
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const handlersRef = useRef<NumberInputHandlers>(null);

  useEffect(() => {
    if (data.variants.nodes.length > 0) {
      const firstVariant = data.variants.nodes[0];
      const colorOption = firstVariant.selectedOptions.find(
        (opt) => opt.name === "Color"
      );
      const sizeOption = firstVariant.selectedOptions.find(
        (opt) => opt.name === "Ring size"
      );

      if (colorOption) setSelectedColor(colorOption.value);
      if (sizeOption) setSelectedSize(sizeOption.value);
    }
  }, [data.variants.nodes]); // Run when variants data changes

  const filteredVariant = data.variants.nodes.find(
    (variant) =>
      variant.selectedOptions.some(
        (opt) => opt.name === "Color" && opt.value === selectedColor
      ) &&
      variant.selectedOptions.some(
        (opt) => opt.name === "Ring size" && opt.value === selectedSize
      )
  );

  console.log(filteredVariant);

  return (
    <div>
      {filteredVariant ? (
        <div>
          <Image
            src={filteredVariant.image.url}
            alt={filteredVariant.image.altText || data.title}
            width={1000}
            height={1000}
            priority
          />
          <h1>{data.title}</h1>
          <p>Price: ${filteredVariant.price.amount}</p>
        </div>
      ) : (
        <div>
          <Image
            src={data.variants.nodes[0].image.url}
            alt={data.variants.nodes[0].image.altText || data.title}
            width={1000}
            height={1000}
            priority
          />
          <h1>{data.title}</h1>
          <p>Price: ${data.variants.nodes[0].price.amount}</p>
        </div>
      )}

      {filteredVariant && <p>Color:</p>}

      <Group>
        {Array.from(colors).map((color, index) => (
          <ColorSwatch
            key={index}
            color={
              color === "Gold"
                ? "gold"
                : color === "White gold"
                  ? "#f8f8f8"
                  : "#ccc"
            }
            withShadow={selectedColor === color}
            onClick={() => setSelectedColor(color)}
            style={{
              cursor: "pointer",
              border: selectedColor === color ? "2px solid black" : "none",
            }}
          />
        ))}
      </Group>

      <Paper p="md" withBorder>
        <Group>
          <Button
            variant={"transparent"}
            onClick={() => handlersRef.current?.decrement()}
            disabled={
              filteredVariant && filteredVariant.quantityAvailable === 0
            }
          >
            <MinusIcon className="size-6" />
          </Button>
          <NumberInput
            handlersRef={handlersRef}
            min={1}
            max={filteredVariant && filteredVariant.quantityAvailable}
            defaultValue={1}
            hideControls
            disabled={
              filteredVariant && filteredVariant.quantityAvailable === 0
            }
          />
          <Button
            variant={"transparent"}
            onClick={() => handlersRef.current?.increment()}
            disabled={
              filteredVariant && filteredVariant.quantityAvailable === 0
            }
          >
            <PlusIcon className="size-6" />
          </Button>
        </Group>
      </Paper>

      {filteredVariant && (
        <>
          <p>Sizes:</p>
          <Paper p="md" withBorder>
            <Group>
              {Array.from(sizes).map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "filled" : "outline"}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </Group>
          </Paper>
        </>
      )}

      {filteredVariant ? (
        <div>
          <p>
            {data.variants.nodes[0].quantityAvailable > 0
              ? "In Stock"
              : "Sold Out"}
          </p>
          <Button disabled={data.variants.nodes[0].quantityAvailable === 0}>
            Add to Cart
          </Button>
        </div>
      ) : (
        <div>
          <p>
            {data.variants.nodes[0].quantityAvailable > 0
              ? "In Stock"
              : "Sold Out"}
          </p>
          <Button disabled={data.variants.nodes[0].quantityAvailable === 0}>
            Add to Cart
          </Button>
        </div>
      )}
    </div>
  );
};

export default Product;
