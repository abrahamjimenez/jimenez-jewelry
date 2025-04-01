import React from "react";
import { fetchShopifyData } from "@/utils/shopify";

interface TermsOfService {
  shop: {
    termsOfService: {
      title: string;
      body: string;
    };
  };
}

const Page = async () => {
  const termsOfServicePolicyQuery = `query GetTermsOfServicePolicy {
    shop {
      termsOfService {
        title
        body
      }
    }
  }`;

  const data: TermsOfService = await fetchShopifyData(
    termsOfServicePolicyQuery
  );

  return  <div className={"flex flex-col justify-center items-center"}>
    <div className={"max-w-screen-sm leading-10"}>
      <h1>{data.shop.termsOfService.title}</h1>
      <div className={"leading-8"} dangerouslySetInnerHTML={{__html: data.shop.termsOfService.body}} />
    </div>
  </div>;
};

export default Page;
