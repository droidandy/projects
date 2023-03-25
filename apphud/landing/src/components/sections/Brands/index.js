import React from 'react';
import cn from 'classnames';
import styles from './styles.module.scss';

const Brands = () => {
  return (
    <div className={styles.brands}>
      <div className={cn('container', styles.container)}>
        <div className={styles.line}>
          <img src={require('./line.svg')} />
        </div>

        <div className={styles.ball}></div>

        <h2>Integrations with 10+ leading solutions</h2>
        <div className={styles.list}>
          <div>
            <img src={require('./logos/appsflyer.svg')} alt="Appsflyer" />
          </div>
          <div>
            <img src={require('./logos/adjust.svg')} alt="Adjust" />
          </div>
          <div>
            <img src={require('./logos/branch.svg')} alt="Branch" />
          </div>
          <div>
            <img src={require('./logos/tenjin.svg')} alt="Tenjin" />
          </div>
          <div>
            <img src={require('./logos/facebook.svg')} alt="Facebook" />
          </div>
          <div>
            <img src={require('./logos/search-ads.svg')} alt="Search Ads" />
          </div>
          <div>
            <img src={require('./logos/segment.svg')} alt="Segment" />
          </div>
          <div>
            <img src={require('./logos/amplitude.svg')} alt="Amplitude" />
          </div>
          <div>
            <img src={require('./logos/mixpanel.svg')} alt="Mixpanel" />
          </div>
          <div>
            <img src={require('./logos/appmetrica.svg')} alt="App metrica" />
          </div>
          <div>
            <img src={require('./logos/one_signal.svg')} alt="One Signal" />
          </div>
          <div>
            <img src={require('./logos/slack.svg')} alt="Slack" />
          </div>
          <div>
            <img src={require('./logos/telegram.svg')} alt="Telegram" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brands;
