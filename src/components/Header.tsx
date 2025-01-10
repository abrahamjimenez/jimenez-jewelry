import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { fetchShopifyData } from "@/utils/shopify";

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
    console.log("Failed to fetch shop name:", error);
  }

  return (
    <div className={"flex justify-between"}>
      <div className={"flex gap-2"}>
        <div>
          <Bars3Icon className={"size-6"} />
        </div>
        <p>{shopName}</p>
      </div>

      <div className={"flex gap-2"}>
        <div>
          <MagnifyingGlassIcon className={"size-6"} />
        </div>
        <div>
          <ShoppingBagIcon className={"size-6"} />
        </div>
      </div>
    </div>
  );
};

export default Header;
