"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchShopifyData } from "@/utils/shopify";
import { TrashIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { Button } from "@mantine/core";

interface CartData {
  cart: {
    id: string
    checkoutUrl: string
    lines: {
      edges: [
        {
          node: {
            id: string,
            quantity: number,
            merchandise: {
              id: string
              title: string
              image: {
                url: string
                altText: string
              }
              product: {
                title: string
                handle: string
                variants: {
                  nodes: [
                    {
                      id: string
                      image: {
                        url: string
                        altText: string
                      }
                    }
                  ]
                }
              }
              price: {
                amount: string
                currencyCode: string
              }
            }
          }
        }
      ]
    },
    cost: {
      totalAmount: {
        amount: string,
        currencyCode: string
      }
    }
  }
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
    }`

    await fetchShopifyData(removeItemMutation)
    setLineIdToRemove(lineId)
  }

  return (
    <div>
      {cartData && cartData.cart.lines.edges.length > 0 ? (
        <div>
        <table>
          <caption>Your cart</caption>

          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
          {cartData.cart.lines.edges.map((edge, i) => (
            <tr key={edge.node.id}>
              <td className="flex items-center gap-2">
                <Image
                  src={edge.node.merchandise.image.url}
                  alt={edge.node.merchandise.image.altText || edge.node.merchandise.product.title}
                  height={100}
                  width={100}
                  priority={i === 0}
                />
                <Link href={`/products/${edge.node.merchandise.product.handle}`}>
                  <p className={"hover:underline"}>{edge.node.merchandise.product.title}</p>
                </Link>
              </td>
              <td className="text-center">{edge.node.quantity}</td>
              <td className="text-center">
                ${(parseFloat(edge.node.merchandise.price.amount) * edge.node.quantity).toFixed(2)}
              </td>
              <td>
                <button onClick={() => handleTrashIconClick(edge.node.id)}>
                  <TrashIcon className="size-6 cursor-pointer" />
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={3} className="text-right font-semibold">Estimated Total:</td>
            <td className="font-semibold">${parseFloat(cartData.cart.cost.totalAmount.amount).toFixed(2)}</td>
          </tr>
          </tbody>
        </table>

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
