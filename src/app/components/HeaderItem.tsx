// src/components/HeaderItem.tsx
import Link from "next/link";
import React from "react";

interface HeaderItemProps {
  title: string;
  Icon: React.ElementType;
  param: string;
  cName?: string;
}

export default function HeaderItem({
  title,
  Icon,
  param,
  cName,
}: HeaderItemProps) {
  return (
    <Link
      href={`/?genre=${param}`}
      className={`flex flex-col items-center justify-center group cursor-pointer w-14 sm:w-28 hover:text-white pt-2 h-full ${
        cName ?? ""
      }`}
    >
      <div className="flex items-center justify-center h-8">
        <Icon className="h-8 group-hover:animate-bounce" />
      </div>
      <p className="opacity-0 group-hover:opacity-100 tracking-widest text-center whitespace-nowrap">
        {title}
      </p>
    </Link>
  );
}
