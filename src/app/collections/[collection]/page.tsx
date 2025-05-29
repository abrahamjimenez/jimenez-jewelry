import React from "react";
import { fetchShopifyData } from "@/utils/shopify";
import Image from "next/image";
import Link from "next/link";
import Combobox from "@/components/Combobox";

interface CollectionData {
  collection: {
    title: string;
    products: {
      edges: Array<{
        node: {
          handle: string;
          id: string;
          title: string;
          totalInventory: number;
          images: {
            nodes: CollectionImagesNodes[];
          };
          priceRange: {
            maxVariantPrice: {
              amount: string;
            };
            minVariantPrice: {
              amount: string;
            };
          };
        };
      }>;
    };
  };
}

interface CollectionImagesNodes {
  url: string;
  altText: string | null;
}

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ sortKey?: string }>;
}) => {
  const collectionHandle = (await params).collection;
  const sortKey = (await searchParams)?.sortKey ?? "BEST_SELLING";

  const collectionByHandleQuery = `{
    collection(handle: "${collectionHandle}") {
      title
      products(first: 100, sortKey: ${sortKey}) {
        edges {
          node {
            handle
            id
            title
            options {
              id
              name
              optionValues {
                id
                name
              }
            }
            images(first: 5) {
              nodes {
                url(transform: {maxHeight: 500, maxWidth: 500})
                altText
              }
            }
            priceRange {
              maxVariantPrice {
                amount
              }
              minVariantPrice {
                amount
              }
            }
            totalInventory
          }
        }
      }
    }
  }`;

  let data: CollectionData = {
    collection: {
      title: "",
      products: {
        edges: [],
      },
    },
  };

  try {
    data = await fetchShopifyData(collectionByHandleQuery);
  } catch (e) {
    console.error("Failed to fetch collection data: ", e);
  }

  return (
    <>
      <h1>{data.collection.title}</h1>

      <div
        className={
          "flex flex-col-reverse md:flex-row justify-between md:justify-end items-end md:items-center gap-2"
        }
      >
        <Combobox />
        <p className={"text-sm text-gray-500"}>
          {data.collection.products.edges.length} products
        </p>
      </div>

      <div className="product-grid">
        {data.collection.products.edges.map((collection, i) => {
          const { node } = collection;
          const { id, handle, title, priceRange, images } = node;
          const { nodes: imageNodes } = images;
          const primaryImage = imageNodes[0];
          const secondaryImage = imageNodes[1];

          const minPrice = parseFloat(
            priceRange.minVariantPrice.amount
          ).toFixed(2);
          const maxPrice = parseFloat(
            priceRange.maxVariantPrice.amount
          ).toFixed(2);

          return (
            <Link
              href={`/products/${handle}`}
              key={id}
              className={"hover-image-parent group"}
            >
              {/* First Image (default) */}
              <Image
                width={500}
                height={500}
                src={primaryImage?.url}
                alt={primaryImage?.altText ?? `${title}-${i + 1}`}
                priority={i === 0}
                className={"hover-primary-image"}
              />

              {/* Second Image (shows on hover) */}
              {secondaryImage && (
                <Image
                  width={500}
                  height={500}
                  src={secondaryImage?.url}
                  alt={""}
                  className={"hover-secondary-image"}
                />
              )}

              <p className="product-title">{title}</p>
              <p className="product-price">
                {minPrice === maxPrice
                  ? `$${minPrice}`
                  : `$${minPrice} - $${maxPrice}`}
              </p>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Page;
