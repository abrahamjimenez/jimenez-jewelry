import React from "react";
import { fetchAdminShopifyData } from "@/utils/shopify";

interface ContactInformation {
  shop: {
    name: string;
    contactEmail: string;
    billingAddress: {
      country: string;
    };
  };
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
  }`;

  const data: ContactInformation = await fetchAdminShopifyData(
    contactInformationQuery
  );

  return (
    <div className={"flex flex-col justify-center items-center"}>
      <div className={"max-w-screen-sm leading-8"}>
        <h1>Do not sell or share my personal information</h1>
        <p>Store Name: {data.shop.name}</p>
        <p>Email: {data.shop.contactEmail}</p>
        <p>Country: {data.shop.billingAddress.country}</p>
      </div>
    </div>
  );
};

export default Page;
