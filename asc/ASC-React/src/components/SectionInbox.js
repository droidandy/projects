import React from 'react';

import {
    ListItem
} from 'react-onsenui';

class SectionInbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() {
    return (
        <section className='sectionInboxContainer' onClick={this.props.onClick}>
          <ListItem className='sectionInboxList '>

            {
              this.props.image ? <div className='left sectionInboxList__left'>
                <div style={{backgroundImage: 'url(' + this.props.image + ')'}} className='sectionInboxList__left__icon'>

                </div>
                  {
                   this.props.status ? <div className='sectionInboxList__left__status'> </div> : null
                  }
              </div>
                  : null
            }

            <div className='center sectionInboxList__center'>
              <div style={{ width: '100%' }}>
                {
                  this.props.title ? <div className='sectionInboxList__center__title'>{this.props.title}</div>
                      : null
                }
                {
                  this.props.label ? <div className='sectionInboxList__center__label' style={this.props.isNew ? {backgroundColor: '#9e1c26', color: '#fff', borderRadius: '5px', padding: '0 5px'} : {} }>{this.props.label}</div>
                      : null
                }
              </div>
            </div>
            {
              this.props.latestDate ? <div className='right sectionInboxList__right'>
                <div className='sectionInboxList__right__iconBlock'>
                    {this.props.latestDate}
                </div>
              </div>
                  : null
            }

          </ListItem>
        </section>
    );
  }
}

export default SectionInbox;
