"use client";

import { ProductData } from "@/app/page";
import Image from "next/image";
import Link from "next/link";

const FeaturedProducts = ({ data }: { data: ProductData }) => {
  return (
    <div className="px-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((productEdge, i) => (
        <div className={"flex mx-auto"} key={productEdge.node.id}>
          <div
            key={productEdge.node.id}
            className="relative flex flex-col gap-3 group "
          >
            <div className="relative cursor-pointer">
              {/* Gold Image (default) */}
              <Link href={`/products/${productEdge.node.handle}`}>
                <Image
                  width={500}
                  height={500}
                  key={productEdge.node.images.edges[0].node.id}
                  src={productEdge.node.images.edges[0].node.url}
                  alt={
                    productEdge.node.images.edges[0].node.altText ??
                    productEdge.node.title
                  }
                  className="opacity-100 transition-opacity duration-300 ease-in-out"
                  priority={i === 0}
                />
              </Link>

              {/* Silver Image (shows on hover) */}
              {productEdge.node.images?.edges?.length > 1 && (
                <Link href={`/products/${productEdge.node.handle}`}>
                  {productEdge.node.images.edges[1] && (
                    <Image
                      width={500}
                      height={500}
                      key={productEdge.node.images.edges[1].node.id}
                      src={productEdge.node.images.edges[1].node.url}
                      alt={
                        productEdge.node.images.edges[1].node.altText ??
                        productEdge.node.title
                      }
                      className="absolute top-0 left-0 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
                    />
                  )}
                </Link>
              )}
            </div>
            <p className={"text-xs md:text-sm"}>{productEdge.node.title}</p>
            <p className={"font-bold text-xl md:text-2xl"}>
              {productEdge.node.priceRange.minVariantPrice.amount ===
              productEdge.node.priceRange.maxVariantPrice.amount
                ? `$${parseFloat(productEdge.node.priceRange.minVariantPrice.amount).toFixed(2)}`
                : `$${parseFloat(productEdge.node.priceRange.minVariantPrice.amount).toFixed(2)} - $${parseFloat(productEdge.node.priceRange.maxVariantPrice.amount).toFixed(2)}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;
