import React from "react";
import { fetchShopifyData } from "@/utils/shopify";
import Link from "next/link";

interface FooterMenu {
  menu: {
    items: Array<{
      title: string;
      url: string;
      items: Array<{
        title: string;
        url: string;
      }>;
    }>;
  };
}

const Footer = async () => {
  const footerMenuQuery = `query FooterMenu {
  menu(handle: "footer") {
    items {
      title
      url
      items {
        title
        url
      }
    }
  }
}`;
  let data: FooterMenu | null = null;
  try {
    data = await fetchShopifyData(footerMenuQuery);
  } catch (error) {
    console.error("Failed to fetch footer menu:", error);
  }

  return (
    <div
      className={" px-4 text-gray-600 flex flex-col gap-4 py-4 md:py-6 lg:py-8"}
    >
      <Link href={"/"} className={"text-sm text-gray-800"}>
        © {new Date().getFullYear()}, Jimenez Jewelry
      </Link>

      <div className={"flex flex-col gap-6 text-xs "}>
        {data?.menu.items.map((item) => {
          const { title, url, items: subItems } = item;

          return (
            <ul key={url} className={"list-disc list-inside"}>
              <Link href={url}>{title}</Link>

              {subItems?.map((subItem) => {
                const { title: subTitle, url: subUrl } = subItem;

                return (
                  <li key={subUrl}>
                    <Link href={subUrl}>{subTitle}</Link>
                  </li>
                );
              })}
            </ul>
          );
        })}
      </div>

      {/*<pre>{JSON.stringify(data, null, 2)}</pre>*/}
    </div>
  );
};

export default Footer;
