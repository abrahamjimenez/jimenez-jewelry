import React from "react";
import { fetchShopifyData } from "@/utils/shopify";
import * as cheerio from 'cheerio';

const extractText = (html: string) => {
  const $ = cheerio.load(html);
  $("link, meta, script, div").remove();
  return $('body').text().trim() || $.root().text().trim(); // Get text
};


const Page = async () => {
  const DoNotSharePersonalInformationQuery = `query DoNotShareMyPersonalInformation {
    pageByHandle(handle: "data-sale-opt-out") {
      body
    }
  }`

  const data = await fetchShopifyData(DoNotSharePersonalInformationQuery)
  console.log(data);

  const cleanedBody = extractText(data.pageByHandle.body);

  return <div>
    <p>Do not sell my personal information</p>
    <p>{cleanedBody}</p>
  </div>;
};

export default Page;
