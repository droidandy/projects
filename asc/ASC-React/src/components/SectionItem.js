import React from 'react';

import {
    Icon,
    ListItem
} from 'react-onsenui';

class SectionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() {
    return (
    <section className='sectionItemContainer'>
    <ListItem className='sectionItemList '>

        {
          this.props.leftIcon ? <div className='left sectionItemList__left'>
                                  <Icon icon={this.props.leftIcon} className='sectionItemList__left__icon'/>
                                </div>
              : null
        }

      <div className='center sectionItemList__center'>
          <div style={{ width: '100%' }}>
        {
          this.props.title ? <div className='sectionItemList__center__title'>{this.props.title}</div>
              : null
        }
        {
          this.props.label ? <div className='sectionItemList__center__label'>{this.props.label}</div>
              : null
        }
         </div>
      </div>
        {
          this.props.rigthAction ? <div className='right sectionItemList__right' onClick={this.props.rigthAction} >
                                     <div className='sectionItemList__right__iconBlock'>
                                       <Icon icon={this.props.rightIcon ? this.props.rightIcon : 'ion-plus' } className='sectionItemList__right__icon'/>
                                     </div>
                                   </div>
                    : null
        }

    </ListItem>
    </section>
    );
  }
}

export default SectionItem;
