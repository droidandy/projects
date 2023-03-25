// @flow

import Pagination from 'components/general/Pagination';
import DropdownNumber from 'components/general/DropdownNumber';

type PaginationBoxProps = {
  numberOfPages: number,
  paginationWidth: number,
  currentPageIndex: number
};

const perPageOptions: number[] = [10, 20, 30];

export default ({
  input: { value, onChange },
  numberOfPages,
  paginationWidth,
  currentPageIndex,
}: PaginationBoxProps) => (
  <div className="d-flex justify-content-end">
    <div className="mr-auto">
      <DropdownNumber
        values={perPageOptions}
        currentValue={value.perPageNumber || 10}
        toggle={perPageNumber => onChange({ ...value, perPageNumber })}
      />
    </div>
    <Pagination
      currentPageIndex={value.currentPageIndex || currentPageIndex}
      numberOfPages={numberOfPages}
      paginationWidth={paginationWidth}
      onClick={index => onChange({ ...value, currentPageIndex: index })}
    />
  </div>
);
