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
      <div className={"p-4"}>
        {cartData && cartData.cart.lines.edges.length > 0 ? (
            <div>
              <h2 className={"text-2xl font-bold"}>Your cart</h2>

              <div className="flex font-semibold mb-2">
                <div className="w-1/2">Product</div>
                <div className="w-1/4 text-center">Quantity</div>
                <div className="w-1/4 text-center">Total</div>
              </div>

              <hr className={"pb-6"}/>

              {cartData.cart.lines.edges.map((edge, i) => (
                  <div key={edge.node.id} className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 w-1/2">
                      <Image
                          src={edge.node.merchandise.image.url}
                          alt={edge.node.merchandise.image.altText || edge.node.merchandise.product.title}
                          height={100}
                          width={100}
                          priority={i === 0}
                      />
                      <Link href={`/products/${edge.node.merchandise.product.handle}`}>
                        <p className={"hover:underline"}>
                          {edge.node.merchandise.product.title}
                        </p>
                      </Link>
                    </div>
                    <div className="text-center w-1/4">{edge.node.quantity}</div>
                    <div className="text-center w-1/4">
                      $
                      {(
                          parseFloat(edge.node.merchandise.price.amount) *
                          edge.node.quantity
                      ).toFixed(2)}
                    </div>
                    <div>
                      <button onClick={() => handleTrashIconClick(edge.node.id)}>
                        <TrashIcon className="cursor-pointer size-6" />
                      </button>
                    </div>
                  </div>
              ))}

              <div className="flex justify-between mt-4 font-semibold">
                <div>Estimated Total:</div>
                <div>
                  $
                  {parseFloat(cartData.cart.cost.totalAmount.amount).toFixed(2)}
                </div>
              </div>

              <Link href={cartData.cart.checkoutUrl}>
                <Button>Check out</Button>
              </Link>
            </div>
        ) : (
            <div>
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
