"use client";

import { ProductData } from "@/app/page";
import Image from "next/image";

const FeaturedProducts = ({ data }: { data: ProductData }) => {
  return (
    <div className={"grid grid-cols-4"}>
      {data.map((productEdge, i) => (
        <div key={i}>
          <div key={productEdge.node.id}>
            <p>{productEdge.node.title}</p>
            {productEdge.node.images.edges.map((image) => (
              <Image
                width={500}
                height={500}
                key={image.node.id}
                src={image.node.url}
                alt={image.node.altText || productEdge.node.title}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;
