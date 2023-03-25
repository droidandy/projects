import * as React from 'react';
import styled, { css } from 'styled-components';
import { rtlMargin } from 'shared/rtl';

interface TabsProps {
  className?: string;
  children:
    | React.ReactElement<TabProps>
    | Array<React.ReactElement<TabProps> | false | null | undefined>;
  selectedTab: number | string;
  onIndexChange: (index: number | string) => any;
  append?: React.ReactNode;
}

interface TabProps {
  title: string;
  name?: string;
  children: React.ReactNode;
  active?: boolean;
}

const Append = styled.li`
  ${rtlMargin('auto', 0)}
  padding-bottom: 5px;
`;

const _Tabs = (props: TabsProps) => {
  const { className, children, selectedTab, onIndexChange, append } = props;
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
              <span>{title}</span>
            </TabTitle>
          );
        })}
        {append && <Append>{append}</Append>}
      </ul>
      {selected}
    </div>
  );
};

export const Tabs = styled(_Tabs)`
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.03);
  border-radius: 3px;
  margin-bottom: 40px;
  background-color: #ffffff;

  > ul {
    width: 100%;
    margin: 0;
    border: none;
    box-shadow: none;
    border-radius: 3px;
    background: #edf2f5;
    flex-wrap: wrap;
    padding-right: 0;
    display: flex;
    list-style: none;
  }
`;

export const Tab = styled.div<TabProps>`
  padding: 25px;
`;

const TabTitle = styled.li<{ active: boolean }>`
  border: none;
  padding: 25px;
  margin-bottom: -1px;
  flex: 1 0 auto;
  border-top-right-radius: 0.25rem;
  border-top-left-radius: 0.25rem;
  text-align: center;

  span {
    font-style: normal;
    font-weight: 800;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    color: #244159;
  }

  ${props =>
    props.active &&
    css`
      box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.03);
      background-color: #ffffff;
      span {
        color: #10a6e9;
      }
    `}

  &:hover {
    cursor: pointer;
  }
`;
