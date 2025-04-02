import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { fetchShopifyData } from "@/utils/shopify";
import NavigationMenu from "@/components/NavigationMenu";
import Link from "next/link";
import Image from "next/image";

const Header = async () => {
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
  let shopLogo = "Unknown";
  let shopName = "Unknown"

  try {
    const { shop } = await fetchShopifyData(query);
    shopLogo = shop.brand.logo.image.url;
    shopName = shop.name;
  } catch (error) {
    console.error("Failed to fetch shop name:", error);
  }

  return (
    <div
      className={
        "grid grid-cols-3 lg:grid-cols-2 justify-items-center items-center pt-6 px-4"
      }
    >
      <div className={"flex self-center justify-self-start"}>
        <NavigationMenu />
      </div>

      <Link className={"lg:hidden items-center"} href={"/"}>
        <Image src={shopLogo} alt={shopName} width={100} height={100} priority />
      </Link>

      <div className={"flex gap-2 justify-self-end"}>
        <div className={"flex items-center"}>
          <Link href={"/cart"} aria-label={"Go to shopping cart"}>
            <ShoppingBagIcon className={"size-8"} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
