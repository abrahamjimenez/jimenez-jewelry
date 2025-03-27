"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchShopifyData } from "@/utils/shopify";
import { TrashIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { Button } from "@mantine/core";

interface CartData {
  cart: {
    id: string;
    checkoutUrl: string;
    lines: {
      edges: [
        {
          node: {
            id: string;
            quantity: number;
            merchandise: {
              id: string;
              title: string;
              image: {
                url: string;
                altText: string;
              };
              product: {
                title: string;
                handle: string;
                variants: {
                  nodes: [
                    {
                      id: string;
                      image: {
                        url: string;
                        altText: string;
                      };
                    },
                  ];
                };
              };
              price: {
                amount: string;
                currencyCode: string;
              };
            };
          };
        },
      ];
    };
    cost: {
      totalAmount: {
        amount: string;
        currencyCode: string;
      };
    };
  };
}

const Page = () => {
  const [cartId, setCartId] = useState<string | null>(null);
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [lineIdToRemove, setLineIdToRemove] = useState<string | null>(null);

  useEffect(() => {
    const storedCartId = localStorage.getItem("cartId");
    setCartId(storedCartId);
  }, []);

  useEffect(() => {
    if (!cartId) return;

    const fetchCartData = async () => {
      try {
        const cartInformationQuery = `query {
          cart(id: "${cartId}") { 
            id
            checkoutUrl
            lines(first: 50) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      image {
                        url
                        altText
                      }
                      product {
                        title
                        handle
                        variants(first: 10) {
                          nodes {
                            id
                            image {
                              url(transform: {maxHeight: 100, maxWidth: 100})
                              altText
                            }
                          }
                        }
                      }
                      price {
                        amount
                        currencyCode
                      }
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
        }`;

        const data = await fetchShopifyData(cartInformationQuery);
        setCartData(data);
      } catch (e) {
        console.error("Failed to fetch cart data", e);
      }
    };

    fetchCartData();
  }, [cartId, lineIdToRemove]);

  // Removes items from the cart (all of them)
  const handleTrashIconClick = async (lineId: string) => {
    const removeItemMutation = `mutation {
      cartLinesRemove(
        cartId: "${cartId}"
        lineIds: ["${lineId}"]
      ) {
        cart {
          id
          checkoutUrl
        }
      }
    }`;

    await fetchShopifyData(removeItemMutation);
    setLineIdToRemove(lineId);
  };

  return (
    <div className="mx-auto max-w-screen-lg p-4">
      {cartData && cartData.cart.lines.edges.length > 0 ? (
        <div>
          <h2>Your cart</h2>

          {/* Grid Header */}
          <div
            className={
              "small-text text-center grid grid-cols-[2fr_1fr_1fr_1fr]"
            }
          >
            <div className={"text-left"}>Product</div>
            <div>Quantity</div>
            <div>Total</div>
            <div>Remove</div>
          </div>

          <hr />

          {/* Cart Items Grid */}
          {cartData.cart.lines.edges.map((edge, i) => (
            <div
              key={edge.node.id}
              className="mb-5 grid items-center gap-4 grid-cols-[2fr_1fr_1fr_1fr] md:gap-6"
            >
              {/* Product Info */}
              <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
                <Image
                  src={edge.node.merchandise.image.url}
                  alt={
                    edge.node.merchandise.image.altText ||
                    edge.node.merchandise.product.title
                  }
                  height={100}
                  width={100}
                  priority={i === 0}
                />
                <Link
                  href={`/products/${edge.node.merchandise.product.handle}`}
                >
                  <p className="cart-product-title">
                    {edge.node.merchandise.product.title}
                  </p>
                </Link>
              </div>

              {/* Quantity */}
              <p className="text-center">{edge.node.quantity}</p>

              {/* Total Price */}
              <p className="text-center">
                $
                {(
                  parseFloat(edge.node.merchandise.price.amount) *
                  edge.node.quantity
                ).toFixed(2)}
              </p>

              {/* Remove (Trash Icon) */}
              <div className="text-center">
                <button
                  onClick={() => handleTrashIconClick(edge.node.id)}
                  className="hover:text-red-500"
                >
                  <TrashIcon className="mx-auto cursor-pointer size-6" />
                </button>
              </div>
            </div>
          ))}

          <hr />

          {/* Estimated Total */}
          <div className="grid grid-cols-2 items-end justify-end text-lg md:flex md:gap-6 md:text-xl">
            <p className={"small-text"}>Estimated Total</p>
            <p className="product-price text-right">
              ${parseFloat(cartData.cart.cost.totalAmount.amount).toFixed(2)}{" "}
              {cartData.cart.cost.totalAmount.currencyCode}
            </p>
          </div>

          <p className="extra-small-text">
            Taxes, discounts and shipping calculated at checkout.
          </p>

          <Link href={cartData.cart.checkoutUrl}>
            <Button fullWidth>Check out</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4 pt-40 text-center text-xl md:text-2xl">
          <h1>Your cart is empty</h1>
          <Link href={"/collections/earrings"}>
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page;
