import React from 'react';

import {
    Icon,
    ListItem
} from 'react-onsenui';

class ProfileSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() {
    return (
      <section className='profileSectionContainer'>
        <ListItem className='profileSectionItem'>
          {
            this.props.icon ? <div className='left profileSectionItem__left' style={{minHeight: this.props.height ? this.props.height : null}} >
              <Icon icon={this.props.icon} className='profileSectionItem__left__icon'/>
            </div>
                : null
          }

          <div className='center profileSectionItem__center' style={{minHeight: this.props.height ? this.props.height : null}} >
            <div className='profileSectionItem__center__inner'>
              {
                this.props.title ? <div className='profileSectionItem__center__inner__title'><strong>{this.props.title}</strong></div>
                    : null
              }
            </div>
          </div>
          {
            this.props.fabAction ? <div className='right profileSectionItem__right' onClick={this.props.fabAction} style={{minHeight: this.props.height ? this.props.height : null}}>
              <div claaName='profileSectionItem__right__inner'>
                <Icon icon={this.props.fabIcon ? this.props.fabIcon : 'ion-plus' } className='profileSectionItem__right__icon' />
              </div>
            </div>
                : null
          }
        </ListItem>
      </section>
    );
  }
}

export default ProfileSection;
