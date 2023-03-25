import * as React from 'react';
import styled, { css } from 'styled-components';

interface TabsProps {
  className?: string;
  children:
    | React.ReactElement<TabProps>
    | Array<React.ReactElement<TabProps> | false | null | undefined>;
  selectedTab: any;
  onIndexChange: (index: any) => any;
  flex?: boolean;
  sticky?: boolean;
}

interface TabProps {
  title: any;
  name?: string;
  children: React.ReactNode;
  active?: boolean;
}

function _Tabs(props: TabsProps) {
  const { className, children, onIndexChange, selectedTab } = props;
  const tabs = (Array.isArray(children)
    ? children.filter(x => x)
    : [children]) as Array<React.ReactElement<TabProps>>;
  const selected = React.useMemo(
    () =>
      tabs.find(
        (item, i) => item.props.name === selectedTab || i === selectedTab
      ),
    [tabs, selectedTab]
  );
  return (
    <div className={className}>
      <ul>
        {tabs.map((item, i) => {
          const { name, title } = item.props;
          return (
            <TabTitle
              key={name || i}
              active={i === selectedTab || name === selectedTab}
              onClick={() => onIndexChange(name || i)}
            >
              <a>{title}</a>
            </TabTitle>
          );
        })}
      </ul>
      {selected}
    </div>
  );
}

export const Tabs = styled(_Tabs)`
  > ul {
    width: 100%;
    margin: 0;
    padding: 0;
    padding-top: 10px;
    border: none;
    box-shadow: none;
    display: flex;
    background: white;
    ${props =>
      props.sticky &&
      css`
        position: sticky;
        top: 0px;
      `}
  }
  ${props =>
    props.flex &&
    css`
      flex: 1 0 0;
      display: flex;
      flex-direction: column;
      ${Tab} {
        flex: 1 0 0;
      }
    `}
`;

export const Tab = styled(props => <div {...props} title={null} />)<TabProps>`
  background: white;
`;

const TabTitle = styled.li<{ active: boolean }>`
  border: none;
  list-style: none;
  flex: 1 0 auto;

  a {
    color: #244159;
    font-weight: bold;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 15px;
    border-bottom: 1px solid #e8eaf0;
    svg {
      margin-left: 4px;
      path {
        fill: #244159;
      }
    }

    ${props =>
      props.active &&
      css`
        color: #10a6e9;
        border-bottom: 1px solid #10a6e9;
        svg {
          path {
            fill: #10a6e9;
          }
        }
      `}
  }
`;
