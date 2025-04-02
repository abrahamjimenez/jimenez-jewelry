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
              {/* Mobile Image (200px) - Shown on screens < 768px */}
              <Image
                width={200}
                height={200}
                src={primaryImage?.smallImage}
                alt={primaryImage?.altText ?? `${title}-${i + 1}`}
                priority={i === 0}
                className="block md:hidden"
              />

              {/* Desktop Image (360px) - Shown on screens >= 768px */}
              <Image
                width={360}
                height={360}
                src={primaryImage.largeImage}
                alt={primaryImage?.altText ?? `${title}-${i + 1}`}
                priority={i === 0}
                className="hidden md:block"
              />

              <Image
                width={360}
                height={360}
                src={secondaryImage?.largeImage}
                alt=""
                className="hidden md:block hover-secondary-image"
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
