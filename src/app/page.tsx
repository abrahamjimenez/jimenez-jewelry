"use client";

import { Suspense, useEffect, useState } from "react";
import { fetchShopifyData } from "@/utils/shopify";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedProductsSkeleton from "@/components/FeaturedProductsSkeleton";
import { usePathname } from "next/navigation";

interface PriceRange {
  maxVariantPrice: {
    amount: string;
  };
  minVariantPrice: {
    amount: string;
  };
}

interface ProductNode {
  id: string;
  title: string;
  handle: string;
  images: ProductImages;
  priceRange: PriceRange;
}

interface ProductImagesEdges {
  node: {
    id: string;
    altText: string | null;
    url: string;
  };
}

interface ProductImages {
  edges: ProductImagesEdges[];
}

interface ProductEdge {
  node: ProductNode;
}

export type ProductData = ProductEdge[];

const FeaturedProductsLoader = () => {
  const [data, setData] = useState<ProductData>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const featuredProductsQuery = `{
        products(first: 8, sortKey: BEST_SELLING) {
          edges {
            node {
              id
              handle
              title
              images(first: 5) {
                edges {
                  node {
                    id
                    altText
                    url(transform: {maxHeight: 200, maxWidth: 200})
                  }
                }
              }
              priceRange {
                maxVariantPrice { amount }
                minVariantPrice { amount }
              }
            }
          }
        }
      }`;

      const { products } = await fetchShopifyData(featuredProductsQuery);
      setData(products.edges);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <FeaturedProductsSkeleton />;
  }

  return <FeaturedProducts data={data} />;
};

const Home = () => {
  return (
    <Suspense fallback={<FeaturedProductsSkeleton />}>
      <FeaturedProductsLoader />
    </Suspense>
  );
};

export default Home;
