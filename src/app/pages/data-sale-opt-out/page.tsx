import React from "react";
import { fetchShopifyData } from "@/utils/shopify";

const Page = async () => {
  const DoNotSharePersonalInformationQuery = `query DoNotShareMyPersonalInformation {
    pageByHandle(handle: "data-sale-opt-out") {
      body
    }
  }`

  const data = await fetchShopifyData(DoNotSharePersonalInformationQuery)
  console.log(data);

  return <div>Do not sell my personal information</div>;
};

export default Page;
