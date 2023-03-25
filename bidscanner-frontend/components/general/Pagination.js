// @flow
import React from 'react';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';

const MyPaginationLink = styled.div`
  border-radius: 0px !important;
  border-color: black !important;
  font-size: 0.8em;
  color: #bcbec0 !important;
  background-color: white !important;
  width: 1.5rem;
  text-align: center;
  cursor: pointer;
`;

const MyActivePaginationLink = styled.div`
  color: black !important;
  width: 1.5rem;
  text-align: center;
  font-size: 0.8em;
  cursor: pointer;
`;

export type PaginationProps = {
  currentPageIndex: number,
  numberOfPages: number,
  paginationWidth: number,
  onClick: number => void,
};

export default ({ currentPageIndex, numberOfPages, paginationWidth, onClick }: PaginationProps) => {
  // we want our page to be the second one
  let paginationLeftIndex = currentPageIndex - 1;
  let paginationRightIndex;

  // if it can't be the second, it's ok for it to be the first
  if (currentPageIndex - 1 < paginationWidth) paginationLeftIndex = 1;
  // calculate the most right index depending on paginationWidth
  paginationRightIndex = paginationLeftIndex + paginationWidth - 1;
  // if it can't be that big, our the most right index will link to the last page
  if (paginationRightIndex > numberOfPages) {
    paginationRightIndex = numberOfPages;
    // if we change the most right index we should try to preserve desirable width
    paginationLeftIndex = numberOfPages - paginationWidth + 1;
    if (paginationLeftIndex < 1) paginationLeftIndex = 1;
  }

  const paginationItems = [];
  for (let index = paginationLeftIndex; index <= paginationRightIndex; index += 1) {
    if (index === Number(currentPageIndex)) {
      paginationItems.push(
        <MyActivePaginationLink key={`page-${index}`}>
          {index}
        </MyActivePaginationLink>
      );
    } else {
      paginationItems.push(
        <MyPaginationLink key={`page-${index}`} onClick={() => onClick(index)}>
          {index}
        </MyPaginationLink>
      );
    }
  }

  return (
    <Flex direction="column">
      <Flex>
        <MyPaginationLink onClick={() => onClick(1)}>
          <i className="fa fa-angle-double-left" aria-hidden="true" />
        </MyPaginationLink>
        <Box role="button" onClick={() => (currentPageIndex - 1 >= 1 ? onClick(currentPageIndex - 1) : null)}>
          <MyPaginationLink>
            <i className="fa fa-angle-left" aria-hidden="true" />
          </MyPaginationLink>
        </Box>
        {paginationItems}
        <Box
          role="button"
          onClick={() => (currentPageIndex + 1 <= numberOfPages ? onClick(currentPageIndex + 1) : null)}
        >
          <MyPaginationLink>
            <i className="fa fa-angle-right" aria-hidden="true" />
          </MyPaginationLink>
        </Box>
        <MyPaginationLink
          onClick={() => (currentPageIndex + 1 <= numberOfPages ? onClick(numberOfPages) : null)}
        >
          <i className="fa fa-angle-double-right" aria-hidden="true" />
        </MyPaginationLink>
      </Flex>
    </Flex>
  );
};
