import React from "react";

// components/FeaturedProductsSkeleton.tsx
const FeaturedProductsSkeleton = () => {
  const gridItems = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <>
      {/* Skeleton for the page title */}
      <div className="h-6 bg-gray-300 w-1/2 animate-pulse mb-6"></div>

      <div className="product-grid">
        {/* Looping to create skeletons for 8 product items */}
        {gridItems.map((item) => (
          <div key={item} className={"mb-2"}>
            {/* Skeleton for image */}
            <div className="aspect-square bg-gray-300 animate-pulse mb-2"></div>

            {/* Skeleton for title */}
            <div className="h-4 bg-gray-300 w-3/4 animate-pulse mb-2"></div>

            {/* Skeleton for price */}
            <div className="h-4 bg-gray-300 w-1/2 animate-pulse"></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FeaturedProductsSkeleton;
