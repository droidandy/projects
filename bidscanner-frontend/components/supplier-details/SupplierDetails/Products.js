// @flow
import React from 'react';
import Carousel, { type CarouselProps } from 'components/general/Carousel';

export type ProductsProps = CarouselProps;

export default ({ products }: ProductsProps) => <Carousel items={products} />;
