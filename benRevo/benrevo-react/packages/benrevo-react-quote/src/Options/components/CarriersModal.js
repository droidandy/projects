import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header, Button, Grid, Form, Image } from 'semantic-ui-react';
import { ClearValue } from '@benrevo/benrevo-react-core';
import CarrierLogo from './../../CarrierLogo';
import * as types from './../../constants';

class CarriersModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    quotes: PropTypes.array.isRequired,
    carrierList: PropTypes.array.isRequired,
    mainCarrier: PropTypes.object.isRequired,
    current: PropTypes.object.isRequired,
    clearValueCarrier: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    hideMultiCarrier: PropTypes.bool,
    showEmptyOption: PropTypes.bool.isRequired,
    hasClearValue: PropTypes.bool.isRequired,
    modalToggle: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedCarrier: null,
      section: 'main',
      start: 1,
      limit: (props.hasClearValue) ? 7 : 5,
      count: (props.hasClearValue) ? 7 : 5,
    };

    this.changeSection = this.changeSection.bind(this);
    this.back = this.back.bind(this);
    this.cancel = this.cancel.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.selectCarrier = this.selectCarrier.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasClearValue !== this.props.hasClearValue) {
      this.setState({ count: (nextProps.hasClearValue) ? 7 : 5, limit: (nextProps.hasClearValue) ? 7 : 5 });
    }
  }

  changeSection(section) {
    this.setState({ section });
  }

  nextPage() {
    const count = this.state.count;
    this.setState({ start: this.state.start + count, limit: this.state.limit + count });
  }

  prevPage() {
    const count = this.state.count;
    this.setState({ start: this.state.start - count, limit: this.state.limit - count });
  }

  back() {
    if (this.state.start === 1) this.changeSection('main');
    else {
      this.prevPage();
    }
  }

  cancel() {
    this.setState({ section: 'main' });
    this.props.modalToggle();
  }

  selectCarrier(carrier) {
    let standard = false;
    let kaiser = false;
    for (let i = 0; i < this.props.quotes.length; i += 1) {
      const item = this.props.quotes[i];
      if (item.rfpCarrierId === carrier.rfpCarrierId && item.quoteType === 'KAISER' && this.props.section === types.PLAN_TYPE_MEDICAL) {
        kaiser = true;
      }
      if (item.quoteType === 'STANDARD') {
        standard = true;
      }
    }
    if (carrier.carrier.displayName === this.props.current.carrier && carrier.carrier.displayName === types.UHC) {
      this.setState({ selectedCarrier: carrier });
      // this.changeSection('renewal');
      this.changePage(carrier, false, types.RENEWAL);
    } else if (!kaiser && (standard || this.props.hasClearValue)) this.changePage(carrier, false);
    else if (kaiser && !standard) this.changePage(carrier, true);
    else if (kaiser) {
      this.setState({ selectedCarrier: carrier });
      this.changeSection('kaiser');
    }
  }

  changePage(carrier, kaiser, optionType) {
    let data = carrier;
    if (!data) data = this.state.selectedCarrier;

    this.setState({ section: 'main' });

    this.props.changePage('Overview', false, undefined, 'new', data, { kaiser, optionType });
  }

  render() {
    const { section, carrierList, mainCarrier, clearValueCarrier, showEmptyOption, hasClearValue, hideMultiCarrier, current } = this.props;
    const { limit, start } = this.state;
    let currentCarrier = null;
    let standardWidth = 9;

    if (current.carrier === mainCarrier.carrier.displayName) currentCarrier = mainCarrier;
    else {
      for (let i = 0; i < carrierList.length; i += 1) {
        const item = carrierList[i];

        if (item.carrier.displayName === current.carrier) {
          currentCarrier = item;
          break;
        }
      }
    }

    if (hasClearValue) standardWidth = 6;

    return (
      <Modal
        className="carrier-modal" // eslint-disable-line react/style-prop-objec
        open={this.props.open}
        dimmer="inverted"
        size={((hasClearValue) || this.state.section === 'renewal') ? 'large' : 'small'}
      >
        <a role="button" tabIndex="0" className="close-modal" onClick={this.cancel}>X</a>
        { this.state.section !== 'kaiser' && this.state.section !== 'renewal' &&
        <Header className="presentation-options-header" as="h2">
          Select carrier
        </Header>
        }
        <Modal.Content>
          <Grid stackable>
            { this.state.section === 'kaiser' &&
            <Grid.Row stretched>
              <Grid.Column width={16}>
                <Header className="presentation-options-header kaiser-header" as="h2">How would like to create your Option?</Header>
              </Grid.Column>
              <Grid.Column width={16}>
                <Form onSubmit={(e) => { e.preventDefault(); }}>
                  <Form.Group inline className="kaiser-buttons">
                    <Button size="large" className="kaiser-button blue" onClick={() => { this.changePage(null, false); }}>Full Takeover</Button>
                    <Button size="large" className="kaiser-button blue" onClick={() => { this.changePage(null, true); }}>Alongside Kaiser</Button>
                  </Form.Group>
                </Form>
              </Grid.Column>
            </Grid.Row>
            }
            { this.state.section === 'renewal' &&
            <Grid.Row stretched>
              <Grid.Column width={16}>
                <Header className="presentation-options-header kaiser-header" as="h2">What type of option do you want to add?</Header>
              </Grid.Column>
              <Grid.Column width={16}>
                <Form onSubmit={(e) => { e.preventDefault(); }}>
                  <Form.Group inline className="renewal-buttons">
                    <Button size="large" className="renewal-button blue" onClick={() => { this.changePage(null, false, types.RENEWAL); }}>Renewal</Button>
                    <Button size="large" className="renewal-button blue" onClick={() => { this.changePage(null, false, types.OPTION); }}>New Option</Button>
                    <Button size="large" className="renewal-button blue" onClick={() => { this.changePage(null, false, types.NEGOTIATED); }}>Negotiated</Button>
                  </Form.Group>
                </Form>
              </Grid.Column>
            </Grid.Row>
            }
            { this.state.section === 'main' &&
            <Grid.Row stretched centered>
              <Grid.Column className={(showEmptyOption) ? 'item-empty' : ''} mobile={16} tablet={standardWidth} computer={standardWidth} stretched>
                <a role="link" tabIndex="0" className="main-carrier carrier-content-item" onClick={() => { if (!showEmptyOption) this.selectCarrier(mainCarrier); }}>
                  { mainCarrier.carrier && <CarrierLogo carrier={mainCarrier.carrier.displayName} section={section} /> }
                  {showEmptyOption &&
                    <div className="card-empty-layer">
                      <div className="card-empty-bottom">
                        <div className="card-empty-img" />
                        <div className="card-empty-title1">Standard quote is on the way...</div>
                      </div>
                    </div>
                  }
                </a>
              </Grid.Column>
              { hasClearValue &&
                <Grid.Column mobile={16} tablet={6} computer={6} stretched>
                  <a role="link" tabIndex="0" className="main-carrier carrier-content-item" onClick={() => { this.selectCarrier(clearValueCarrier); }}>
                    { clearValueCarrier.carrier &&
                      <div className="clear-value-logo">
                        <CarrierLogo carrier={mainCarrier.carrier.displayName} section={section} />
                        <Image className="clear-value-image" src={ClearValue} />
                      </div>
                    }
                  </a>
                </Grid.Column>
              }
              {hideMultiCarrier &&
              <Grid.Column mobile={16} tablet={(hasClearValue) ? 4 : 7} computer={(hasClearValue) ? 4 : 7} stretched>
                <a role="button" tabIndex="0" className="other-carrier carrier-content-item" onClick={() => { this.changePage(currentCarrier, false, types.RENEWAL); }}>
                  Renewal
                </a>
              </Grid.Column>
              }
              {!hideMultiCarrier &&
                <Grid.Column width={(hasClearValue) ? 1 : 3} only="computer">
                  <div className="carrier-divider vertical">
                    OR
                  </div>
                </Grid.Column>
              }
              {!hideMultiCarrier &&
              <Grid.Column width={(hasClearValue) ? 1 : 3} only="tablet">
                <div className="carrier-divider vertical">
                  OR
                </div>
              </Grid.Column>
              }
              {!hideMultiCarrier &&
              <Grid.Column width={16} only="mobile">
                <div className="carrier-divider horizontal">
                  OR
                </div>
              </Grid.Column>
              }
              {!hideMultiCarrier &&
              <Grid.Column mobile={16} tablet={(hasClearValue) ? 3 : 4} computer={(hasClearValue) ? 3 : 4} stretched>
                <a role="button" tabIndex="0" className="other-carrier carrier-content-item" onClick={() => { this.changeSection('list'); }}>
                  Other Carrier
                </a>
              </Grid.Column>
              }
            </Grid.Row>
            }
            { this.state.section === 'list' &&
            <Grid.Row stretched className="other-container" columns={(hasClearValue) ? 4 : 3}>
              {carrierList.map((item, i) => {
                if (i + 1 >= start && i + 1 <= limit && item.carrier.name !== 'ANTHEM_CLEAR_VALUE') {
                  return (
                    <Grid.Column key={i} className={(hasClearValue) ? 'large' : 'small'}>
                      <a role="button" tabIndex="0" className="item-list-carrier carrier-content-item" onClick={() => { this.selectCarrier(item); }}>
                        <CarrierLogo carrier={item.carrier.displayName} section={section} />
                      </a>
                    </Grid.Column>
                  );
                }
                return false;
              })}
              { limit < carrierList.length &&
              <Grid.Column stretched className={(hasClearValue) ? 'large' : 'small'}>
                <a role="button" tabIndex="0" className="item-list-carrier carrier-content-item" onClick={() => { this.nextPage(); }}>
                  More Carriers...
                </a>
              </Grid.Column>
              }
            </Grid.Row>
            }
          </Grid>
        </Modal.Content>
        <div className="carrier-actions">
          { this.state.section === 'main' && <Button basic onClick={() => { this.cancel(); }}>Cancel</Button> }
          { this.state.section === 'list' && <Button basic onClick={this.back}>Back</Button> }
        </div>
      </Modal>
    );
  }
}

export default CarriersModal;
