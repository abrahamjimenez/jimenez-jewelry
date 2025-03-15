"use client";

import { useEffect, useRef, useState } from "react";
import classes from "./Product.module.css";
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
import { fetchShopifyData } from "@/utils/shopify";
import ImageCarousel from "@/components/ImageCarousel";

interface CreateCartId {
  cartCreate: {
    cart: {
      id: string;
    };
  };
}

interface CartResponse {
  cartLinesAdd: {
    cart: {
      id: string;
      checkoutUrl: string;
    };
  };
}

interface ColorMap {
  [key: string]: string;
}

const colorMap: ColorMap = {
  "Rose CZ": "#B76E79",
  "Black CZ": "#000000",
  "Blue CZ": "#005BD3",
  "Cyan CZ": "#2AEFC3",
  "Red CZ": "#FF0000",
  "White CZ": "#FFFFFF",
};

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
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const handlersRef = useRef<NumberInputHandlers>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (data.variants.nodes.length === 1) {
      const singleVariant = data.variants.nodes[0];
      setSelectedVariantId(singleVariant.id);
      const colorOption = singleVariant.selectedOptions.find(
        (opt) => opt.name === "Color"
      );
      const sizeOption = singleVariant.selectedOptions.find(
        (opt) => opt.name === "Size"
      );

      if (colorOption) setSelectedColor(colorOption.value);
      if (sizeOption) setSelectedSize(sizeOption.value);
    } else if (data.variants.nodes.length > 1) {
      const firstVariant = data.variants.nodes[0];
      const colorOption = firstVariant.selectedOptions.find(
        (opt) => opt.name === "Color"
      );
      const sizeOption = firstVariant.selectedOptions.find(
        (opt) => opt.name === "Size"
      );

      if (colorOption) setSelectedColor(colorOption.value);
      if (sizeOption) setSelectedSize(sizeOption.value);
    }
  }, [data.variants.nodes]);

  // This keeps track of the Size and Color. Uses find() to find the product variant id
  useEffect(() => {
    const filteredVariant = data.variants.nodes.find(
      (variant) =>
        variant.selectedOptions.some(
          (opt) => opt.name === "Color" && opt.value === selectedColor
        ) &&
        variant.selectedOptions.some(
          (opt) => opt.name === "Size" && opt.value === selectedSize
        )
    );

    if (filteredVariant) {
      setSelectedVariantId(filteredVariant.id);
    }
  }, [selectedSize, selectedColor, data.variants.nodes]);

  const createCartIdMutation = `mutation {
    cartCreate {
      cart {
        id
      }
    }
  }`;

  const handleAddToCart = async () => {
    const existingCartId = localStorage.getItem("cartId");

    // This runs once; creates cart with first items added
    // Then adds checkoutUrl to localStorage
    if (!existingCartId) {
      const cartData: CreateCartId =
        await fetchShopifyData(createCartIdMutation);
      const cartId = cartData.cartCreate.cart.id;
      localStorage.setItem("cartId", cartId);

      const addProductsToCartMutation = `mutation {
        cartLinesAdd(
          cartId: "${cartId}"
          lines: [{quantity: ${quantity}, merchandiseId: "${selectedVariantId}"}]
        ) {
          cart {
            id
            checkoutUrl
            lines(first: 10) {
              nodes {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                    }
                  }
                }
              }
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            code
            field
            message
          }
        }
      }`;

      const cartResponse: CartResponse = await fetchShopifyData(
        addProductsToCartMutation
      );
      localStorage.setItem(
        "checkoutUrl",
        cartResponse.cartLinesAdd.cart.checkoutUrl
      );

      return;
    }

    // Additional items get added to cart here
    const cartId = localStorage.getItem("cartId");

    const addProductsToCartMutation = `mutation {
        cartLinesAdd(
          cartId: "${cartId}"
          lines: [{quantity: ${quantity}, merchandiseId: "${selectedVariantId}"}]
        ) {
          cart {
            id
            checkoutUrl
            lines(first: 10) {
              nodes {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                    }
                  }
                }
              }
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            code
            field
            message
          }
        }
      }`;

    await fetchShopifyData(addProductsToCartMutation);
  };

  const imageUrls: string[] = data.images.edges.map((map) => map.node.url);

  return (
    <div className={"p-2 sm:px-4 lg:p-0"}>
      <div>
        {/*Image Carousel*/}
        <ImageCarousel images={imageUrls} />
        <h2 className={"text-xs"}>{data.title}</h2>
        <p className={"font-bold text-xl"}>
          Price: $
          {parseFloat(
            data.variants.nodes.find(
              (variant) => variant.id === selectedVariantId
            )?.price.amount ?? "0"
          ).toFixed(2)}
        </p>
      </div>

      {data.variants.nodes.length > 1 && <p>Color:</p>}

      <Group>
        {Array.from(colors).map((color, index) => (
          <ColorSwatch
            key={color + index}
            color={colorMap[color]}
            withShadow={selectedColor === color}
            onClick={() => setSelectedColor(color)}
            style={{
              cursor: "pointer",
              border: selectedColor === color ? "2px solid black" : "none",
            }}
          />
        ))}
      </Group>

      <Paper
        p="md"
        withBorder
        className={"flex justify-center"}
        classNames={classes}
      >
        <Group>
          <Button
            variant={"transparent"}
            onClick={() => handlersRef.current?.decrement()}
            disabled={
              data.variants.nodes.find(
                (variant) => variant.id === selectedVariantId
              )?.quantityAvailable === 0
            }
          >
            <MinusIcon className="size-6" />
          </Button>

          <NumberInput
            classNames={classes}
            handlersRef={handlersRef}
            min={1}
            max={
              data.variants.nodes.find(
                (variant) => variant.id === selectedVariantId
              )?.quantityAvailable
            }
            value={quantity}
            onChange={(value) => {
              if (typeof value === "number") {
                setQuantity(value);
              }
            }}
            defaultValue={1}
            hideControls
            disabled={
              data.variants.nodes.find(
                (variant) => variant.id === selectedVariantId
              )?.quantityAvailable === 0
            }
          />
          <Button
            variant={"transparent"}
            onClick={() => handlersRef.current?.increment()}
            disabled={
              data.variants.nodes.find(
                (variant) => variant.id === selectedVariantId
              )?.quantityAvailable === 0
            }
          >
            <PlusIcon className="size-6" />
          </Button>
        </Group>
      </Paper>

      {data.variants.nodes.length > 1 && (
        <>
          <p>Sizes:</p>
          <Paper p="md" withBorder>
            <Group>
              {Array.from(sizes)
                .sort((a, b) => a.localeCompare(b))
                .map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "filled" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    disabled={
                      !data.variants.nodes.some(
                        (variant) =>
                          variant.selectedOptions.some(
                            (opt) =>
                              opt.name === "Color" &&
                              opt.value === selectedColor
                          ) &&
                          variant.selectedOptions.some(
                            (opt) => opt.name === "Size" && opt.value === size
                          ) &&
                          variant.quantityAvailable > 0
                      )
                    }
                  >
                    {size}
                  </Button>
                ))}
            </Group>
          </Paper>
        </>
      )}

      {selectedVariantId ? (
        <div>
          <p>
            {(data.variants.nodes.find(
              (variant) => variant.id === selectedVariantId
            )?.quantityAvailable ?? 0) > 0
              ? "In Stock"
              : "Sold Out"}
          </p>
          <Button
            disabled={
              data.variants.nodes.find(
                (variant) => variant.id === selectedVariantId
              )?.quantityAvailable === 0
            }
            onClick={() => handleAddToCart()}
          >
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
          <Button
            disabled={data.variants.nodes[0].quantityAvailable === 0}
            onClick={() => handleAddToCart()}
          >
            Add to Cart
          </Button>
        </div>
      )}
    </div>
  );
};

export default Product;
