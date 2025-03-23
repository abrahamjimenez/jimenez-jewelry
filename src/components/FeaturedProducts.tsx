"use client";

import { ProductData } from "@/app/page";
import Image from "next/image";
import Link from "next/link";

const FeaturedProducts = ({ data }: { data: ProductData }) => {
  return (
    <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((productEdge, i) => {
        const { node } = productEdge;
        const {id, handle, title, priceRange, images } = node;
        const {edges} = images
        const primaryImage = edges[0]?.node
        // todo #5 Display secondary image on hover, add CSS effects too
        // const secondaryImage = edges[1]?.node
        const minPrice = parseFloat(priceRange.minVariantPrice.amount).toFixed(2)
        const maxPrice = parseFloat(priceRange.maxVariantPrice.amount).toFixed(2)

        return (
          <div className={"flex mx-auto"} key={id}>
            <div className="relative flex flex-col gap-3 group">
              <div className="relative cursor-pointer">
                <Link href={`/products/${handle}`}>
                  <Image
                    width={500}
                    height={500}
                    src={primaryImage?.url}
                    alt={primaryImage?.altText ?? title}
                    className="opacity-100 transition-opacity duration-300 ease-in-out"
                    priority={i === 0}
                  />
                </Link>
              </div>

              <p className={"text-xs md:text-sm"}>{title}</p>
              <p className={"font-bold text-xl md:text-2xl"}>{minPrice === maxPrice ? `$${minPrice}` : `$${minPrice}-$${maxPrice}`}</p>
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default FeaturedProducts;
