"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const HeaderLogo = ({
  shopLogo,
  shopName,
}: {
  shopLogo: string;
  shopName: string;
}) => {
  const pathname = usePathname();

  return (
    <div className={"items-center"}>
      {pathname === "/" ? (
        <Image
          src={shopLogo}
          alt={shopName}
          width={100}
          height={100}
          priority
        />
      ) : (
        <Link
          href={"/"}
          aria-label={`Go to ${shopName} homepage`}
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <span className={"sr-only"}>Go to {shopName} homepage</span>
          <Image
            src={shopLogo}
            alt={shopName}
            width={100}
            height={100}
            priority
          />
        </Link>
      )}
    </div>
  );
};

export default HeaderLogo;
