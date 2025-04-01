import React from "react";
import { fetchShopifyData } from "@/utils/shopify";
import { load } from "cheerio";

const extractText = (html: string) => {
  const $ = load(html);
  $("link, meta, script").remove();

  // Replace div with p
  $("div").each(function () {
    const text = $(this).text().trim();
    if (text) {
      $(this).replaceWith(`<p>${text}</p>`);
    } else {
      $(this).remove();
    }
  });

  return $.html("body").trim();
};

const Page = async () => {
  const DoNotSharePersonalInformationQuery = `query DoNotShareMyPersonalInformation {
    pageByHandle(handle: "data-sale-opt-out") {
      body
    }
  }`;

  const data = await fetchShopifyData(DoNotSharePersonalInformationQuery);
  const cleanedBody = extractText(data.pageByHandle.body);

  return (
    <div className={"flex flex-col justify-center items-center"}>
      <div className={"max-w-screen-sm"}>
        <h1>Do not sell or share my personal information</h1>
        <div
          className={"flex flex-col gap-4 leading-8"}
          dangerouslySetInnerHTML={{ __html: cleanedBody }}
        />
      </div>
    </div>
  );
};

export default Page;
