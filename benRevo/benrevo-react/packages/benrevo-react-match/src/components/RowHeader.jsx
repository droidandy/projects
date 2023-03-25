// RowHeader table component;

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Popup, Image, Button } from 'semantic-ui-react';
import {
  closeIcon,
  editButton,
  favouriteImage,
  unfavouriteImage,
} from '@benrevo/benrevo-react-core';
import CarrierLogo from './CarrierLogo';

class RowHeader extends React.Component {

  static propTypes = {
    section: PropTypes.string.isRequired,
    plan: PropTypes.object.isRequired,
    attributes: PropTypes.array,
    carrier: PropTypes.object.isRequired,
    quoteType: PropTypes.string.isRequired,
    changeFavourite: PropTypes.func,
    showFavourite: PropTypes.bool,
    rfpQuoteNetworkId: PropTypes.number,
    clearAltPlan: PropTypes.func,
    index: PropTypes.number,
    removeAltPlanButton: PropTypes.bool,
    editBenefitInfo: PropTypes.func,
    optionName: PropTypes.string,
    isCurrentPlan: PropTypes.bool,
    emptyPlan: PropTypes.bool,
    enterPlanInfo: PropTypes.func,
  };

  static defaultProps = {
    isCurrentPlan: false,
    changeFavourite: () => {},
    editBenefitInfo: null,
    clearAltPlan: () => {},
    showFavourite: false,
    rfpQuoteNetworkId: null,
    index: null,
    removeAltPlanButton: false,
    optionName: null,
    emptyPlan: false,
    enterPlanInfo: null,
  };

  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  state = {
    // isOpen: false,
    textOverflow: false,
    // highlightClassName: '',
  };

  componentDidMount() {
    if (this.spanText && this.spanText.clientHeight !== this.spanText.scrollHeight) {
      this.setState({ textOverflow: true });
    }
  }

  render() {
    const {
      section,
      plan,
      carrier,
      attributes,
      quoteType,
      changeFavourite,
      showFavourite,
      rfpQuoteNetworkId,
      removeAltPlanButton,
      clearAltPlan,
      index,
      editBenefitInfo,
      optionName,
      isCurrentPlan,
      emptyPlan,
      enterPlanInfo,
    } = this.props;
    const hoverable = true;
    const planAttributes = {};
    if (plan.attributes) {
      for (let i = 0; i < plan.attributes.length; i += 1) {
        const planAttribute = plan.attributes[i];

        for (let j = 0; j < attributes.length; j += 1) {
          const attribute = attributes[j];

          if (planAttribute.sysName === attribute) {
            planAttributes[planAttribute.sysName] = planAttribute.value;
            break;
          }
        }
      }
    }
    return (
      <div className={`row-header header-column alt-table-column ${(plan.selected) ? 'selected' : ''} ${plan.type} ${carrier.carrier.name}`}>
        <Grid columns={1}>
          <Grid.Row className={editBenefitInfo ? 'center-aligned logo-row edit-benefits' : 'center-aligned logo-row'}>
            { removeAltPlanButton &&
            <span onClick={() => clearAltPlan()} className="close"><Image name="remove-button" src={closeIcon} /></span>
            }
            { plan.type === 'current' &&
            <div className="corner current">
              <span>CURRENT</span>
            </div>
            }
            { (plan.type === 'matchPlan') &&
            <div className="corner match">
              <span>MATCH</span>
            </div>
            }
            { (plan.type === 'alternative') &&
            <div className="corner alt">
              <span>ALT</span>
            </div>
            }
            <div className="logo-block">
              { plan.carrier && (section === 'dental' || 'medical' || 'vision') &&
              <CarrierLogo carrier={plan.carrier} section={section} quoteType={quoteType} />
              }
              { plan.carrierDisplayName && (section !== 'dental' || 'medical' || 'vision') &&
              <CarrierLogo carrier={plan.carrierDisplayName} section={section} quoteType={quoteType} />
              }
            </div>
            { (showFavourite && plan.type !== 'current' && !plan.favorite) &&
            <Image src={unfavouriteImage} className="un favourite" role="button" onClick={() => changeFavourite(section, plan.favorite, rfpQuoteNetworkId, plan.rfpQuoteNetworkPlanId, index)} />
            }
            { (showFavourite && plan.type !== 'current' && plan.favorite) &&
            <Image src={favouriteImage} className="favourite" role="button" onClick={() => changeFavourite(section, plan.favorite, rfpQuoteNetworkId, plan.rfpQuoteNetworkPlanId, index)} />
            }
            { !emptyPlan && editBenefitInfo && plan.type !== 'current' && !isCurrentPlan &&
            <span role="button" onClick={(e) => editBenefitInfo(plan, e.target)} className="edit-benefit-button"><Image name="remove-button" src={editButton} /> EDIT BENEFIT INFO</span>
            }
          </Grid.Row>
        </Grid>
        { emptyPlan &&
        <Grid columns={1} className="plan-name-row option-name">
          <Grid.Row className="center-aligned name">
            <Button primary size={'small'} className="enter-plan-info" onClick={() => enterPlanInfo('matchPlan')}>Enter Plan Info</Button>
          </Grid.Row>
        </Grid>
        }
        { optionName && !emptyPlan &&
        <Grid columns={1} className="plan-name-row option-name">
          <Grid.Row className="center-aligned name">
            <span>{optionName}</span>
          </Grid.Row>
        </Grid>
        }
        { !emptyPlan &&
        <Grid columns={1} className={`${optionName ? 'option-name' : ''} plan-name-row`}>
          <Grid.Row className="center-aligned name">
            { !this.state.textOverflow ?
              (<span ref={(spanText) => {
                this.spanText = spanText;
              }}>{plan.name || plan.planName}</span>) :
              (<Popup
                className="alternatives-plan-name-popup"
                position="bottom center"
                trigger={<span>{plan.name || plan.planName}</span>}
                content={plan.name || plan.planName}
                hoverable={hoverable}
                wide
              />)}
          </Grid.Row>
        </Grid>
        }
        {(attributes && attributes.length > 0) && attributes.map((item, key) =>
          <Grid key={key} className="plan-name-row plan-name-attrs">
            <Grid.Row columns={1}>
              <Grid.Column textAlign="center">
                {planAttributes[item] || '-'}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </div>
    );
  }
}

export default RowHeader;
