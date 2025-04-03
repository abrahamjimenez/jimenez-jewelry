import React from "react";

const FooterSkeleton = () => {
  const footerLinks = [1, 2, 3];

  return (
    <div
      className={" px-4 text-gray-600 flex flex-col gap-4 py-4 md:py-6 lg:py-8"}
    >
      <div className={"w-1/2 h-6 animate-pulse bg-gray-300 mb-2"}></div>

      {footerLinks.map((link) => (
        <div key={link} className={"w-1/3 h-4 animate-pulse bg-gray-300"}></div>
      ))}
    </div>
  );
};

export default FooterSkeleton;
