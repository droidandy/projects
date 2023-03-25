import * as React from 'react';
import styled from 'styled-components';
import { rtlMargin } from 'shared/rtl';
import { Page } from './Page';

interface SidebarLayoutProps {
  className?: string;
  children?: React.ReactNode;
  left?: React.ReactNode;
  right: React.ReactNode;
}

const Left = styled.div`
  width: 350px;
  flex-shrink: 0;
  & > div {
    height: 100%;
  }
`;
const Right = styled.div`
  ${rtlMargin('30px', 0)};
  width: calc(100% - 380px);
  & > div {
    height: 100%;
  }
  overflow-x: auto;
`;

const _SidebarLayout = (props: SidebarLayoutProps) => {
  const { className, left, right, children } = props;
  return (
    <Page flex>
      {children}
      <div className={className}>
        {left ? (
          <>
            <Left>{left}</Left>
            <Right>{right}</Right>
          </>
        ) : (
          right
        )}
      </div>
    </Page>
  );
};

export const SidebarLayout = styled(_SidebarLayout)`
  display: flex;
  width: 100%;
  height: 100%;
`;
