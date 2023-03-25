// @flow
import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import {
  RightArrowWrapper,
  LeftArrowWrapper,
  CarouselImage,
  CarouselTitle,
  CarouselSubtitle,
} from 'components/styled/Carousel';

const SampleNextArrow = ({ onClick }) => (
  <RightArrowWrapper onClick={onClick}>
    <i className="fa fa-chevron-right" />
  </RightArrowWrapper>
);

const SamplePrevArrow = ({ onClick }) => (
  <LeftArrowWrapper onClick={onClick}>
    <i className="fa fa-chevron-left" />
  </LeftArrowWrapper>
);

const SvgIconWrapper = styled.div`
  width: 70px;
  height: 70px;
`;

export type CarouselProps = {
  items: Array<{
    image: string,
    title: string,
    subtitle: string,
  }>,
  slidesToShow?: number,
  color?: string,
};

export default ({ items, slidesToShow = 4, color, svgIcons }: CarouselProps) => {
  const settings = {
    dots: false,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <Slider {...settings}>
      {items.map((item, index) => {
        const Icon = item.image;
        return (
          <div key={`item-${index}-${item.name}`}>
            {svgIcons ? (
              <SvgIconWrapper>
                <Icon />
              </SvgIconWrapper>
            ) : (
              <CarouselImage src={item.image} alt="sample" />
            )}
            <CarouselTitle color={color}>{item.title}</CarouselTitle>
            <CarouselSubtitle color={color}>{item.subtitle}</CarouselSubtitle>
          </div>
        );
      })}
    </Slider>
  );
};
