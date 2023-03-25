// @flow
import React from 'react';
import styled from 'styled-components';

const size = 26;
const count = 5;

const StarRating = styled.div`
  unicode-bidi: bidi-override;
  color: #e6e7e8;
  font-size: ${size}px;
  line-height: ${size}px;
  height: ${size}px;
  width: ${size * count}px;
  margin: 0;
  position: relative;
  padding: 0;
`;

const StarRatingTop = styled.div`
  color: #fdb511;
  padding: 0;
  width: ${props => props.rating}%;
  position: absolute;
  z-index: 1;
  display: block;
  top: 0;
  left: 0;
  overflow: hidden;
  white-space: nowrap;
`;

const StarRatingBottom = styled.div`
  padding: 0;
  display: block;
  z-index: 0;
`;

const Star = styled.div`
  display: inline-block;
  width: ${size}px;
  height: 100%;
  text-align: center;
`;

export type RatingProps = {
  rating: number,
};

export default ({ rating }: RatingProps) =>
  <div>
    <StarRating>
      <StarRatingTop rating={rating}>
        <Star>★</Star>
        <Star>★</Star>
        <Star>★</Star>
        <Star>★</Star>
        <Star>★</Star>
      </StarRatingTop>
      <StarRatingBottom>
        <Star>★</Star>
        <Star>★</Star>
        <Star>★</Star>
        <Star>★</Star>
        <Star>★</Star>
      </StarRatingBottom>
    </StarRating>
  </div>;
