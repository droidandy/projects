// @flow
import React from 'react';

import Keyword, { type KeywordT } from 'components/new-rfq/GenerateRFQ/Keyword';

export type KeywordListProps = {
  keywords: KeywordT[]
};

export default ({ keywords }: KeywordListProps) => (
  <div>
    {keywords.map(keyword => <Keyword key={keyword} keyword={keyword} />)}
  </div>
);
