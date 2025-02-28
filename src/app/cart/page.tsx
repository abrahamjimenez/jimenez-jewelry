"use client";

import React, { useEffect, useState } from "react";
import { fetchShopifyData } from "@/utils/shopify";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/20/solid";

interface CartData {
  cart: {
    id: string
    lines: {
      edges: [
        {
          node: {
            id: string,
            quantity: number,
            merchandise: {
              id: string
              title: string
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
            lines(first: 50) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
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
  }, [cartId]);

  return (
    <div>
      {/*<h1>Your cart</h1>
      <div className="flex justify-between">
        <p>Product</p>
        <p>Total</p>
      </div>
      <hr />
      <img
        src="https://jimenezjewelry.com/cdn/shop/files/IMG_0102.heic?v=1739766547&width=2890"
        alt="image"
        width={300}
        height={300}
      />
      <p>14K 3C Fancy Hollow Earrings with Lever Back</p>
      <p>$300</p>
      <button>+1 | 1 | -1</button>*/}

      {cartData && (
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
          {cartData.cart.lines.edges.map((edge) => (
            <tr key={edge.node.id} className={"flex"}>
              <td className="flex">
                {edge.node.merchandise.product.variants.nodes.map((node) => (
                  <div key={node.id}>
                    <Image src={node.image.url} alt={node.image.altText || edge.node.merchandise.product.title} height={100} width={100} />
                  </div>
                ))}
                <p>{edge.node.merchandise.product.title}</p>
              </td>
              <td className={"flex"}>
                {edge.node.quantity}
                <TrashIcon className={"size-6"} />
              </td>
              <td>{(parseFloat(edge.node.merchandise.price.amount) * edge.node.quantity).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td>Estimated Total:</td>
            <td>{parseFloat(cartData.cart.cost.totalAmount.amount).toFixed(2)}</td>
          </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Page;
