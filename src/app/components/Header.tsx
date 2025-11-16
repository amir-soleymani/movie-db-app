import HeaderItem from "./HeaderItem";
import DarkModeSwitch from "./DarkModeSwitch";
import { HomeIcon, BoltIcon, UserIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const menuItems = [
    { title: "HOME", Icon: HomeIcon, param: "trending" },
    { title: "TOP RATED", Icon: BoltIcon, param: "topRated", cName: "mt-1" },
    { title: "ACCOUNT", Icon: UserIcon, param: "user" },
  ];

  return (
    <div className="flex justify-between items-center h-16 max-w-6xl mx-auto pt-5">
      {/* 1. Menu Items Container*/}
      <div className="flex gap-10 items-center">
        {menuItems.map(
          (
            item //loop through menu items array
          ) => (
            <HeaderItem
              key={item.param}
              title={item.title}
              Icon={item.Icon}
              param={item.param}
              cName={item.cName}
            />
          )
        )}
      </div>
      {/* 2. Logo/Branding */}
      <div className="flex gap-4 items-center">
        <div className="flex flex-col items-center group cursor-pointer w-12 sm:w-20 hover:text-white">
          <DarkModeSwitch />
        </div>
        <span className="text-2xl font-bold bg-amber-500 p-1 rounded-lg">
          IMDb
        </span>
        <span className="text-xl hidden sm:inline">Clone</span>
      </div>
    </div>
  );
}
