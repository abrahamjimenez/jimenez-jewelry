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
      <div className="p-4 max-w-screen-lg mx-auto">
        {cartData && cartData.cart.lines.edges.length > 0 ? (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold pb-6">Your cart</h2>

              {/* Grid Header */}
              <div className="grid grid-cols-4 text-xs md:text-sm text-gray-600 mb-2">
                <div>Product</div>
                <div className="text-center">Quantity</div>
                <div className="text-center">Total</div>
                <div className="text-center">Remove</div>
              </div>

              <hr className="pb-6" />

              {/* Cart Items Grid */}
              {cartData.cart.lines.edges.map((edge, i) => (
                  <div
                      key={edge.node.id}
                      className="grid grid-cols-4 items-center gap-4 md:gap-6 mb-5"
                  >
                    {/* Product Info */}
                    <div className="flex items-center gap-2">
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
                      <Link href={`/products/${edge.node.merchandise.product.handle}`}>
                        <p className="hover:underline">{edge.node.merchandise.product.title}</p>
                      </Link>
                    </div>

                    {/* Quantity */}
                    <div className="text-center">{edge.node.quantity}</div>

                    {/* Total Price */}
                    <div className="text-center">
                      $
                      {(
                          parseFloat(edge.node.merchandise.price.amount) *
                          edge.node.quantity
                      ).toFixed(2)}
                    </div>

                    {/* Remove (Trash Icon) */}
                    <div className="text-center">
                      <button
                          onClick={() => handleTrashIconClick(edge.node.id)}
                          className="hover:text-red-600"
                      >
                        <TrashIcon className="cursor-pointer size-6 mx-auto" />
                      </button>
                    </div>
                  </div>
              ))}

              <hr />

              {/* Estimated Total */}
              <div className="mt-4 grid grid-cols-2 items-end md:gap-6 pb-3 text-lg md:text-xl text-gray-700">
                <div className="font-light text-xs text-gray-600">Estimated Total</div>
                <div className="text-right">
                  ${parseFloat(cartData.cart.cost.totalAmount.amount).toFixed(2)}{" "}
                  {cartData.cart.cost.totalAmount.currencyCode}
                </div>
              </div>

              <p className="pb-2 text-xs font-light text-gray-500 text-center">
                Taxes, discounts and shipping calculated at checkout.
              </p>

              <Link href={cartData.cart.checkoutUrl}>
                <Button fullWidth>Check out</Button>
              </Link>
            </div>
        ) : (
            <div className="text-center text-xl md:text-2xl flex flex-col gap-4 pt-40">
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
