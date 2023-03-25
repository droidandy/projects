import React from 'react';
import PropTypes from 'prop-types';

class WarningCard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    violationMessage: PropTypes.object.isRequired,
    carrierName: PropTypes.string.isRequired,
  };
  // static defaultProps = {};
  render() {
    const { violationMessage, carrierName } = this.props;
    // console.log('violationMessage', violationMessage);
    return (
      <div className="warning-card">
        <div className="warning-inner">
          <header>Let us help you get back in compliance with the {carrierName} guidelines!</header>
          { violationMessage.HMONetworks !== 0 &&
          <ul>
            <li>More than {violationMessage.HMONetworks} HMO networks are selected</li>
            <li>Anthem Blue Cross allows a maximum of 2</li>
          </ul>
          }
          { violationMessage.HMO !== 0 &&
            <ul>
              <li>This option has {violationMessage.HMO} HMO plans selected</li>
              <li>{carrierName} allows a maximum of 2</li>
            </ul>
          }
          { violationMessage.PPO !== 0 &&
          <ul>
            <li>This option has {violationMessage.PPO} PPO plans selected</li>
            <li>{carrierName} allows a maximum of 2</li>
          </ul>
          }
          { violationMessage.Solution !== 0 &&
          <ul>
            <li>This options has {violationMessage.Solution} Solution PPO plans selected</li>
            <li>{carrierName} allows a maximum of 1</li>
          </ul>
          }
          { violationMessage.HSA !== 0 &&
          <ul>
            <li>This option has {violationMessage.HSA} HSA plans selected</li>
            <li>{carrierName} allows a maximum of 1</li>
          </ul>
          }
          { violationMessage.UHC !== 0 &&
          <ul>
            <li>This option has {violationMessage.UHC} different plans selected</li>
            <li>{carrierName} allows a maximum of 6</li>
          </ul>
          }
        </div>
      </div>
    );
  }
}

export default WarningCard;
