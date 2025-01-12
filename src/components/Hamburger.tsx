"use client";

import React, { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useDisclosure } from "@mantine/hooks";
import { Button, Drawer } from "@mantine/core";
import Link from "next/link";

// todo add interface for data
const Hamburger = ({ data }) => {
  const [openedDrawer, { open, close }] = useDisclosure(false);
  const [openedInnerDrawer, { open: openInner, close: closeInner }] =
    useDisclosure(false);
  const [innerData, setInnerData] = useState();

  // get title
  // find all data from that title
  // add it to inner drawer
  function updateInnerDrawer(title: string) {
    const result = data.items.find((item) => item.title === title);

    if (result) {
      console.log("Found:", result);
      setInnerData(result);
    } else {
      console.log("Not found");
    }
  }

  return (
    <>
      <Drawer opened={openedDrawer} onClose={close} size={"sm"}>
        {/* Looping over the first level of items */}
        <div>
          {data.items.map(
            (item: {
              title: string;
              items: { title: string }[];
              url: string;
            }) => (
              <div key={item.title}>
                {item.items.length > 0 ? (
                  <Button
                    className={"p-0"}
                    size={"compact-md"}
                    variant="transparent"
                    color={"black"}
                    onClick={() => {
                      openInner();
                      updateInnerDrawer(item.title);
                    }}
                  >
                    {item.title}
                  </Button>
                ) : (
                  <Link
                    href={item.url.replace(
                      process.env.NEXT_PUBLIC_SHOPIFY_URL as string,
                      "/"
                    )}
                    onClick={close}
                  >
                    {item.title}
                  </Link>
                )}

                {/* If there are sub-items, render them
                {item.items && item.items.length > 0 && (
                  <div className={"pl-4"}>
                    {item.items.map((subItem: { title: string }) => (
                      <div key={subItem.title}>
                        <p>{subItem.title}</p>
                      </div>
                    ))}
                  </div>
                )}*/}
              </div>
            )
          )}
        </div>

        <Drawer opened={openedInnerDrawer} onClose={closeInner} size={"sm"}>
          <p className={"font-bold"}>{innerData?.title}</p>

          <div>
            {innerData?.items.map((item) => (
              <Link
                className={"block"}
                key={item.url}
                href={item.url.replace(
                  process.env.NEXT_PUBLIC_SHOPIFY_URL as string,
                  "/"
                )}
                onClick={close}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/*{innerData?.items.length > 0 ? (
            <div>
              {innerData?.items.map((subItem: { title: string }) => (
                <div key={subItem.title}>
                  <p>{subItem.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {innerData?.items.map((subItem) => (
                <Link
                  key={subItem.url}
                  href={innerData.url.replace(
                    process.env.NEXT_PUBLIC_SHOPIFY_URL as string,
                    "/"
                  )}
                  onClick={close}
                >
                  {innerData?.title}
                </Link>
              ))}
            </div>
          )}*/}
        </Drawer>
      </Drawer>
      <Button
        className={"p-0"}
        size={"compact-md"}
        variant="transparent"
        color={"black"}
        onClick={open}
      >
        <Bars3Icon className={"size-6"} />
      </Button>
    </>
  );
};

export default Hamburger;
