import React, { FC, useEffect, useRef } from 'react';
import cx from 'classnames';
import { Typography, useBreakpoints } from '@marketplace/ui-kit';

import { useStyles } from './Tabs.styles';

interface Props {
  tabs: string[];
  activeTab: number;
  isOnlyActiveStepHaveTitle?: boolean;
}

const Tabs: FC<Props> = ({ tabs, activeTab, isOnlyActiveStepHaveTitle = false }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  const tabsRef = useRef<HTMLUListElement>(null);
  const activeTabRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (isMobile) {
      const offsetTabs = tabsRef.current?.offsetLeft || 0;
      const offsetActiveTab = activeTabRef.current?.offsetLeft || 0;
      tabsRef.current?.scrollTo(offsetActiveTab - offsetTabs, 0);
    }
  }, [activeTab, isMobile]);

  return (
    <ul className={s.root} ref={tabsRef}>
      {tabs.map((tab, index) => (
        <li
          key={index}
          className={cx(s.tab, { [s.active]: index === activeTab })}
          ref={index === activeTab ? activeTabRef : null}
        >
          <Typography variant="body1">
            {!isOnlyActiveStepHaveTitle || index === activeTab ? tab : `Шаг\u00A0${index + 1}`}
          </Typography>
        </li>
      ))}
    </ul>
  );
};

export { Tabs };
