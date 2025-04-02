import { Suspense } from "react";
import { fetchShopifyData } from "@/utils/shopify";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedProductsSkeleton from "@/components/FeaturedProductsSkeleton";

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
    smallImage: string;
    largeImage: string;
  };
}

interface ProductImages {
  edges: ProductImagesEdges[];
}

interface ProductEdge {
  node: ProductNode;
}

export type ProductData = ProductEdge[];

const FeaturedProductsLoader = async () => {
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
                smallImage: url(transform: {maxHeight: 200, maxWidth: 200})
                largeImage: url(transform: {maxHeight: 360, maxWidth: 360})
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
  const data = products.edges;

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
