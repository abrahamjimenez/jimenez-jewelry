import React from "react";
import { fetchShopifyData } from "@/utils/shopify";
import Product from "@/components/Product";

export interface ProductData {
  title: string;
  descriptionHtml: string;
  images: {
    edges: {
      node: {
        url: string;
        altText: string | null;
      };
    }[];
  };
  variants: {
    nodes: VariantNodes[];
  };
}

interface VariantNodes {
  id: string;
  price: {
    amount: string;
  };
  image: {
    url: string;
    altText: string;
  };
  selectedOptions: {
    name: string;
    value: string;
  }[];
  quantityAvailable: number;
}

const Page = async ({ params }: { params: Promise<{ handle: string }> }) => {
  const handle = (await params).handle;
  const productByHandleQuery = `{
    product(handle: "${handle}") {
      title
      descriptionHtml
      images (first: 50) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 100) {
        nodes {
          id
          price { amount }
          image { url altText }
          selectedOptions { name value }
          quantityAvailable
        }
      }
    }
  }`;

  let data: ProductData = {
    title: "",
    descriptionHtml: "",
    images: { edges: [] },
    variants: { nodes: [] },
  };

  try {
    const { product } = await fetchShopifyData(productByHandleQuery);
    data = product;
  } catch (e) {
    console.error("Failed to fetch product data: ", e);
  }

  return (
    <div>
      <Product data={data} />
      <div dangerouslySetInnerHTML={{ __html: data.descriptionHtml }} />
    </div>
  );
};

export default Page;
