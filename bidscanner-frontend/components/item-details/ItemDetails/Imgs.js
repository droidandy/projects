// @flow
import React from 'react';
import Slider from 'react-slick';

export type ImgsProps = {
  pictures: any[],
};

export default ({ pictures }: ImgsProps) =>
  <Slider arrows={false} autoplay={false} slidesToShow={1} dots>
    {pictures.map((picture, idx) => <img key={idx} src={picture.url} alt="preview" />)}
  </Slider>;
