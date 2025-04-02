"use client";

import React from "react";
import classes from "./ImageCarousel.module.css";
import { Carousel } from "@mantine/carousel";
import { Image as ImageMantine } from "@mantine/core";
import { Image } from "@/components/Product";

const ImageCarousel = ({ images }: { images: Image[] }) => {
  const slides = images.map(({ url, title }, i) => (
    <Carousel.Slide key={url}>
      <ImageMantine src={url} alt={`${title}-${i + 1}`} />
    </Carousel.Slide>
  ));

  return (
    <Carousel withControls={false} withIndicators classNames={classes}>
      {slides}
    </Carousel>
  );
};

export default ImageCarousel;
