import React from "react";

const Page = async ({
  params,
}: {
  params: Promise<{ collection: string }>;
}) => {
  const collection = (await params).collection;
  // todo Find a query that will use the collection name and fetch the corresponding data w/ postman
  // display the data in a flex & flex wrap

  // todo Add filter & sort button
  return (
    <div>
      <h1>Dynamic Page</h1>
      <p>{collection}</p>
      {/* todo displayed data */}
      {/* image, title, price*/}
    </div>
  );
};

export default Page;
