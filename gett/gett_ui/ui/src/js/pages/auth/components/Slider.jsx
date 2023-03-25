import React from 'react';
import { Carousel } from 'antd';
import CN from 'classnames';

import css from '../Auth.css';

const AUTOPLAY_SPEED = 10000;

export default function Slider(props) {
  return (
    <Carousel autoplay autoplaySpeed={ AUTOPLAY_SPEED } { ...props }>
      <div className={ CN(css.slide, 'relative') }>
        <div className={ CN(css.text, 'layout vertical center end-justified black-text') }>
          <div className={ CN(css.title, 'text-30 text-center mb-10 bold-text black-text') }>
            Anywhere in the world
          </div>
          <div className={ CN(css.secondTitle, 'text-16 text-center black-text') }>
            1 platform, 134 countries
          </div>
        </div>
      </div>
      <div className={ CN(css.slide, 'relative') }>
        <div className={ CN(css.text, 'layout vertical center end-justified black-text') }>
          <div className={ CN(css.title, 'text-30 text-center mb-10 bold-text black-text') }>
            Any type of vehicle
          </div>
          <div className={ CN(css.secondTitle, 'text-16 text-center black-text') }>
            Taxi, private hire and bespoke vehicles
          </div>
        </div>
      </div>
      <div className={ CN(css.slide, 'relative') }>
        <div className={ CN(css.text, 'layout vertical center end-justified black-text') }>
          <div className={ CN(css.title, 'text-30 text-center mb-10 bold-text black-text') }>
            Any type of service
          </div>
          <div className={ CN(css.secondTitle, 'text-16 text-center black-text') }>
            On-demand or pre-book accessible via app or web
          </div>
        </div>
      </div>
    </Carousel>
  );
}
