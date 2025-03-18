"use client";

import React, { useState } from "react";
import {
  Bars3Icon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useDisclosure } from "@mantine/hooks";
import { Button, Drawer } from "@mantine/core";
import { MenuInterface } from "@/components/NavigationMenu";
import Link from "next/link";

interface InnerMenuInterface {
  title: string;
  url: string;
  items: [{ title: string; url: string }];
}

const Hamburger = ({ data }: { data: MenuInterface }) => {
  const [openedDrawer, { open, close }] = useDisclosure(false);
  const [openedInnerDrawer, { open: openInner, close: closeInner }] =
    useDisclosure(false);
  const [innerData, setInnerData] = useState<InnerMenuInterface>();

  // get title
  // find all data from that title
  // add it to inner drawer
  function updateInnerDrawer(title: string) {
    const result: InnerMenuInterface | undefined = data.items.find(
      (item) => item.title === title
    );

    if (result) {
      console.log("Found:", result);
      setInnerData(result);
    } else {
      console.log("Not found");
    }
  }

  function resetDrawer() {
    closeInner();
    close();
  }

  return (
    <>
      <Drawer
        opened={openedDrawer}
        onClose={close}
        size={"sm"}
        styles={{ body: { padding: 0 } }}
        closeButtonProps={{
          icon: <XMarkIcon className={"size-8 text-gray-400"} />,
        }}
      >
        {/* Looping over the first level of items */}
        <div className={"pl-2"}>
          {data.items.map(
            (item: {
              title: string;
              items: { title: string }[];
              url: string;
            }) => (
              <div
                key={item.title}
                className={"p-2 cursor-pointer hover:bg-gray-100 "}
              >
                {item.items.length > 0 ? (
                  <Button
                    size={"compact-md"}
                    color={"black"}
                    variant="transparent"
                    onClick={() => {
                      openInner();
                      updateInnerDrawer(item.title);
                    }}
                    styles={{
                      root: { padding: 0 },
                      label: { fontWeight: "normal", width: "100%" },
                    }}
                  >
                    <div className={"flex items-center cursor-pointer"}>
                      {item.title}
                      <ArrowRightIcon className={"size-4 ml-2"} />
                    </div>
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
              </div>
            )
          )}
        </div>

        <Drawer
          opened={openedInnerDrawer}
          onClose={resetDrawer}
          size={"sm"}
          styles={{ body: { padding: 0 } }}
          closeButtonProps={{
            icon: <XMarkIcon className={"size-8 text-gray-400"} />,
          }}
        >
          <div>
            <button
              onClick={closeInner}
              className={"font-bold flex items-center cursor-pointer p-2"}
            >
              <ArrowLeftIcon className={"size-4 mr-2 text-gray-500"} />
              <p className={"text-xs text-gray-500"}>{innerData?.title}</p>
            </button>
          </div>

          <div className={"flex flex-col"}>
            {innerData?.items.map((item) => (
              <p
                key={item.url}
                className={"p-2 cursor-pointer hover:bg-gray-100"}
              >
                <Link
                  href={item.url.replace(
                    process.env.NEXT_PUBLIC_SHOPIFY_URL as string,
                    "/"
                  )}
                  onClick={resetDrawer}
                >
                  {item.title}
                </Link>
              </p>
            ))}
          </div>
        </Drawer>
      </Drawer>
      <Button
        className={"p-0"}
        size={"compact-md"}
        variant="transparent"
        color={"black"}
        onClick={open}
        styles={{ root: { padding: 0, border: 0 } }}
      >
        <Bars3Icon className={"size-8"} />
      </Button>
    </>
  );
};

export default Hamburger;
