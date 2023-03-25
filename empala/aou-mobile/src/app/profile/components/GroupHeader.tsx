import React from 'react';

import * as s from '../module.styles';

type Props = {
  text: string;
};

export const GroupHeader = ({ text }: Props): JSX.Element => (
  <s.GroupHeader>{text}</s.GroupHeader>
);
