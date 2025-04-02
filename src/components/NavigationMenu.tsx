"use client"

import React, { useEffect, useState } from "react";
import { fetchShopifyData } from "@/utils/shopify";
import Hamburger from "@/components/Hamburger";
import DesktopMenu from "@/components/DesktopMenu";

export interface MenuInterface {
  items: Array<{
    title: string;
    url: string;
    items: Array<{
      title: string;
      url: string;
    }>;
  }>;
}

const NavigationMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuInterface>({ items: [] });

  useEffect(() => {
    const fetchMenuItems = async () => {
      const menuQuery = `{
        menu(handle: "main-menu") {
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

      try {
        const { menu } = await fetchShopifyData(menuQuery);
        if (menu?.items) {
          setMenuItems(menu);
        } else {
          console.error("Menu data is empty or undefined");
        }
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div>
      <div className={"lg:hidden"}>
        <Hamburger data={menuItems} />
      </div>
      <div className={"hidden lg:block"}>
        <DesktopMenu data={menuItems} />
      </div>
    </div>
  );
};

export default NavigationMenu;
