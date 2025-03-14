"use client"

import React from "react";
import { Carousel } from '@mantine/carousel';
import { Image as ImageMantine } from '@mantine/core';

const ImageCarousel = ({ images }: {images: string[]}) => {
  const slides = images.map((url) => (
    <Carousel.Slide key={url}>
      <ImageMantine src={url} />
    </Carousel.Slide>
  ));

  return <Carousel withIndicators>{slides}</Carousel>;
};

export default ImageCarousel;
