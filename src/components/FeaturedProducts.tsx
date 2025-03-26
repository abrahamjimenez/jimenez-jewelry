"use client";

import { ProductData } from "@/app/page";
import Image from "next/image";
import Link from "next/link";

const FeaturedProducts = ({ data }: { data: ProductData }) => {
  return (
    <>
      <h2 className="text-2xl pb-4">Featured products</h2>

      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6"
      >
        {data.map((productEdge, i) => {
          const { node } = productEdge;
          const { id, handle, title, priceRange, images } = node;
          const { edges } = images;
          const primaryImage = edges[0]?.node;

          const minPrice = parseFloat(priceRange.minVariantPrice.amount).toFixed(2);
          const maxPrice = parseFloat(priceRange.maxVariantPrice.amount).toFixed(2);

          return (
            <Link
              href={`/products/${handle}`}
              key={id}
            >
              <Image
                width={300}
                height={300}
                src={primaryImage?.url}
                alt={primaryImage?.altText ?? title}
                priority={i === 0}
              />

              <p className="mt-2 font-semibold">{title}</p>
              <p className="text-gray-700">
                {minPrice === maxPrice ? `$${minPrice}` : `$${minPrice}-$${maxPrice}`}
              </p>
            </Link>
          );
        })}
      </div>
    </>
  );

};

export default FeaturedProducts;
