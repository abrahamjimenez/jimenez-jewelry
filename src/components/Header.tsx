import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

// todo fix bad practice
const data = await fetch(process.env.STOREFRONT as string, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": process.env.ADMIN_ACCESS_TOKEN as string,
  },
  body: JSON.stringify({
    query: `{
              shop {
                  name
              }
          }`,
  }),
});

const {
  data: {
    shop: { name },
  },
} = await data.json();

console.log(name);

const Header = () => {
  return (
    <div className={"flex justify-between"}>
      <div className={"flex gap-2"}>
        <div>
          <Bars3Icon className={"size-6"} />
        </div>
        <p>{name}</p>
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
