import React from 'react';

import * as s from './Logo.styles';

type Props = {
  description: string;
};

export const Logo = ({ description }: Props): JSX.Element => <s.Text>{description}</s.Text>;
