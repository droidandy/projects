import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import { CarrierLogo } from '@benrevo/benrevo-react-quote';

class AltPlanEmpty extends React.Component {
  static propTypes = {
    carrier: PropTypes.object.isRequired,
    section: PropTypes.string.isRequired,
    altEmptyClick: PropTypes.func.isRequired,
    quoteType: PropTypes.string,
    showAddPlanLabel: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    quoteType: 'STANDARD',
  };

  getContainerClassNames(section) {
    const baseClass = 'card-add alt-plan-empty';
    if (['life', 'std', 'ltd'].indexOf(section) !== -1) {
      return `${baseClass} life`;
    }
    return baseClass;
  }

  render() {
    const { section, carrier, quoteType, altEmptyClick, showAddPlanLabel } = this.props;
    return (
      <Card as="div" className={this.getContainerClassNames(section)}>
        <div className="topbottom" />
        <div className="leftright" />
        <div className="card-add-inner" onClick={() => altEmptyClick()}>
          <div className="corner alt">
            <span>ALT</span>
          </div>
          <CarrierLogo carrier={carrier.carrier.name} section={section} quoteType={quoteType} />
          <div className="plus">+</div>
          { !showAddPlanLabel &&
          <div className="title">Choose Alternative Plan</div>
          }
          { showAddPlanLabel &&
          <div className="title">Add Alternative Plan</div>
          }
        </div>
      </Card>
    );
  }
}

export default AltPlanEmpty;
