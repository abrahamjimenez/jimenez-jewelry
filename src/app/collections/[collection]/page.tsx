import React from "react";
import { fetchShopifyData } from "@/utils/shopify";
import Image from "next/image";
import Link from "next/link";
import Combobox from "@/components/Combobox";

type CollectionData = {
  node: CollectionNode;
}[];

interface CollectionNode {
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
  options: [
    {
      id: string;
      name: string;
      optionValues: [
        {
          id: string;
          name: string;
        },
      ];
    },
  ];
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

  let data: CollectionData = [];
  try {
    const { collection } = await fetchShopifyData(collectionByHandleQuery);
    const { products } = collection;
    const { edges } = products;
    data = edges;
  } catch (e) {
    console.error("Failed to fetch collection data: ", e);
  }

  return (
    <div className={"p-2 sm:px-4 lg:p-0"}>
      <h1 className={"text-3xl md:text-4xl pl-4"}>
        {collectionHandle.charAt(0).toUpperCase() + collectionHandle.slice(1)}
      </h1>

      <div className={"px-4"}>
        <Combobox />
      </div>

      <div className="grid grid-cols-1 gap-6 px-4 pt-2 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((collection, index) => (
          <div
            key={collection.node.id}
            className={"relative group flex flex-col gap-3 group"}
          >
            {/* First Image (default) */}
            <Link href={`/products/${collection.node.handle}`}>
              <Image
                priority={index === 0}
                width={500}
                height={500}
                src={collection.node.images.nodes[0].url}
                alt={
                  collection.node.images.nodes[0].altText ??
                  collection.node.title
                }
                className={
                  "cursor-pointer transition-opacity duration-300 ease-in-out opacity-100"
                }
              />
            </Link>
            <p className={"text-xs md:text-sm"}>{collection.node.title}</p>
            <p className={"font-bold text-xl md:text-2xl"}>
              {collection.node.priceRange.minVariantPrice.amount ===
              collection.node.priceRange.maxVariantPrice.amount
                ? `$${parseFloat(collection.node.priceRange.minVariantPrice.amount).toFixed(2)}`
                : `$${parseFloat(collection.node.priceRange.minVariantPrice.amount).toFixed(2)} - $${parseFloat(collection.node.priceRange.maxVariantPrice.amount).toFixed(2)}`}
            </p>

            {/* Second Image (shows on hover) */}
            {collection.node.images?.nodes?.length > 1 && (
              <Link href={`/products/${collection.node.handle}`}>
                <Image
                  width={500}
                  height={500}
                  src={collection.node.images.nodes[1].url}
                  alt={
                    collection.node.images.nodes[1].altText ??
                    collection.node.title
                  }
                  className={
                    "cursor-pointer transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 absolute top-0 left-0"
                  }
                />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
