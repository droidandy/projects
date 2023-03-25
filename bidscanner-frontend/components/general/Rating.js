// @flow
import React from 'react';
import styled from 'styled-components';

import type { Rating } from 'context/types';

const Stars = styled.span`
  background-color: black;
  color: white;
  padding-right: 0.3rem;
  padding-left: 0.3rem;
  margin-right: 10px;
  margin-left: 3px;
`;

export type RatingProps = {
  rating: Rating
};

export default ({ rating }: RatingProps) => {
  const complement = 5 - rating;
  const stars = new Array(rating).fill(true);
  const emptyStars = new Array(complement).fill(false);
  return (
    <Stars>
      {[...stars, ...emptyStars].map(
        star =>
          (star
            ? <i className="fa fa-star-o" aria-hidden="true" />
            : <i className="fa fa-star" aria-hidden="true" />)
      )}
    </Stars>
  );
};
