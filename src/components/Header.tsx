import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
  return (
    <div className={"flex justify-between"}>
      <div className={"flex gap-2"}>
        <div>
          <Bars3Icon className={"size-6"} />
        </div>
        <p>Joyeria La Perla</p>
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
