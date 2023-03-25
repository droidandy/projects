import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Segment, Grid, Header, Button, Form, Input, Radio, Dropdown, Table, Dimmer, Loader, Message, Icon } from 'semantic-ui-react';
import * as types from './constants';
import { COUNTIES } from './counties';
import ClearValueResultsItem from './components/ClearValueResultsItem';

class ClearValue extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    calculated: PropTypes.object,
    ratingTiers: PropTypes.number.isRequired,
    medicalPaymentMethod: PropTypes.string.isRequired,
    dentalPaymentMethod: PropTypes.string.isRequired,
    commission: PropTypes.string.isRequired,
    dentalCommission: PropTypes.string.isRequired,
    turnOnMedical1Percent: PropTypes.string.isRequired,
    sicCode: PropTypes.string.isRequired,
    averageAge: PropTypes.string.isRequired,
    effectiveDate: PropTypes.string.isRequired,
    predominantCounty: PropTypes.string.isRequired,
    changeClearValue: PropTypes.func.isRequired,
    clearValueCalculate: PropTypes.func.isRequired,
    error: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  render() {
    const {
      calculated,
      ratingTiers,
      changeClearValue,
      medicalPaymentMethod,
      dentalPaymentMethod,
      commission,
      dentalCommission,
      sicCode,
      averageAge,
      turnOnMedical1Percent,
      effectiveDate,
      predominantCounty,
      clearValueCalculate,
      loading,
      error,
    } = this.props;
    const show = ((calculated.medical && calculated.medical.length > 0) || (calculated.dental && calculated.dental.length > 0) || (calculated.vision && calculated.vision.length > 0)) && !loading;
    const disabled = !commission || !sicCode || !averageAge || !effectiveDate || !predominantCounty;
    return (
      <div className="plans-anthem">
        <Helmet
          title="Clear Value"
          meta={[
            { name: 'description', content: 'Description of Anthem' },
          ]}
        />

        <Grid stackable as={Segment} className="gridSegment">
          <Grid.Row className="header-main">
            <Header as="h2">Clear Value Rate Calculator</Header>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row className="table-row">
            <Grid.Column width={5}>
              <Header as="h3" className="page-section-heading">Tiers</Header>
            </Grid.Column>
            <Grid.Column width={11}>
              <Header as="h3" className="page-form-set-heading">How many ratings tiers are there?</Header>
              <Button.Group>
                <Button name="buttonTier2" onClick={() => { changeClearValue('ratingTiers', 2); }} toggle active={ratingTiers === 2} size="medium">2</Button>
                <Button name="buttonTier3" onClick={() => { changeClearValue('ratingTiers', 3); }} toggle active={ratingTiers === 3} size="medium">3</Button>
                <Button name="buttonTier4" onClick={() => { changeClearValue('ratingTiers', 4); }} toggle active={ratingTiers === 4} size="medium">4</Button>
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="table-row">
            <Grid.Column width={5}>
              <Header as="h3" className="page-section-heading">Requested Commission Schedule for Medical</Header>
            </Grid.Column>
            <Grid.Column width={11}>
              <Header as="h3" className="page-form-set-heading">How do you get paid?</Header>
              <Button.Group className="button-group">
                <Button
                  onClick={() => { changeClearValue('medicalPaymentMethod', types.PERCENTAGE); }}
                  toggle
                  active={medicalPaymentMethod === types.PERCENTAGE}
                  size="massive"
                >{types.PERCENTAGE}</Button>
                <Button
                  onClick={() => { changeClearValue('medicalPaymentMethod', types.PEPM); }}
                  toggle
                  active={medicalPaymentMethod === types.PEPM}
                  size="massive"
                >{types.PEPM}</Button>
                <Button
                  onClick={() => { changeClearValue('medicalPaymentMethod', types.NET); }}
                  toggle
                  active={medicalPaymentMethod === types.NET}
                  size="massive"
                >Net Of Commissions</Button>
              </Button.Group>
              {medicalPaymentMethod !== types.NET &&
              <Form.Field inline>
                <Header as="h3" className="page-form-set-heading">What is your commission</Header>
                <Input
                  name="commissionAmount"
                  placeholder="Commission Amount"
                  value={commission}
                  onChange={(e, inputState) => { changeClearValue('commission', inputState.value); }}
                />
              </Form.Field>
              }
              <Header as="h3" className="page-form-set-heading">Add 1% to medical plans?</Header>
              <Form>
                <Form.Field>
                  <Radio
                    label="Yes"
                    value="yes"
                    checked={turnOnMedical1Percent === 'yes'}
                    onChange={(e, inputState) => { changeClearValue('turnOnMedical1Percent', inputState.value); }}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label="No"
                    value="no"
                    checked={turnOnMedical1Percent === 'no'}
                    onChange={(e, inputState) => { changeClearValue('turnOnMedical1Percent', inputState.value); }}
                  />
                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="table-row">
            <Grid.Column width={5}>
              <Header as="h3" className="page-section-heading">Requested Commission Schedule for Dental</Header>
            </Grid.Column>
            <Grid.Column width={11}>
              <Header as="h3" className="page-form-set-heading">How do you get paid?</Header>
              <Button.Group className="button-group">
                <Button
                  onClick={() => { changeClearValue('dentalPaymentMethod', types.PERCENTAGE); }}
                  toggle
                  active={dentalPaymentMethod === types.PERCENTAGE}
                  size="massive"
                >{types.PERCENTAGE}</Button>
                <Button
                  onClick={() => { changeClearValue('dentalPaymentMethod', types.PEPM); }}
                  toggle
                  active={dentalPaymentMethod === types.PEPM}
                  size="massive"
                >{types.PEPM}</Button>
                <Button
                  onClick={() => { changeClearValue('dentalPaymentMethod', types.NET); }}
                  toggle
                  active={dentalPaymentMethod === types.NET}
                  size="massive"
                >Net Of Commissions</Button>
              </Button.Group>
              {dentalPaymentMethod !== types.NET &&
              <Form.Field inline>
                <Header as="h3" className="page-form-set-heading">What is your commission</Header>
                <Input
                  name="commissionAmount"
                  placeholder="Commission Amount"
                  value={dentalCommission}
                  onChange={(e, inputState) => { changeClearValue('dentalCommission', inputState.value); }}
                />
              </Form.Field>
              }
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="table-row">
            <Grid.Column width={5}>
              <Header as="h3" className="page-section-heading">Information</Header>
            </Grid.Column>
            <Grid.Column width={11}>
              <Header as="h3" className="page-form-set-heading">What is your client&apos;s SIC Code?</Header>
              <Input
                placeholder="Enter your client's SIC code"
                name="sicCode"
                value={sicCode}
                onChange={(e, inputState) => { changeClearValue('sicCode', inputState.value); }}
              />
              <Header as="h3" className="page-form-set-heading">In what county is the group located?</Header>
              <Form.Field inline>
                <Dropdown
                  placeholder="Select county"
                  search
                  selection
                  options={COUNTIES}
                  name="predominantCounty"
                  value={predominantCounty}
                  onChange={(e, inputState) => { changeClearValue('predominantCounty', inputState.value); }}
                />
              </Form.Field>
              <Header as="h3" className="page-form-set-heading">What is the average age of eligible employees?</Header>
              <Input
                placeholder="Enter your client's SIC code"
                name="sicCode"
                value={averageAge}
                onChange={(e, inputState) => { changeClearValue('averageAge', inputState.value); }}
              />
              <Header as="h3" className="page-form-set-heading">Effective date</Header>
              <DatePicker
                className="datepicker"
                name="effectiveDate"
                placeholderText="Enter the effective date"
                selected={(effectiveDate) ? moment(effectiveDate, ['L']) : null}
                onChange={(date) => { changeClearValue('effectiveDate', (date) ? moment(date).format('L') : ''); }}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={11} only="computer">
            </Grid.Column>
            <Grid.Column tablet={16} computer={5}>
              <Button disabled={disabled} onClick={clearValueCalculate} primary size="big">Create</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid stackable as={Segment} className="gridSegment">
          <Message warning hidden={!error}>
            <Message.Header>
              <Icon name="warning circle" />Oh No! There was a error calculating your Clear Value. Please refresh and try again.</Message.Header>
          </Message>
          <Grid.Row className="header-main">
            <Header as="h2">Results</Header>
            <div className="divider" />
          </Grid.Row>
          <Grid.Row>
            <Dimmer active={loading} inverted>
              <Loader indeterminate size="big">Getting Plans</Loader>
            </Dimmer>
            <Table className="data-table column-strip" unstackable>
              <Table.Header>
                <Table.Row className="data-table-head">
                  <Table.HeaderCell width="3">Product</Table.HeaderCell>
                  <Table.HeaderCell width="3">Network</Table.HeaderCell>
                  <Table.HeaderCell width="2">Plan</Table.HeaderCell>
                  <Table.HeaderCell width="2">Tier 1</Table.HeaderCell>
                  <Table.HeaderCell width="2">Tier 2</Table.HeaderCell>
                  <Table.HeaderCell width="2">Tier 3</Table.HeaderCell>
                  <Table.HeaderCell width="2">Tier 4</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              { show &&
              <Table.Body>
                { calculated.medical.length > 0 &&
                  calculated.medical.map(
                  (item) => {
                    const plans = item.quoteNetworkPlans;
                    return (
                      plans.map(
                        (plan, j) => <ClearValueResultsItem key={j} data={plan} title="Medical" index={j} rfpQuoteNetwork={item.rfpQuoteNetwork} />
                      )
                    );
                  })
                }
                { calculated.dental.length > 0 &&
                  calculated.dental.map(
                  (item) => {
                    const plans = item.quoteNetworkPlans;
                    return (
                      plans.map(
                        (plan, j) => <ClearValueResultsItem key={j} data={plan} title="Dental" index={j} rfpQuoteNetwork={item.rfpQuoteNetwork} />
                      )
                    );
                  })
                }
                { calculated.vision.length > 0 &&
                  calculated.vision.map(
                  (item) => {
                    const plans = item.quoteNetworkPlans;
                    return (
                      plans.map(
                        (plan, j) => <ClearValueResultsItem key={j} data={plan} title="Vision" index={j} rfpQuoteNetwork={item.rfpQuoteNetwork} />
                      )
                    );
                  })
                }
              </Table.Body>
              }
            </Table>
            { !show &&
            <div className="empty">You have no plans for preview</div>
            }
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default ClearValue;
