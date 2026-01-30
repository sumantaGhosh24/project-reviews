"use client";

import {type ReactNode} from "react";

import {cn} from "@/lib/utils";

interface ComponentWrapperProps {
  title: string;
  description: string;
  button?: ReactNode;
  search?: ReactNode;
  filter?: ReactNode;
  table?: ReactNode;
  className?: string;
}

const ComponentWrapper = ({
  title,
  description,
  button,
  search,
  filter,
  table,
  className,
}: ComponentWrapperProps) => {
  return (
    <div
      className={cn(
        "mx-auto my-20 w-[95%] rounded-md shadow-md p-5 bg-background dark:shadow-white/40",
        className
      )}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="text-left">
          <h2 className="mb-4 text-3xl font-bold">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
        {button && button}
      </div>
      {search && <div className="mb-8">{search}</div>}
      {filter && <div className="mb-8">{filter}</div>}
      {table && table}
    </div>
  );
};

export default ComponentWrapper;
