// RowHeader table component;

import React from 'react';
import PropTypes from 'prop-types';
import { DownloadIconImage } from '@benrevo/benrevo-react-core';
import { Grid, Button, Popup } from 'semantic-ui-react';
import CarrierLogo from './../../CarrierLogo';

class RowHeader extends React.Component {

  static propTypes = {
    section: PropTypes.string,
    editPlan: PropTypes.func,
    plan: PropTypes.object,
    attributes: PropTypes.array,
    downloadPlanBenefitsSummary: PropTypes.func,
    additionalClassName: PropTypes.string,
    multiMode: PropTypes.bool,
    hideButtonRow: PropTypes.bool,
    isRX: PropTypes.bool,
    carrier: PropTypes.object,
    deletePlan: PropTypes.func,
    optionName: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      textOverflow: false,
      highlightClassName: '',
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.close = this.close.bind(this);
  }

  componentDidMount() {
    if (this.spanText && this.spanText.clientHeight !== this.spanText.scrollHeight) {
      this.setState({ textOverflow: true });
    }
  }

  close() {
    this.setState({ isOpen: false });
  }

  handleOpen() {
    this.setState({ isOpen: true });
  }

  render() {
    const {
      section,
      editPlan,
      multiMode,
      plan,
      hideButtonRow,
      downloadPlanBenefitsSummary,
      additionalClassName,
      carrier,
      deletePlan,
      isRX,
      attributes,
      optionName,
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
      <div className={`row-header ${!isRX ? 'row-header-main' : ''} header-column alt-table-column ${(plan.selected) ? 'selected' : ''} ${additionalClassName} ${plan.type} ${carrier.carrier.name}`}>
        <Grid columns={1}>
          <Grid.Row className="center-aligned logo-row">
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
            { plan.carrier &&
            <CarrierLogo carrier={plan.carrier} section={section} />
            }
          </Grid.Row>
        </Grid>
        <Grid columns={1} className="plan-name-row">
          <Grid.Row className="center-aligned name">
            { !this.state.textOverflow ?
            (<span ref={(spanText) => { this.spanText = spanText; }}>{plan.name}</span>) :
            (<Popup
              className="alternatives-plan-name-popup"
              position="bottom center"
              trigger={<span>{plan.name}</span>}
              content={plan.name}
              hoverable={hoverable}
              wide
            />)}
          </Grid.Row>
          { !hideButtonRow &&
          <Grid.Row className="buttons-row">
            { (!multiMode && plan.type !== 'current' && plan.summaryFileLink && plan.summaryFileLink.length > 0) &&
            <Button size="mini" onClick={() => downloadPlanBenefitsSummary(plan.summaryFileLink, name)}>
              <img className="button-icon" src={DownloadIconImage} alt="download benefits summary" />Benefit Summary
            </Button>
            }
            { (plan.type === 'current' && !multiMode && plan.benefits.length > 0 && !(optionName && optionName.indexOf('Renewal' !== -1))) &&
            <Button className="add-benefit-info" size="mini" primary onClick={() => editPlan()}>Add Benefit Info</Button>
            }
            { multiMode && plan.benefits && plan.benefits.length > 0 && plan.type !== 'current' &&
              <div className="plan-edit-block">
                <Button className="add-benefit-info" size="mini" primary onClick={() => editPlan()}>Edit</Button>
                <Popup
                  className="deletePopup-wrap"
                  trigger={<Button size="mini" primary>Delete</Button>}
                  content={
                    <div className="deletePopup">
                      <h3>Delete this plan?</h3>
                      <a tabIndex={0} className="iconBtn" onClick={() => { this.close(); }}>X</a>
                      <Button primary size="small" content="Yes" onClick={() => deletePlan(plan.rfpQuoteNetworkPlanId)} />
                      <Button primary size="small" content="No" onClick={() => { this.close(); }} />
                    </div>
                  }
                  open={this.state.isOpen}
                  onOpen={this.handleOpen}
                  on="click"
                  position="bottom center"
                />
              </div>
            }
          </Grid.Row>
          }
        </Grid>
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
