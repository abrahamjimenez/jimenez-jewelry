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
                width={360}
                height={360}
                src={primaryImage?.url}
                alt={primaryImage?.altText ?? `${title}-${i + 1}`}
                priority={i === 0}
                loading={"eager"}
                quality={50}
                className={"hover-primary-image"}
              />

              <Image
                width={360}
                height={360}
                src={secondaryImage?.url}
                alt={""}
                loading={"lazy"}
                quality={50}
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
