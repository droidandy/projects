// @flow
import React from 'react';
import { Flex } from 'grid-styled';

import Keyword, { type KeywordT } from 'components/general/KeywordList/Keyword';

export type KeywordListProps = {
  keywords: KeywordT[],
};

export default ({ keywords }: KeywordListProps) =>
  <Flex wrap>
    {keywords.map(keyword => <Keyword key={keyword} keyword={keyword} />)}
  </Flex>;
