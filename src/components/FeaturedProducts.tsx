"use client";

import { ProductData } from "@/app/page";
import Image from "next/image";
import Link from "next/link";

const FeaturedProducts = ({ data }: { data: ProductData }) => {
  return (
    <>
      <h1>Featured products</h1>

      <div className="product-grid">
        {data.map((productEdge, i) => {
          const { node } = productEdge;
          const { id, handle, title, priceRange, images } = node;
          const { edges } = images;
          const primaryImage = edges[0]?.node;
          const secondaryImage = edges[1]?.node;

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
              <Image
                width={300}
                height={300}
                sizes={
                  "(max-width: 768px) 200px, (max-width: 1024px) 240px, 300px"
                }
                src={primaryImage?.url}
                alt={primaryImage?.altText ?? `${title}-${i + 1}`}
                priority={i === 0}
                className={"hover-primary-image"}
              />

              <Image
                width={300}
                height={300}
                sizes={
                  "(max-width: 768px) 200px, (max-width: 1024px) 240px, 300px"
                }
                loading={"lazy"}
                src={secondaryImage?.url}
                alt={""}
                className={"hover-secondary-image"}
              />

              <p className="product-title">{title}</p>
              <p className="product-price">
                {minPrice === maxPrice
                  ? `$${minPrice}`
                  : `$${minPrice}-$${maxPrice}`}
              </p>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default FeaturedProducts;
