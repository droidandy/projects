import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { Link } from 'react-router';
import { Grid, Image, Popup, Button, Input, Loader, Table } from 'semantic-ui-react';
import {
  arrowLeft,
  editIcon,
} from '@benrevo/benrevo-react-core';
import Contribution from '../Contribution';
import { changePlanLabelName } from './../../../actions';
import {
  MEDICAL_TEXT,
  DENTAL_TEXT,
  VISION_TEXT,
  LIFE_TEXT,
  STD_TEXT,
  LTD_TEXT,
} from './../../../constants';
const titles = {
  medical: MEDICAL_TEXT,
  dental: DENTAL_TEXT,
  vision: VISION_TEXT,
  life: LIFE_TEXT,
  std: STD_TEXT,
  ltd: LTD_TEXT,
};

class DetailsHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    clientId: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    openedOption: PropTypes.object.isRequired,
    carrier: PropTypes.object.isRequired,
    changeName: PropTypes.func.isRequired,
    optionNameLoading: PropTypes.bool.isRequired,
    optionLoading: PropTypes.bool.isRequired,
    ancillary: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      contribution: false,
      openedOptionName: '',
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.changePlanName = this.changePlanName.bind(this);
  }

  handleOpen() {
    const { openedOption, ancillary } = this.props;
    if (!ancillary) this.setState({ openedOptionName: (openedOption.displayName || openedOption.name || '') });
    else if (openedOption.detailedPlan) this.setState({ openedOptionName: (openedOption.detailedPlan.displayName || openedOption.detailedPlan.name || '') });
    this.setState({ isOpen: true });
  }

  handleClose() {
    this.setState({ isOpen: false });
  }

  handleSave() {
    const { changeName, section, openedOption } = this.props;
    const { openedOptionName } = this.state;
    if (openedOption.id) changeName(section, openedOption.id, openedOptionName);
    else if (openedOption.detailedPlan && openedOption.detailedPlan.rfpQuoteAncillaryOptionId) changeName(section, null, openedOptionName, openedOption.detailedPlan.rfpQuoteAncillaryOptionId);
    this.setState({ isOpen: false });
  }

  changePlanName(value) {
    const letterNumber = /^[a-zA-Z0-9 ]*$/;
    if (value.match(letterNumber) || value === '') {
      this.setState({ openedOptionName: value });
    }
  }

  toggleModal() {
    this.setState({ contribution: !this.state.contribution });
  }

  render() {
    const {
      clientId,
      section,
      openedOption,
      carrier,
      optionNameLoading,
      optionLoading,
      ancillary,
    } = this.props;
    const { openedOptionName, isOpen } = this.state;
    let totalAnnualPremium = openedOption.totalAnnualPremium || 0;
    let dollarDifference = openedOption.dollarDifference || 0;
    let percentDifference = openedOption.percentDifference / 100;
    // console.log('DetailsHeader props', this.props);
    const backLink = `/clients/${clientId}/presentation/${section}`;

    if (ancillary && openedOption.detailedPlan) {
      totalAnnualPremium = openedOption.detailedPlan.totalAnnualPremium || 0;
      dollarDifference = openedOption.detailedPlan.dollarDifference || 0;
      percentDifference = openedOption.detailedPlan.percentDifference / 100;
    }

    return (
      <div>
        <Grid className="details-header">
          <Grid.Row className="nav-row">
            <Grid.Column floated="left" width={5}>
              <Link to={backLink}>
                <Image src={arrowLeft} className="arrow-left" /><span>Back to {titles[section]} option</span>
              </Link>
            </Grid.Column>
            {!ancillary &&
              <Grid.Column floated="right" width={5}>
                <a tabIndex={0} role="button" onClick={this.toggleModal}>
                  Edit/View Contributions
                </a>
              </Grid.Column>
            }
          </Grid.Row>
          <Grid.Row className="info-row">
            <Grid.Column floated="left" width={5}>
              { (!optionNameLoading && !optionLoading) &&
              <div className="header">
                { !ancillary && <span>{openedOption.displayName || openedOption.name || ''}</span> }
                { ancillary && openedOption.detailedPlan && <span>{openedOption.detailedPlan && (openedOption.detailedPlan.displayName || openedOption.detailedPlan.name || '')}</span> }
                <Popup
                  className="edit-plan-name-popup"
                  inverted
                  position="right center"
                  trigger={<Image src={editIcon} alt="edit plan name" />}
                  open={isOpen}
                  onOpen={() => this.handleOpen()}
                  on="click"
                >
                  <Grid className="edit-plan-name-popup-inner">
                    <Grid.Row className="label-row">
                      <Grid.Column>
                        <header>Edit option name</header>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="input-row">
                      <Grid.Column>
                        <Input
                          fluid
                          type="text"
                          maxLength="16"
                          value={openedOptionName}
                          onChange={(e, inputState) => this.changePlanName(inputState.value)}
                        />
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns="equal" className="buttons-row">
                      <Grid.Column>
                        <Button primary content="Save" fluid onClick={() => this.handleSave()} />
                      </Grid.Column>
                      <Grid.Column>
                        <Button inverted content="Cancel" fluid onClick={() => this.handleClose()} />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Popup>
              </div>
              }
              { (optionNameLoading || optionLoading) &&
              <div className="loader-name">
                <Loader inline active={optionNameLoading || optionLoading} indeterminate size="medium" />
              </div>
              }
              <div className="presentation-sub-header">{carrier.displayName || ''} options</div>
            </Grid.Column>
            <Grid.Column floated="right" width={11}>
              <Table basic="very" textAlign="right">
                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="table-inline">
                      <div className="header right">
                        { !optionLoading &&
                        <FormattedNumber
                          style="currency" // eslint-disable-line react/style-prop-object
                          currency="USD"
                          minimumFractionDigits={0}
                          maximumFractionDigits={0}
                          value={totalAnnualPremium}
                        />
                        }
                        { optionLoading &&
                        <div className="loader-small">
                          <Loader inline active={optionLoading} indeterminate size="medium" />
                        </div>
                        }
                        <div className="sub-header right">total annual premium</div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="table-inline right bordered">
                      <div className="header right">
                        { !optionLoading &&
                        <FormattedNumber
                          style="percent" // eslint-disable-line react/style-prop-object
                          minimumFractionDigits={0}
                          maximumFractionDigits={1}
                          value={percentDifference || 0}
                        />
                        }
                        { optionLoading &&
                        <div className="loader-small">
                          <Loader inline active={optionLoading} indeterminate size="medium" />
                        </div>
                        }
                        <div className="sub-header center">% difference</div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="table-inline right bordered last">
                      <div className="header right">
                        { !optionLoading &&
                        <FormattedNumber
                          style="currency" // eslint-disable-line react/style-prop-object
                          currency="USD"
                          minimumFractionDigits={0}
                          maximumFractionDigits={0}
                          value={dollarDifference || 0}
                        />
                        }
                        { optionLoading &&
                        <div className="loader-small">
                          <Loader inline active={optionLoading} indeterminate size="medium" />
                        </div>
                        }
                        <div className="sub-header right">$ difference</div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Contribution section={section} openModal={this.state.contribution} closeModal={this.toggleModal} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { section, clientId } = ownProps;
  const overviewState = state.get('presentation').get(section);
  return {
    section,
    clientId,
    optionLoading: overviewState.get('loading'),
    optionNameLoading: overviewState.get('optionNameLoading'),
    openedOption: overviewState.get('openedOption').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeName: (section, rfpQuoteOptionId, displayName, rfpQuoteAncillaryOptionId) => { dispatch(changePlanLabelName(section, rfpQuoteOptionId, displayName, rfpQuoteAncillaryOptionId)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsHeader);
