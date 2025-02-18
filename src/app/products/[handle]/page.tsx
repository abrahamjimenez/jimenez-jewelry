import React from "react";
import { fetchShopifyData } from "@/utils/shopify";
import Product from "@/components/Product";

export interface ProductData {
  title: string;
  descriptionHtml: string;
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
    variants: { nodes: [] },
  };
  const uniqueColors = new Set<string>();
  const uniqueSizes = new Set<string>();

  try {
    const { product } = await fetchShopifyData(productByHandleQuery);
    data = product;

    console.log(data);

    data.variants.nodes.forEach((variant) => {
      variant.selectedOptions.forEach((option) => {
        if (option.name === "Color") uniqueColors.add(option.value);
        if (option.name === "Size") uniqueSizes.add(option.value);
      });
    });
  } catch (e) {
    console.error("Failed to fetch product data: ", e);
  }

  return (
    <div>
      <Product colors={uniqueColors} sizes={uniqueSizes} data={data} />
      <div dangerouslySetInnerHTML={{ __html: data.descriptionHtml }} />
    </div>
  );
};

export default Page;
