/* eslint-disable jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, Button, Header, Modal, Image } from 'semantic-ui-react';
import { FormattedNumber } from 'react-intl';
import { Link } from 'react-router';
import { CarrierLogo } from '@benrevo/benrevo-react-match';
import { OPTION_TYPE_RENEWAL } from '../../constants';
import warningIcon from './../../../../assets/img/svg/warning-icon.svg';

class CardItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    index: PropTypes.number,
    isCurrent: PropTypes.bool,
    optionsDelete: PropTypes.func,
    carriers: PropTypes.array,
    changeCurrentPage: PropTypes.func.isRequired,
    editAction: PropTypes.func,
    violationNotification: PropTypes.object,
  };

  static defaultProps = {
    violationNotification: {},
    index: 0,
    isCurrent: false,
    optionsDelete: null,
    editAction: null,
    carriers: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    };

    this.optionsDelete = this.optionsDelete.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
  }

  getCarrierByName(name) {
    const { carriers } = this.props;

    for (let j = 0; j < carriers.length; j += 1) {
      const listItem = carriers[j].carrier;

      if (listItem.displayName === name) return carriers[j];
    }

    return {};
  }

  modalToggle() {
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  optionsDelete() {
    this.modalToggle();
    this.props.optionsDelete(this.props.section, this.props.data.id);
  }

  changeCurrentPage() {
    const { section, data, changeCurrentPage } = this.props;
    const rfpCarrier = this.getCarrierByName(data.carrier);
    const option = {
      carrier: rfpCarrier,
      id: data.id,
      optionType: data.optionType,
    };
    changeCurrentPage(section, option);
  }

  render() {
    const {
      isCurrent,
      data,
      index,
      client,
      section,
      editAction,
      violationNotification,
    } = this.props;
    if (!data.planTypes) data.planTypes = [];
    let className = (isCurrent) ? 'card-current' : `card-option card-${index + 1}`;
    let showAdd = !isCurrent;
    const isRenewal = data.optionType === OPTION_TYPE_RENEWAL && (data.name === 'Renewal' || data.name === 'Renewal 1');
    const showRemove = !isCurrent && !isRenewal;

    if (showAdd) showAdd = false;

    if (showAdd) className += ' is-add';
    return (
      <Card as="div" className={className}>
        { showRemove && <a className="remove-card" onClick={this.modalToggle}>X</a> }
        { violationNotification[data.id] &&
        <Image className="warning-icon" alt="warning" src={warningIcon} />
        }
        <div className="card-link">
          <Card.Content className="content-top">
            <Card.Header>
              {data.displayName ? data.displayName : data.name}
            </Card.Header>
            <CarrierLogo carrier={data.carrier} quoteType={data.quoteType} section={section} />
            <Card.Description>
              <Grid textAlign="center">
                <Grid.Row>
                  <Grid.Column className="card-price-value" width="9">
                    <FormattedNumber
                      style="currency" // eslint-disable-line react/style-prop-object
                      currency="USD"
                      minimumFractionDigits={0}
                      maximumFractionDigits={0}
                      value={data.totalAnnualPremium}
                    />
                    <div className="sub-description">total annual premium</div>
                  </Grid.Column>
                  <Grid.Column className="card-price-value" width="7">
                    { isCurrent &&
                      <span>-</span>
                    }

                    {!isCurrent &&
                      <span className="percent"> {data.percentDifference}%</span>
                    }

                    <div className="sub-description">difference</div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Description>
          </Card.Content>
          { !isCurrent && data.plans.length > 0 &&
            <div className="plan-list">
              { data.plans.map((item, i) => {
                if (i < 6) {
                  return (
                    <div key={i} className="plan-item">
                      <span className="plan-item-title">{item.type}</span>
                      <span className="plan-item-name">{item.name}</span>
                    </div>
                  );
                }

                return true;
              })}
            </div>
          }
        </div>
        { !isCurrent && !isRenewal && <Button as={Link} size="large" to={`/clients/${client.id}/presentation/${section}/detail`} primary onClick={this.changeCurrentPage}>Edit/View Plans Details</Button> }
        { isRenewal && <Button as="a" size="large" primary onClick={() => { editAction('editRenewal', { id: data.id }); }}>Edit/View Plans Details</Button> }
        { isCurrent && <Button as="a" size="large" primary onClick={() => { editAction('editCurrent'); }}>Edit Info</Button> }
        <Modal
          className="delete-option-modal"
          open={this.state.modalOpen}
          onClose={this.modalToggle}
          closeOnDimmerClick={false}
          size="tiny"
          closeIcon={<span className="close">X</span>}
        >
          <Grid>
            <Grid.Row centered>
              <Grid.Column width={16} textAlign="center" className="page-heading-top">
                <Header as="h1" className="page-heading center">Are you sure?</Header>
                <div className="text">
                  Are you sure you want to delete this option?
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <div className="buttons">
                <Button className="button-prev" basic size="large" onClick={this.modalToggle}>Cancel</Button>
                <Button className="button-next" size="large" primary onClick={() => { this.optionsDelete(); }}>Delete</Button>
              </div>
            </Grid.Row>
          </Grid>
        </Modal>
      </Card>
    );
  }
}

export default CardItem;
