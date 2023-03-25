import React from 'react';
import cn from 'classnames';
import Tabs from 'components/UI/Tabs';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import Tab3 from './Tab3';
import styles from './styles.module.scss';

const ForDevelopmentTeams = () => {
  return (
    <div className={styles.block}>
      <div className="container">
        <h2>For development teams</h2>

        <Tabs
          nav={[
            'Integrate subscriptions',
            'One API for all platforms',
            'Fetch user state',
          ]}
        >
          <div className={styles.item}>
            <Tab1 />
          </div>
          <div className={cn(styles.item, '_center')}>
            <Tab2 />
          </div>
          <div className={cn(styles.item, '_center')}>
            <Tab3 />
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ForDevelopmentTeams;
