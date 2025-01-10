"use client";

import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useDisclosure } from "@mantine/hooks";
import { Button, Drawer } from "@mantine/core";

// todo Send data here (navigation menu items from shopify)
const Hamburger = () => {
  const [openedDrawer, { open, close }] = useDisclosure(false);
  return (
    <>
      <Drawer opened={openedDrawer} onClose={close} size={"sm"}>
        {/*todo data displayed here*/}
        <p>Hello World</p>
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
