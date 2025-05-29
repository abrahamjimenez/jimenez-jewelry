import Link from "next/link";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { fetchShopifyData } from "@/utils/shopify";
import NavigationMenu from "@/components/NavigationMenu";
import HeaderLogo from "@/components/HeaderLogo";

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
  let shopName = "Unknown";

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
      <nav className={"flex self-center justify-self-start"}>
        <NavigationMenu />
      </nav>

      <div className={"lg:hidden"}>
        <HeaderLogo shopName={shopName} shopLogo={shopLogo} />
      </div>

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
