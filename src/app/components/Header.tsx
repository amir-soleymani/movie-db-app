"use client";

import HeaderItem from "./HeaderItem";
import DarkModeSwitch from "./DarkModeSwitch";
import {
  HomeIcon,
  BoltIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  const menuItems = [
    { title: "HOME", Icon: HomeIcon, param: "trending" },
    { title: "TOP RATED", Icon: BoltIcon, param: "topRated" },
    { title: "FAVORITES", Icon: StarIcon, href: "/favorite" },
  ];

  return (
    <header className="bg-white dark:bg-night-900 border-b border-gray-200 dark:border-night-600 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4 text-gray-900 dark:text-gray-200">
        {/* LEFT: navigation */}
        <nav className="flex items-center gap-8">
          {menuItems.map((item) => (
            <HeaderItem
              key={item.param || item.href}
              title={item.title}
              Icon={item.Icon}
              param={item.param}
              href={item.href}
            />
          ))}
        </nav>

        {/* RIGHT: controls */}
        <div className="flex items-center gap-4">
          {/* Dark mode */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-night-800 hover:bg-gray-200 dark:hover:bg-night-700 transition-colors cursor-pointer">
            <DarkModeSwitch />
          </div>

          {/* Search */}
          <form action="/search" className="hidden sm:block">
            <input
              name="query"
              placeholder="Search..."
              className="
                px-3 py-1.5 w-40 sm:w-56
                rounded-full
                bg-white dark:bg-night-800
                border border-imdb-500 dark:border-night-600
                text-sm text-black dark:text-gray-100
                placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-imdb-500 focus:border-imdb-500
              "
              autoComplete="off"
            />
          </form>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold bg-imdb-500 text-black px-3 py-1 rounded-lg shadow-md shadow-imdb-600/30">
              Film
            </span>
            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-200">
              Vault
            </span>
          </div>

          {/* User: login / avatar */}
          {session ? (
            <img
              src={session.user?.image || ""}
              alt="user"
              className="w-9 h-9 rounded-full border border-gray-200 dark:border-night-600 cursor-pointer hover:opacity-80 transition"
              onClick={() => signOut()}
            />
          ) : (
            <button
              type="button"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 dark:border-night-600 text-gray-700 dark:text-gray-200 hover:text-[#F5C518] hover:border-[#F5C518] transition"
              onClick={() => signIn("google")}
            >
              <UserIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
