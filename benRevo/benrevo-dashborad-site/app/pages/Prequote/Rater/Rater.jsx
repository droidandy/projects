import React from 'react';
import moment from 'moment';
import { Link, withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Card, Grid, Header, Button, Dropdown, Form, TextArea, Loader } from 'semantic-ui-react';
import BlockerModal from '../components/BlockerModal/BlockerModal';
import { validateSection } from '../Summary/FormValidator';
import * as types from '../constants';

class Rater extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    changeRater: PropTypes.func.isRequired,
    changeNote: PropTypes.func.isRequired,
    sendToRater: PropTypes.func.isRequired,
    changeSent: PropTypes.func.isRequired,
    raters: PropTypes.array.isRequired,
    history: PropTypes.array.isRequired,
    note: PropTypes.string.isRequired,
    selectedRater: PropTypes.number,
    sending: PropTypes.bool.isRequired,
    sent: PropTypes.bool.isRequired,
    products: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    rfpCreated: PropTypes.bool.isRequired,
  };
  state = {
    isModalOpen: false,
  };

  componentWillMount() {
    const { changeSent, rfpCreated } = this.props;
    changeSent(false);

    if (rfpCreated) {
      validateSection(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { products } = this.props;
    if (this.props.rfpCreated !== nextProps.rfpCreated) {
      validateSection(nextProps);
    }
    Object.keys(nextProps.products).map((product) => {
      if (products[product]) {
        if (Object.keys(nextProps[product].formErrors).length) {
          this.setState({
            isModalOpen: true,
          });
        }
      }
    });
  }

  render() {
    const {
      raters,
      history,
      changeRater,
      changeNote,
      sendToRater,
      note,
      selectedRater,
      sending,
      sent,
    } = this.props;
    const { isModalOpen } = this.state;
    const clientId = this.props.params.clientId ? this.props.params.clientId : 'new';
    const link = `prequote/clients/${clientId}/summary`;

    return (
      <Card className="prequoted-rater main-card" fluid>
        {
          !isModalOpen ?
            <Card.Content>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16} textAlign="center">
                    <Header as="h1" className="title1 line">Send Information to Rater</Header>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={16} className="wrap">
                    { !sent &&
                      <Card fluid className="inner">
                        <Grid stackable>
                          <Grid.Row>
                            <Grid.Column width={10}>
                              <Header as="h3" className="title-form">Select Rater</Header>
                              <Dropdown
                                placeholder="Select a rater"
                                selection
                                options={raters}
                                value={selectedRater}
                                selectOnBlur={false}
                                onChange={(e, inputState) => { changeRater(inputState.value); }}
                              />
                              <Header as="h3" className="title-form">Add a note</Header>
                              <Form>
                                <TextArea
                                  rows={5}
                                  value={note}
                                  onChange={(e, inputState) => { changeNote(inputState.value); }}
                                />
                              </Form>
                              <Grid>
                                <Grid.Row>
                                  <Grid.Column computer={9} tablet={15} mobile={15}>
                                    <Button disabled={!selectedRater || !note || sending} primary size="big" fluid onClick={sendToRater}>Send Request</Button>
                                  </Grid.Column>
                                  <Grid.Column width={1} verticalAlign="middle">
                                    <Loader inline active={sending} />
                                  </Grid.Column>
                                </Grid.Row>
                              </Grid>
                            </Grid.Column>
                            <Grid.Column width={1} only="computer" />
                            <Grid.Column width={5}>
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
                    }
                    { sent &&
                      <Grid className="send-page">
                        <Grid.Row>
                          <Grid.Column width={16} textAlign="center">
                            <div className="send-icon" />
                            <div className="send-title">Information has been submitted to Rater</div>
                            <div className="send-date"> on {moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')}</div>
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row centered>
                          <Grid.Column computer={12} tablet={16}>
                            <div className="send-message">
                              <div className="send-message-title">What happens next:</div>
                              <ul>
                                <li>Rater will receive rate request via email including a copy of the optimizer attached</li>
                                <li>You and the SAE will both receive a copy of the email, with the optimizer attached</li>
                                <li>Upon receipt of a quote from the Rater, <b>proceed to the Upload Quote section</b></li>
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
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
          :
            <BlockerModal
              open={isModalOpen}
              title="We need a little more info"
              description="Before moving to the Match Plans section, the missing fields need to be populated"
              link={link}
            />
        }
      </Card>
    );
  }
}

export default withRouter(Rater);
