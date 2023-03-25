import React from 'react';

import {
    Icon,
    ListItem
} from 'react-onsenui';

class Section extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() {
    return (
      <section className='sectionContainer'>
        <ListItem className='sectionItem'>
          {
            this.props.icon ? <div className='left sectionItem__left'>
              <Icon icon={this.props.icon} className='sectionItem__left__icon' />
            </div>
                : null
          }

          <div className='center sectionItem__center'>
            <div className='sectionItem__center__inner'>
              {
                this.props.title ? <div className='sectionItem__center__inner__title' ><strong>{this.props.title}</strong></div>
                    : null
              }
            </div>
          </div>
          {
            this.props.fabAction ? <div className='right sectionItem__right' onClick={this.props.fabAction}>
              <div className='sectionItem__right__inner'>
                <Icon icon={this.props.fabIcon ? this.props.fabIcon : 'ion-plus' } className='sectionItem__right__icon' />
              </div>
            </div>
                : null
          }
        </ListItem>
      </section>
    );
  }
}

export default Section;
