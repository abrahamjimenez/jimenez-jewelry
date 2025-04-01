import React from "react";
import { fetchShopifyData } from "@/utils/shopify";

interface PrivacyPolicy {
  shop: {
    privacyPolicy: {
      title: string;
      body: string;
    };
  };
}

const Page = async () => {
  const privacyPolicyQuery = `query GetPrivacyPolicy {
    shop {
      privacyPolicy {
        title
        body
      }
    }
  }`;

  const data: PrivacyPolicy = await fetchShopifyData(privacyPolicyQuery);

  return (
    <div className={"flex flex-col justify-center items-center"}>
      <div className={"max-w-screen-sm leading-10"}>
        <h1>{data.shop.privacyPolicy.title}</h1>
        <div
          className={"leading-8"}
          dangerouslySetInnerHTML={{ __html: data.shop.privacyPolicy.body }}
        />
      </div>
    </div>
  );
};

export default Page;
