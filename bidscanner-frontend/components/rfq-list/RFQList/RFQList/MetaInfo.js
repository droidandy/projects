// @flow
import React from 'react';
import styled from 'styled-components';

const Icon = styled.div`
  & > i {
    margin-right: 5px;
  }

  margin-right: 10px;
  font-size: 0.8em;
  color: black;
  text-decoration: none;
`;

export type MetaInfoProps = {
  seenTimes: number,
  likedTimes: number
};

export default ({ seenTimes, likedTimes }: MetaInfoProps) => (
  <div className="mt-1 d-flex justify-content-center">
    <Icon><i className="fa fa-eye" aria-hidden="true" />{seenTimes}</Icon>
    <Icon><i className="fa fa-heart" aria-hidden="true" />{likedTimes}</Icon>
  </div>
);
