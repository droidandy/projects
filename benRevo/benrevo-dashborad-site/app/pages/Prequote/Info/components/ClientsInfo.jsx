import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Form, Input } from 'semantic-ui-react';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import {
  CLIENT_NAME,
  SIC_CODE,
  ZIP,
  EFFECTIVE_DATE,
  DUE_DATE,
  DBA,
} from '@benrevo/benrevo-react-clients';

class ClientsInfo extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    updateClient: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
  };

  onChangeHandler = (e, inputState) => {
    this.props.updateClient(e.target.name, inputState.value);
  }

  onNumberChangeHandler = (e) => {
    this.props.updateClient(e.target.name, e.target.value);
  }

  render() {
    const {
      updateClient,
      client,
    } = this.props;

    return (
      <Fragment>
        <Grid.Row>
          <Grid.Column width={16} >
            <Header as="h3" className="title2">CLIENT INFO</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={6} >
          </Grid.Column>
          <Grid.Column width={10} >
            <Header as="h4" className="title-form">What is the client&apos;s name?</Header>
            <Form.Field>
              <Input
                placeholder="Enter the client's name"
                name={CLIENT_NAME}
                value={client.clientName ? client.clientName : ''}
                fluid
                onChange={this.onChangeHandler}
              />
            </Form.Field>
            <Header as="h4" className="title-form">What is your client&apos;s DBA?</Header>
            <Form.Field>
              <Input
                name={DBA}
                placeholder="Enter your client's DBA"
                value={client.dba ? client.dba : ''}
                fluid
                onChange={this.onChangeHandler}
              />
            </Form.Field>
            <Header as="h4" className="title-form">What is your client&apos;s SIC Code?</Header>
            <NumberFormat
              customInput={Input}
              allowNegative={false}
              placeholder="Enter your client's SIC code"
              name={SIC_CODE}
              value={client.sicCode ? client.sicCode : ''}
              fluid
              format="####"
              onChange={this.onNumberChangeHandler}
            />
            <Header as="h4" className="title-form">Zip Code</Header>
            <NumberFormat
              customInput={Input}
              allowNegative={false}
              placeholder="Zip Code"
              name={ZIP}
              value={client.zip ? client.zip : ''}
              fluid
              format="#####"
              onChange={this.onNumberChangeHandler}
            />
            <Header as="h4" className="title-form">Effective date</Header>
            <DatePicker
              className="datepicker"
              name={EFFECTIVE_DATE}
              fluid
              selected={client.effectiveDate ? moment(Date.parse(client.effectiveDate)) : null}
              placeholderText="Enter the effective date"
              onChange={(date) => { updateClient(EFFECTIVE_DATE, (date) ? moment(date).format('L') : ''); }}
            />
            <Header as="h4" className="title-form">RFP Due Date</Header>
            <DatePicker
              className="datepicker"
              name={DUE_DATE}
              fluid
              placeholderText="Enter RFP Due Date"
              selected={client.dueDate ? moment(Date.parse(client.dueDate)) : null}
              onChange={(date) => { updateClient(DUE_DATE, (date) ? moment(date).format('L') : ''); }}
            />
          </Grid.Column>
        </Grid.Row>
      </Fragment>
    );
  }
}

export default ClientsInfo;
