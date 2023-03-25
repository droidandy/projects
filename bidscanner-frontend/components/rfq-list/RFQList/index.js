// @flow
import React from 'react';

import SearchContainer from 'containers/rfq-list/RFQList/SearchContainer';
import PaginationContainer from 'containers/rfq-list/RFQList/PaginationContainer';
import RFQList, { type RFQListProps } from 'components/rfq-list/RFQList/RFQList';

type Props = RFQListProps;

export default ({ rfqs }: Props) => (
  <div>
    <div className="mt-5">
      <SearchContainer />
    </div>
    <div className="mt-3">
      <RFQList rfqs={rfqs} />
    </div>
    <div className="mt-3">
      <PaginationContainer />
    </div>
  </div>
);
