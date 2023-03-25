import React from 'react';

import * as s from './Header.styles';

type Props = {
  title: string;
  subtitle: string;
  showSubtitle?: boolean;
};

export const Header = ({ title, subtitle, showSubtitle = true }: Props): JSX.Element => (
  <s.Container>
    <s.Label>{title}</s.Label>
    {showSubtitle && <s.Text>{subtitle}</s.Text>}
  </s.Container>
);
