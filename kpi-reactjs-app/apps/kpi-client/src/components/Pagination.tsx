import * as R from 'remeda';
import styled from 'styled-components';
import React from 'react';
import { rtlMargin } from 'shared/rtl';
import { LastIcon } from 'src/icons/LastIcon';
import { NextIcon } from 'src/icons/NextIcon';
import { PrevIcon } from 'src/icons/PrevIcon';
import { FirstIcon } from 'src/icons/FirstIcon';

interface PaginationProps {
  className?: string;
  total: number;
  current: number;
  pageSize: number;
  gotoPage: (page: number) => void;
}

const List = styled.ul`
  display: flex;
  padding-left: 0;
  list-style: none;
  border-radius: 4px;
`;

interface PageLinkProps {
  disabled?: boolean;
  active?: boolean;
  btn?: boolean;
}

const PageLink = styled.a<PageLinkProps>`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  min-width: 30px;
  border-radius: 3px;
  position: relative;
  font-size: 13px;
  line-height: 21px;
  font-weight: 500;
  transition: all 0.3s;
  color: #93a2dd;
  font-weight: 600;
  text-decoration: none;
  background: ${props => (props.btn ? `rgba(147, 162, 221, 0.12)` : null)};

  i {
    font-size: 0.6rem;
    text-align: center;
    display: inline-block;
  }

  &:hover {
    background: #10a6e9;
    color: #ffffff;
    cursor: pointer;
    svg {
      path {
        fill: #fff;
      }
    }
  }
  ${props =>
    props.disabled &&
    `
    pointer-events: none;
    cursor: auto;
    opacity: 0.3;`}
  ${props =>
    props.active &&
    `background: #10A6E9;
    color: #ffffff;`}
`;

const PageItem = styled.li`
  padding: 0;
  display: inline-block;
  ${rtlMargin(0, '5px')}
`;

const _Pagination = (props: PaginationProps) => {
  const { total, current, pageSize, gotoPage, className } = props;
  const totalPages = Math.ceil(total / pageSize);
  const canPrev = current > 0;
  const canNext = current + 1 < totalPages;
  const first = Math.max(0, current - 5);
  const last = Math.min(totalPages, current + 5);
  return (
    <div className={className}>
      <List>
        <PageItem>
          <PageLink btn disabled={!canPrev} onClick={() => gotoPage(0)}>
            <LastIcon />
          </PageLink>
        </PageItem>
        <PageItem>
          <PageLink
            btn
            disabled={!canPrev}
            onClick={() => gotoPage(current - 1)}
          >
            <NextIcon />
          </PageLink>
        </PageItem>
        {R.range(first, last).map(page => (
          <PageItem key={page} onClick={() => gotoPage(page)}>
            <PageLink active={current === page}>{page + 1}</PageLink>
          </PageItem>
        ))}

        <PageItem>
          <PageLink
            btn
            disabled={!canNext}
            onClick={() => gotoPage(current + 1)}
          >
            <PrevIcon />
          </PageLink>
        </PageItem>
        <PageItem>
          <PageLink
            btn
            disabled={!canNext}
            onClick={() => gotoPage(totalPages - 1)}
          >
            <FirstIcon />
          </PageLink>
        </PageItem>
      </List>
    </div>
  );
};

export const Pagination = styled(_Pagination)`
  display: block;
  user-select: none;
`;
