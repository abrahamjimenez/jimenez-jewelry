import React from "react";

const FooterSkeleton = () => {
  return (
    <div
      className={" px-4 text-gray-600 flex flex-col gap-4 py-4 md:py-6 lg:py-8"}
    >
      <div className={"w-1/2 h-6 animate-pulse bg-gray-300 mb-2"}></div>

      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={"w-1/3 h-4 animate-pulse bg-gray-300"}></div>
      ))}
    </div>
  );
};

export default FooterSkeleton;
