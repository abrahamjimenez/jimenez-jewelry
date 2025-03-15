"use client";

import React from "react";
import classes from "./ImageCarousel.module.css";
import { Carousel } from "@mantine/carousel";
import { Image as ImageMantine } from "@mantine/core";

const ImageCarousel = ({ images }: { images: string[] }) => {
  const slides = images.map((url) => (
    <Carousel.Slide key={url}>
      <ImageMantine src={url} />
    </Carousel.Slide>
  ));

  return (
    <Carousel withIndicators classNames={classes}>
      {slides}
    </Carousel>
  );
};

export default ImageCarousel;
