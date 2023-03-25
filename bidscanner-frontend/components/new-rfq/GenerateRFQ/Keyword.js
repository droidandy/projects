// @flow
import React from 'react';
import styled from 'styled-components';
import { Badge } from 'reactstrap';

const MyBadge = styled(Badge)`
  margin-right: 0.3rem;
  background-color: #D9D9D9;
`;

export type KeywordT = string;

export type KeywordProps = {
  keyword: KeywordT
};

export default ({ keyword }: KeywordProps) => <MyBadge>{keyword}</MyBadge>;
