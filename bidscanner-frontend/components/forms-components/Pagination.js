// @flow

import Pagination from 'components/general/Pagination';

type PaginationBoxProps = {
  numberOfPages: number,
  paginationWidth: number,
};

export default ({ input: { value, onChange }, numberOfPages, paginationWidth }: PaginationBoxProps) =>
  <div className="d-flex justify-content-end">
    <Pagination
      currentPageIndex={value}
      numberOfPages={numberOfPages}
      paginationWidth={paginationWidth}
      onClick={index => onChange(index)}
    />
  </div>;
