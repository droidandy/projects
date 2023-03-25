import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { Grid, Segment, Header, Button, Form } from 'semantic-ui-react';

class Deny extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    denyReason: PropTypes.string.isRequired,
    current: PropTypes.object.isRequired,
    changeField: PropTypes.func.isRequired,
    decline: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  onChangeHandler(e, inputState) {
    this.props.changeField(e.target.name, inputState.value);
  }

  render() {
    const { current, denyReason, decline } = this.props;
    return (
      <div>
        <Link to="/accounts/details" className="back">{'<'} Back to account detail</Link>
        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row className="header-main">
            <Helmet
              title="Deny"
              meta={[
                { name: 'description', content: 'Description of Deny' },
              ]}
            />
            <div>
              <Header as="h2">Deny GA Account</Header>
            </div>
            <div className="meta-info">
              <div><span>Date</span> {current.created}</div>
              <div><span>ID</span> {current.id}</div>
            </div>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="4">
              <div className="column-header">GA information</div>
              <div>{current.gaName}</div>
              <div>{current.gaAddress}</div>
              <div>{current.gaCity}, {current.gaState} {current.gaZip}</div>
              <div>{current.agentName}</div>
              <div>{current.agentEmail}</div>
            </Grid.Column>
            <Grid.Column width="4">
              <div className="column-header">Brokerage information</div>
              <div>{current.brokerName}</div>
              <div>{current.brokerAddress}</div>
              <div>{current.brokerCity}, {current.brokerState} {current.brokerZip}</div>
              <div>{current.brokerEmail}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="12">
              <div className="divider" />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="12">
              <Form>
                <Form.TextArea value={denyReason} name="denyReason" label="Reason for denial" onChange={this.onChangeHandler} />
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="5" />
            <Grid.Column width="3" style={{ paddingRight: 0 }}>
              <Button as={Link} to="/accounts/details" fluid size="medium" color="grey" className="action-button" primary>Cancel</Button>
            </Grid.Column>
            <Grid.Column width="4">
              <Button fluid size="medium" color="orange" className="action-button" primary onClick={decline}>Send Denial Email</Button>
            </Grid.Column>
          </Grid.Row>

        </Grid>
      </div>
    );
  }
}

export default Deny;
