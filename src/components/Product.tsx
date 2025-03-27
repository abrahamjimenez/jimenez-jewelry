"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import classes from "./Product.module.css";
import { NumberInput, Button, Paper, NumberInputHandlers } from "@mantine/core";
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

const Product = ({ data }: { data: ProductData }) => {
  const productId = data.variants.nodes[0]?.id;
  const handlersRef = useRef<NumberInputHandlers>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const existingCartId = localStorage.getItem("cartId");
    if (existingCartId) {
      setCartId(existingCartId);
    }
  }, []);

  const handleAddToCart = useCallback(async () => {
    // Prevent multiple clicks
    if (loading) return;
    setLoading(true);

    try {
      let currentCartId = cartId;

      if (!currentCartId) {
        const createCartIdMutation = `
        mutation {
          cartCreate {
            cart {
              id
            }
          }
        }`;
        const cartData: CreateCartId =
          await fetchShopifyData(createCartIdMutation);
        currentCartId = cartData?.cartCreate?.cart?.id;

        if (!currentCartId) {
          console.error("Failed to create cart");
          return;
        }

        setCartId(currentCartId);
        localStorage.setItem("cartId", currentCartId);
        await new Promise((resolve) => setTimeout(resolve, 10)); // Ensures the state updates before proceeding
      }

      const addProductsToCartMutation = `
      mutation {
        cartLinesAdd(cartId: "${currentCartId}", lines: [{quantity: ${quantity}, merchandiseId: "${productId}"}]) {
          cart { id, checkoutUrl }
        }
      }`;

      const cartResponse: CartResponse = await fetchShopifyData(
        addProductsToCartMutation
      );
      const checkoutUrl = cartResponse?.cartLinesAdd?.cart?.checkoutUrl;

      if (checkoutUrl) {
        localStorage.setItem("checkoutUrl", checkoutUrl);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    } finally {
      setLoading(false);
    }
  }, [cartId, productId, quantity, loading]);

  const imageUrls: string[] = data.images.edges.map((map) => map.node.url);

  return (
    <div className={"p-4 sm:px-6 lg:p-8"}>
      <div
        className={
          "md:grid md:grid-cols-2 lg:grid-cols-[2fr_1fr] gap-10 mx-auto"
        }
      >
        <ImageCarousel images={imageUrls} />
        <div className={"pt-6 flex flex-col gap-4"}>
          <h1>{data.title}</h1>
          <p className={"product-price"}>
            $
            {parseFloat(data.variants.nodes[0]?.price.amount || "0").toFixed(2)}{" "}
            USD
          </p>
          <p className={"small-text"}>Quantity</p>

          <Paper
            p="md"
            withBorder
            className={"flex justify-center min-w-1/2 w-2/3"}
            classNames={classes}
          >
            <Button
              variant={"transparent"}
              onClick={() => handlersRef.current?.decrement()}
            >
              <MinusIcon className="size-6" />
            </Button>

            <NumberInput
              classNames={classes}
              handlersRef={handlersRef}
              min={1}
              max={data.variants.nodes[0]?.quantityAvailable}
              value={quantity}
              onChange={(value) => {
                if (typeof value === "number") {
                  setQuantity(value);
                }
              }}
              defaultValue={1}
              hideControls
            />
            <Button
              variant={"transparent"}
              onClick={() => handlersRef.current?.increment()}
            >
              <PlusIcon className="size-6" />
            </Button>
          </Paper>

          <p className={"small-text pt-4"}>
            {data.variants.nodes[0]?.quantityAvailable > 0
              ? `${data.variants.nodes[0]?.quantityAvailable} left in stock`
              : "Sold out"}
          </p>
          <Button
            disabled={
              loading || data.variants.nodes[0]?.quantityAvailable === 0
            }
            onClick={handleAddToCart}
            fullWidth
          >
            {loading ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Product;
