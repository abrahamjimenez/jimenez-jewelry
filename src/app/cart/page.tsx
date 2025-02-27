"use client";

import React, { useEffect, useState } from "react";
import { fetchShopifyData } from "@/utils/shopify";

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
      <h1>Your cart</h1>
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
      <button>+1 | 1 | -1</button>

      {cartData && (
        <div>
         {cartData.cart.lines.edges.map((edge) => (
            <div key={edge.node.id}>
              <p>{edge.node.merchandise.product.title}</p>
              <p>{edge.node.quantity}</p>
              <p>{(parseFloat(edge.node.merchandise.price.amount) * edge.node.quantity).toFixed(2)}</p>
            </div>
          ))}

          <p>Estimaded Total: {parseFloat(cartData.cart.cost.totalAmount.amount).toFixed(2)}</p>
        </div>
      )}

      {cartData && (
        <pre>{JSON.stringify(cartData, null, 2)}</pre>
      )}
    </div>
  );
};

export default Page;
