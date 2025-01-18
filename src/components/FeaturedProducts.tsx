"use client";

import { ProductData } from "@/app/page";
import Image from "next/image";

const FeaturedProducts = ({ data }: { data: ProductData }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {data.map((productEdge, i) => (
        <div key={i} className="relative group">
          <div key={productEdge.node.id}>
            <div className="relative">
              {/* Gold Image (default) */}
              <Image
                width={500}
                height={500}
                key={productEdge.node.images.edges[0].node.id}
                src={productEdge.node.images.edges[0].node.url}
                alt={
                  productEdge.node.images.edges[0].node.altText ||
                  productEdge.node.title
                }
                className="transition-opacity duration-300 ease-in-out opacity-100"
              />

              {/* Silver Image (shows on hover) */}
              {productEdge.node.images.edges[1] && (
                <Image
                  width={500}
                  height={500}
                  key={productEdge.node.images.edges[1].node.id}
                  src={productEdge.node.images.edges[1].node.url}
                  alt={
                    productEdge.node.images.edges[1].node.altText ||
                    productEdge.node.title
                  }
                  className="transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 absolute top-0 left-0"
                />
              )}
            </div>
            <p>{productEdge.node.title}</p>
            <p>
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
