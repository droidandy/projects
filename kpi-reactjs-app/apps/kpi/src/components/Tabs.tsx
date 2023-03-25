import * as React from 'react';
import styled from 'styled-components';
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
              {title}
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
  > ul {
    display: flex;
    border-bottom: 1px solid #dee2e6;
    list-style: none;
    padding: 0;
    margin: 0;
    margin-top: 20px;
    flex-wrap: wrap;
  }
`;

export const Tab = styled.div<TabProps>`
  display: block;
  border: 1px solid #dee2e6;
  border-top: 0;
  padding: 15px;
`;

const TabTitle = styled.li<{ active: boolean }>`
  display: block;
  transition: all 0.3s;
  padding: 0.75rem 1.25rem;
  background-color: #fff;
  border: 1px solid transparent;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  transition: all 0.3s;
  color: #5d78ff;

  ${props =>
    props.active &&
    `
      border-color: #dee2e6 #dee2e6 #fff;
      margin-bottom: -1px;
    `}

  &:hover {
    cursor: pointer;
    border-color: #dee2e6 #dee2e6 #fff;
  }
`;
