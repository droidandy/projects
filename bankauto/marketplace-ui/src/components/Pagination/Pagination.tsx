import React from 'react';
import MuiPagination, {
  PaginationProps as MuiPaginationProps,
  PaginationRenderItemParams,
} from '@material-ui/lab/Pagination';
import { PaginationButton } from './PaginationButton';
import { useStyles } from './Pagination.styles';

type PaginationProps = Pick<
  MuiPaginationProps,
  'page' | 'count' | 'onChange' | 'siblingCount' | 'boundaryCount' | 'disabled'
>;

const shownHoc = (
  currentPage: number,
  count: number,
  item: PaginationRenderItemParams,
): PaginationRenderItemParams | null => {
  const itemPage = item.page;
  const range = 3;
  const minRange = range + 1;
  const maxRange = count - range;
  if (itemPage) {
    if (itemPage === count || itemPage === 1) {
      return item;
    }
    if (currentPage < minRange) {
      return itemPage <= minRange ? item : null;
    }
    if (currentPage === minRange) {
      return itemPage === currentPage - 2 ? { ...item, type: 'start-ellipsis' } : item;
    }
    if (currentPage > maxRange) {
      return itemPage >= maxRange ? item : null;
    }
    if (currentPage === maxRange) {
      return itemPage === currentPage + 2 ? { ...item, type: 'end-ellipsis' } : item;
    }
    if (itemPage >= currentPage + 4 || itemPage <= currentPage - 4) {
      return null;
    }
  }
  return item;
};

export const Pagination = ({ page, count, onChange, disabled }: PaginationProps) => {
  const classes = useStyles();
  return (
    <MuiPagination
      classes={classes}
      count={count}
      page={page}
      disabled={disabled}
      onChange={onChange}
      renderItem={(item) => {
        const shownProps = shownHoc(page || 1, count || 1, item);
        return shownProps ? <PaginationButton {...shownProps} /> : null;
      }}
    />
  );
};
