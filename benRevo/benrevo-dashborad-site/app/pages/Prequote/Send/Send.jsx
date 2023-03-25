import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router';
import { Card, Grid, Header, Tab, Checkbox, Button, Loader } from 'semantic-ui-react';
import {
  selectSectionTitle,
} from '@benrevo/benrevo-react-rfp';
import Plans from './components/Plans';
import Summary from './components/Summary';
import * as types from '../constants';

class Send extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    sent: PropTypes.bool.isRequired,
    sending: PropTypes.bool.isRequired,
    products: PropTypes.object.isRequired,
    getQuotePlans: PropTypes.func.isRequired,
    quotes: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    history: PropTypes.array.isRequired,
    premiumCredit: PropTypes.number.isRequired,
    projectedBundleDiscount: PropTypes.number.isRequired,
    totalAnnualPremium: PropTypes.number.isRequired,
    totalAnnualPremiumWithDiscount: PropTypes.number.isRequired,
    projectedBundleDiscountPercent: PropTypes.number.isRequired,
    discounts: PropTypes.object.isRequired,
    summaries: PropTypes.object.isRequired,
    clientMembers: PropTypes.array.isRequired,
    changeDiscount: PropTypes.func.isRequired,
    getSummary: PropTypes.func.isRequired,
    changeSummary: PropTypes.func.isRequired,
    changeSentBroker: PropTypes.func.isRequired,
    sendToBroker: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { getQuotePlans, getSummary, changeSentBroker } = this.props;
    getQuotePlans();
    getSummary();
    changeSentBroker(false);
  }

  render() {
    const {
      client,
      quotes,
      products,
      history,
      premiumCredit,
      projectedBundleDiscount,
      totalAnnualPremium,
      totalAnnualPremiumWithDiscount,
      projectedBundleDiscountPercent,
      discounts,
      changeDiscount,
      changeSummary,
      sendToBroker,
      summaries,
      clientMembers,
      sent,
      sending,
    } = this.props;
    const panes = [];
    const summaryPanes = [];
    const isEmpty = !Object.keys(quotes[types.MEDICAL_SECTION]).length && !Object.keys(quotes[types.DENTAL_SECTION]).length && !Object.keys(quotes[types.VISION_SECTION]).length && !Object.keys(quotes[types.LIFE_SECTION]).length;
    for (let i = 0; i < Object.keys(products).length; i += 1) {
      const key = Object.keys(products)[i];
      const product = products[key];

      if (product) {
        panes.push({ menuItem: selectSectionTitle(key).toUpperCase(), render: () => <Plans data={quotes[key]} client={client} section={key} /> });
        summaryPanes.push({ menuItem: selectSectionTitle(key).toUpperCase(), render: () => <Summary text={summaries[key] || ''} section={key} changeSummary={changeSummary} /> });

        if (key === types.MEDICAL_SECTION) panes.push({ menuItem: 'MED/KAISER', render: () => <Plans data={quotes.kaiser} client={client} section="kaiser" /> });
      }
    }
    return (
      <Card className="prequoted-send main-card" fluid>
        <Card.Content>
          { !sent &&
            <Grid>
              <Grid.Row>
                <Grid.Column width={16} textAlign="center">
                  <Header as="h1" className="title1">Send to Broker</Header>
                  <div className="title1-description">
                    Review the below information for accuracy. Enter your messages to the broker, then send your quote on it’s way!
                  </div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={16}>
                        <Tab className="tab-menu" panes={panes} />
                      </Grid.Column>
                    </Grid.Row>
                    {!isEmpty &&
                    <Grid.Row>
                      <Grid.Column width={8}>
                        <div className="header-border">Discounts</div>
                        <div className="discounts">
                          <div>Check product below:</div>
                          <ul className="discounts-list">
                            { Object.keys(products).map((key) => {
                              if (key !== 'medical' && products[key]) {
                                return (
                                  <li key={key}>
                                    <Checkbox
                                      className="small-grey"
                                      label={selectSectionTitle(key)}
                                      checked={discounts[key]}
                                      onChange={(e, inputState) => { changeDiscount(key, inputState.checked); }}
                                    />
                                  </li>
                                );
                              }
                              return false;
                            })}
                          </ul>
                          <ul className="leaders">
                            <li>
                              <div className="title"><span>Bundle Discount</span></div>
                              <div className="nums"><span className="nums-blue">{projectedBundleDiscountPercent}%</span></div>
                            </li>
                          </ul>
                        </div>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <div className="header-border">Totals</div>
                        <ul className="leaders">
                          <li>
                            <div className="title"><span>Total Annual Premium</span></div>
                            <div className="nums"><span className="nums-blue">${totalAnnualPremium}</span></div>
                          </li>
                          <li>
                            <div className="title"><span>Projected Bundle Discount</span></div>
                            <div className="nums">( <span className="nums-blue">${projectedBundleDiscount}</span> )</div>
                          </li>
                          <li>
                            <div className="title"><span>Premium Credit</span></div>
                            <div className="nums total"><span>( <span className="nums-blue">${premiumCredit}</span> )</span></div>
                          </li>
                        </ul>
                      </Grid.Column>
                    </Grid.Row>
                    }
                    {!isEmpty &&
                    <Grid.Row className="total-line">
                      <Grid.Column width={10}>
                        Total Annual Premium (All products & discounts)
                      </Grid.Column>
                      <Grid.Column width={6} textAlign="right">
                        ${totalAnnualPremiumWithDiscount}
                      </Grid.Column>
                    </Grid.Row>
                    }
                    {!isEmpty &&
                    <Grid.Row>
                      <Grid.Column width={16}>
                        <Card fluid className="inner">
                          <Grid stackable>
                            <Grid.Row>
                              <Grid.Column width={15}>
                                <Header as="h4">Quote summary</Header>
                                <div>Enter your message(s) in each <b>TAB</b> below that will be included in the quote notification email sent to the broker.</div>
                                <Tab className="tab-menu small" panes={summaryPanes} />
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Card>
                      </Grid.Column>
                    </Grid.Row>
                    }
                    {!isEmpty &&
                    <Grid.Row>
                      <Grid.Column width={16}>
                        <Card fluid className="inner">
                          <Grid stackable>
                            <Grid.Row>
                              <Grid.Column width={16}>
                                <Header as="h4">Send to Broker</Header>
                              </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                              <Grid.Column width={10}>
                                <div><b>Brokerage:</b> {client.brokerName}</div>
                                <div className="members-list">
                                  <div><b>List of team members who will receive this quote</b></div>
                                  <div>
                                    { clientMembers.map((item, i) => <div key={i} className="members-item">{item.fullName}</div>)}
                                  </div>
                                </div>
                                <div className="button-line">
                                  <Button disabled={sending} primary size="big" fluid className="send-button" onClick={sendToBroker}>Send to Broker</Button>
                                  <Loader inline active={sending} />
                                </div>
                                <div className="send-message">
                                  <div className="send-message-title">What happens next:</div>
                                  <ul>
                                    <li>The broker contact(s) will receive a quote notification email</li>
                                    <li>The SAR and SAE will both be included on the email</li>
                                    <li>The quote and options you created will be available for the broker to review</li>
                                    <li>Update the quoted rates at anytime by revisiting the Upload Quote section</li>
                                  </ul>
                                </div>
                              </Grid.Column>
                              <Grid.Column width={6}>
                                <Grid>
                                  <Grid.Row>
                                    <Grid.Column width={16}>
                                      <div className="history-list">
                                        <Header as="h3" className="title-form">History of request(s):</Header>
                                        { history.map((item, i) =>
                                          <div className="history-item" key={i}>
                                            <div className="history-info">{types[item.name]}</div>
                                            <div className="history-date">{item.date}</div>
                                          </div>
                                        )}
                                      </div>
                                    </Grid.Column>
                                  </Grid.Row>
                                </Grid>
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Card>
                      </Grid.Column>
                    </Grid.Row>
                    }
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          }
          { sent &&
          <Grid className="send-page">
            <Grid.Row>
              <Grid.Column width={16} textAlign="center">
                <Header as="h1" className="title1">Send to Broker</Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16} textAlign="center">
                <div className="send-icon" />
                <div className="send-title">Quote has been sent to the Broker</div>
                <div className="send-date"> on {moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')}</div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <Grid.Column computer={12} tablet={16}>
                <div className="send-message">
                  <div className="send-message-title">What happens next:</div>
                  <ul>
                    <li>The broker contact(s) will receive a quote notification email</li>
                    <li>The SAR and SAE will both be included on the email</li>
                    <li>The quote and options you created will be available for the broker to review</li>
                    <li>Update the quoted rates at anytime by revisiting the Upload Quote section</li>
                  </ul>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <Grid.Column computer={5} tablet={16} mobile={16}>
                <Button as={Link} to="/prequote/clients" primary size="big" fluid>{'<'} Back to Clients</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          }
        </Card.Content>
      </Card>
    );
  }
}

export default Send;
