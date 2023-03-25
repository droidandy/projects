import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as navigatorActions from '../redux/navigator';

import {
    // Input
} from 'react-onsenui';

import FooterDesktop from './FooterDesktop';

@connect((state) => ({ navigator: state.navigator, utility: state.utility }), (dispatch) => ({ actions: bindActionCreators(navigatorActions, dispatch) }))

class About extends React.Component {
  constructor(props) {
    super(props);
    // this.function1 = this.function1.bind(this);
    this.state = {
    };
  }

  render() {
    let wideScreenClass = this.props.utility.isMobile
      ? ''
      : ' about__wrap__text__wide-screen';
    return (
        <div className='about__wrap'>
           <div id='topot' className='about__wrap__border'>
              <h2 className='about__title'>
                About
              </h2>
              <div className={'about__wrap__text' + wideScreenClass}>
                <div>
                  <p>Action Sports Community exists to help you:</p>
                    <p><span className='about__text__strong-span'>Connect</span> - We facilitate local connections and support a community of action sport enthusiasts who value people and friendships.</p>
                    <p><span className='about__text__strong-span'>Ride</span> - You love action sports because you like to be out doing the sport, not spending time surfing the web. Quickly find people in your area who want to get out right now or shoot out a message and pull a group together.</p>
                    <p><span className='about__text__strong-span'>Get involved</span> - Find local groups and organizations who are engaged and giving back to their community. ASC has partnered with organizations with similar interests and values so you can quickly find ones in your area.</p>
                  <p>
                    We are a Christian non-profit organization, but happily
                    welcome people of any faith or no faith to be a member of
                    our community. These are a list of beliefs that we
                    hold: <a target='_blank' href='http://actionsportsministry.org/about/statement-of-faith/'>http://actionsportsministry.org/about/statement-of-faith/</a>
                  </p>
                </div>
              </div>
           </div>

          {!this.props.utility.isMobile
            ? <div className='about__footer'>
                <FooterDesktop />
              </div>
            : null}

        </div>

    );
  }
}

export default About;
