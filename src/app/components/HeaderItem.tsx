import Link from "next/link";
import React from "react";

interface HeaderItemProps {
  title: string;
  Icon: React.ElementType;
  param?: string;
  href?: string;
  cName?: string;
}

export default function HeaderItem({
  title,
  Icon,
  param,
  href,
  cName,
}: HeaderItemProps) {
  const link = href ?? `/?genre=${param}`;

  return (
    <Link
      href={link}
      className={`flex flex-col items-center justify-center group cursor-pointer w-14 sm:w-28 hover:text-imdb-500 dark:hover:text-white pt-2 h-full ${
        cName ?? ""
      }`}
    >
      <div className="flex items-center justify-center h-8">
        <Icon className="h-8 mb-1 text-gray-800 dark:text-white group-hover:text-imdb-500 dark:group-hover:text-white group-hover:animate-bounce transition-colors duration-200" />
      </div>
      <p className="opacity-0 group-hover:opacity-100 tracking-widest text-center whitespace-nowrap transition-opacity duration-200">
        {title}
      </p>
    </Link>
  );
}
