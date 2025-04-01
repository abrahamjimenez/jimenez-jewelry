import React from "react";
import { fetchShopifyData } from "@/utils/shopify";

interface RefundPolicy {
  shop: {
    refundPolicy: {
      title: string;
      url: string;
      body: string;
    };
  };
}

const Page = async () => {
  const refundPolicyQuery = `query GetRefundPolicy {
  shop {
    refundPolicy {
      title
      body
    }
  }
}
`;

  const data: RefundPolicy = await fetchShopifyData(
    refundPolicyQuery
  );

  return  <div className={"flex flex-col justify-center items-center"}>
    <div className={"max-w-screen-sm leading-10"}>
      <h1>{data.shop.refundPolicy.title}</h1>
      <div className={"leading-8"} dangerouslySetInnerHTML={{__html: data.shop.refundPolicy.body}} />
    </div>
  </div>;
};

export default Page;
