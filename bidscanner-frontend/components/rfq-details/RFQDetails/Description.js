// @flow
import React from 'react';
import { Flex } from 'grid-styled';

export type DescriptionProps = {
  description: string,
};

export default ({ description }: DescriptionProps) =>
  <Flex wrap>
    {description}
  </Flex>;
