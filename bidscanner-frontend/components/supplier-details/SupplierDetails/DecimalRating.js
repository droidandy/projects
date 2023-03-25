// @flow
import React from 'react';
import styled from 'styled-components';

const StarRating = styled.div`
  unicode-bidi: bidi-override;
  color: #c5c5c5;
  font-size: 16px;
  height: 25px;
  width: 80px;
  margin: 0;
  position: relative;
  padding: 0;
  text-shadow: 0px 1px 0 #a2a2a2;
`;

const StarRatingTop = styled.div`
  color: #e7711b;
  padding: 0;
  width: ${props => props.rating}%;
  position: absolute;
  z-index: 1;
  display: block;
  top: 0;
  left: 0;
  overflow: hidden;
`;

const StarRatingBottom = styled.div`
  padding: 0;
  display: block;
  z-index: 0;
`;

export type RatingProps = {
  rating: number,
};

export default ({ rating }: RatingProps) =>
  <div>
    <StarRating>
      <StarRatingTop rating={rating}>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </StarRatingTop>
      <StarRatingBottom>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </StarRatingBottom>
    </StarRating>
  </div>;
