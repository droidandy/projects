import * as R from 'remeda';
import styled from 'styled-components';
import React from 'react';
import { rtlMargin } from 'shared/rtl';

interface PaginationProps {
  total: number;
  current: number;
  pageSize: number;
  gotoPage: (page: number) => void;
}

const Wrapper = styled.nav`
  display: block;
  user-select: none;
`;
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
  height: 2.25rem;
  min-width: 2.25rem;
  padding: 0.5rem;
  border-radius: 3px;
  position: relative;
  font-size: 1rem;
  line-height: 1rem;
  font-weight: 500;
  transition: all 0.3s;
  color: #93a2dd;
  text-decoration: none;
  background: ${props => (props.btn ? '#f0f3ff' : null)};

  i {
    font-size: 0.6rem;
    text-align: center;
    display: inline-block;
  }

  &:hover {
    background: #5d78ff;
    color: #ffffff;
    cursor: pointer;
  }
  ${props =>
    props.disabled &&
    `
    pointer-events: none;
    cursor: auto;
    opacity: 0.3;`}
  ${props =>
    props.active &&
    `background: #5d78ff;
    color: #ffffff;`}
`;

const PageItem = styled.li`
  padding: 0;
  display: inline-block;
  ${rtlMargin(0, '5px')}
`;

export function Pagination(props: PaginationProps) {
  const { total, current, pageSize, gotoPage } = props;
  const totalPages = Math.ceil(total / pageSize);
  const canPrev = current > 0;
  const canNext = current + 1 < totalPages;
  const first = Math.max(0, current - 5);
  const last = Math.min(totalPages, current + 5);
  return (
    <Wrapper>
      <List>
        <PageItem>
          <PageLink btn disabled={!canPrev} onClick={() => gotoPage(0)}>
            <i className="flaticon2-fast-back" />
          </PageLink>
        </PageItem>
        <PageItem>
          <PageLink
            btn
            disabled={!canPrev}
            onClick={() => gotoPage(current - 1)}
          >
            <i className="flaticon2-back" />
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
            <i className="flaticon2-next" />
          </PageLink>
        </PageItem>
        <PageItem>
          <PageLink
            btn
            disabled={!canNext}
            onClick={() => gotoPage(totalPages - 1)}
          >
            <i className="flaticon2-fast-next" />
          </PageLink>
        </PageItem>
      </List>
    </Wrapper>
  );
}
