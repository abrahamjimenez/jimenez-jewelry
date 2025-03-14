import {
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { fetchShopifyData } from "@/utils/shopify";
import NavigationMenu from "@/components/NavigationMenu";
import Link from "next/link";

const Header = async () => {
  const query = `{
        shop {
            name
        }
    }`;
  let shopName = "Unknown";

  try {
    const { shop } = await fetchShopifyData(query);
    shopName = shop.name;
  } catch (error) {
    console.error("Failed to fetch shop name:", error);
  }

  return (
    <div className={"flex justify-between"}>
      <div>
        <NavigationMenu />
      </div>

      <Link href={"/"}><h2 className={"text-2xl"}>{shopName}</h2></Link>

      <div className={"flex gap-2"}>
        <div>
          <Link href={"/cart"}>
            <ShoppingBagIcon className={"size-6"} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
