import React from "react";
import Image from "next/image";

const Page = () => {
  return (
    <div>
      <h1>Your cart</h1>

      <div className={"flex justify-between"}>
        <p>Product</p>
        <p>Total</p>
      </div>

      <hr/>

      <img src={"https://abrahamjimenez.myshopify.com/cdn/shop/files/ER-0020.jpg?v=1739554751&width=300"} alt={"image"} width={300} height={300} />
      <p>14K 3C Fancy Hollow Earrings with Lever Back</p>
      <p>$300</p>
      <button>+1 | 1 | -1</button>
    </div>
  );
};

export default Page;
