import React from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

const HeaderSkeleton = () => {
  return (
    <div
      className={
        "grid grid-cols-3 lg:grid-cols-2 justify-items-center items-center pt-6 px-4 animate-pulse"
      }
    >

      {/* Nav Menu */}
      <div className={"flex self-center justify-self-start"}>
        {/* Desktop Menu */}
        <div className={"flex gap-4 items-center justify-center"}>
          <div className={"hidden lg:block w-[100px] h-[100px] animate-pulse bg-gray-300"} />

          <div className={"flex gap-4"}>
            {Array.from({length: 4}).map((_, i) => (
              <div key={i} className={"w-[80px] h-6 animate-pulse bg-gray-300"} ></div>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={"lg:hidden "}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={"w-[20px] h-[2px] bg-gray-300 mb-1"}></div>
        ))}
        </div>
      </div>

      {/* Mobile Image */}
      <div className={"lg:hidden w-[100px] h-[100px] animate-pulse bg-gray-300"} />

      <div className={"flex gap-2 justify-self-end"}>
          <ShoppingBagIcon className={"size-8 text-gray-300 animate-pulse"} />
      </div>
    </div>
  );
};

export default HeaderSkeleton;
