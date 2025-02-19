import React from "react";

const Page = () => {
  return (
    <div>
      <h1>Your cart</h1>

      <div className={"flex justify-between"}>
        <p>Product</p>
        <p>Total</p>
      </div>

      <hr/>

      <img src={"https://jimenezjewelry.com/cdn/shop/files/IMG_0102.heic?v=1739766547&width=2890"} alt={"image"} width={300} height={300} />
      <p>14K 3C Fancy Hollow Earrings with Lever Back</p>
      <p>$300</p>
      <button>+1 | 1 | -1</button>
    </div>
  );
};

export default Page;
