"use client";

import { useEffect, useState } from "react";
import { Group, Container, Menu } from "@mantine/core";
import { MenuInterface } from "@/components/NavigationMenu";
import Link from "next/link";
import { fetchShopifyData } from "@/utils/shopify";
import HeaderLogoDesktop from "@/components/HeaderLogoDesktop";

const DesktopMenu = ({ data }: { data: MenuInterface }) => {
  const [shopLogo, setShopLogo] = useState<string>("");
  const [shopName, setShopName] = useState<string>("");
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const query = `{
      shop {
        name
        brand {
            logo {
                image {
                  url(transform: {maxWidth: 100, maxHeight: 100})
                }
            }
        }
      }
    }`;

    const getShopName = async () => {
      try {
        const { shop } = await fetchShopifyData(query);
        setShopLogo(shop.brand.logo.image.url);
        setShopName(shop.name);
      } catch (error) {
        console.error("Failed to fetch shop name:", error);
      }
    };

    getShopName();
  }, []);

  return (
    <Container size="xl" py={"0"} px={"0"}>
      <Group>
        {/* Logo */}
        <div className={"w-[100px] h-[100px]"}>
          {shopLogo && shopName && (
            <HeaderLogoDesktop shopLogo={shopLogo} shopName={shopName} />
          )}
        </div>

        {/* Navigation */}
        <Group gap={"lg"}>
          {data.items.map((item) =>
            item.items.length > 0 ? (
              <Menu
                key={item.title}
                shadow="md"
                width={200}
                onOpen={() => setOpened(true)}
                onClose={() => setOpened(false)}
              >
                <Menu.Target>
                  <button
                    className={"text-black cursor-pointer"}
                    aria-haspopup={"menu"}
                    aria-expanded={"false"}
                  >
                    {item.title}{" "}
                    <span
                      className={`inline-block transition-transform duration-200 ease-in ${opened ? "rotate-180" : "rotate-0"}`}
                    >
                      ▼
                    </span>
                  </button>
                </Menu.Target>
                <Menu.Dropdown>
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.title}
                      className={"hover:underline"}
                      href={subItem.url.replace(
                        process.env.NEXT_PUBLIC_SHOPIFY_URL as string,
                        "/"
                      )}
                    >
                      <Menu.Item>{subItem.title}</Menu.Item>
                    </Link>
                  ))}
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Link
                key={item.title}
                href={item.url.replace(
                  process.env.NEXT_PUBLIC_SHOPIFY_URL as string,
                  "/"
                )}
                className={"p-1.5 hover:underline"}
              >
                {item.title}
              </Link>
            )
          )}
        </Group>
      </Group>
    </Container>
  );
};

export default DesktopMenu;
