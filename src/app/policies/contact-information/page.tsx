import React from "react";
import { fetchAdminShopifyData } from "@/utils/shopify";

interface ContactInformation {
  shop: {
    name: string
    contactEmail: string
    billingAddress: {
      country: string
  }
  }
}

const Page = async () => {
  const contactInformationQuery = `query ContactInformation {
    shop {
      name
        contactEmail
        billingAddress {
          country
        }
    }
  }`

  const data: ContactInformation = await fetchAdminShopifyData(contactInformationQuery)
  console.log(data);

  return (
    <>
      <h1 className={"text-center pb-6"}>Contact Information</h1>
      <div className={"flex justify-center"}>
        <div className={"flex flex-col gap-4 justify-self-center"}>
          <p>Store Name: {data.shop.name}</p>
          <p>Email: {data.shop.contactEmail}</p>
          <p>Country: {data.shop.billingAddress.country}</p>
        </div>
      </div>
    </>
  );
};

export default Page;
