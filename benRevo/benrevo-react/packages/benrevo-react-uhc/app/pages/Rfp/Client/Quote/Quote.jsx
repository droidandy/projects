import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Header, Grid, Segment, Button, Image, Table } from 'semantic-ui-react';
import { ClearValue, AnthemLogo } from '@benrevo/benrevo-react-core';
import { FormBase } from '@benrevo/benrevo-react-rfp';

class Quote extends FormBase { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
  };

  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Helmet
          title="Client Quote"
          meta={[
            { name: 'description', content: 'Description of client quote' },
          ]}
        />
        <Grid stackable columns={2} as={Segment} className="gridSegment rfpClientQuote">
          <Grid.Row>
            <Grid.Column width={16}>
              <Header as="h1" className="rfpPageHeading" style={{textTransform: 'none'}}>You’ll get both an instant quote AND standard quote.</Header>
              <div>Two unique products that help you find the right solution for your client.</div>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row className="rfpRowDivider">
            <Grid.Column tablet={16} computer={16} largeScreen={12}>
              <Table celled stackable className="clear-value-table">
                <Table.Body>
                  <Table.Row>
                    <Table.Cell verticalAlign="top" width="7">
                      <Image className="logo" src={AnthemLogo} />
                      <Image className="clear-value-logo" src={ClearValue} />
                    </Table.Cell>
                    <Table.Cell width="11">
                      <ul>
                        <li className="item-bold">Instant quote</li>
                        <li>Simple portfolio of options</li>
                        <li>Only available online</li>
                      </ul>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell verticalAlign="top">
                      <Image className="logo" src={AnthemLogo} />
                    </Table.Cell>
                    <Table.Cell>
                      <ul>
                        <li className="item-bold">Standard quote</li>
                        <li>Full portfolio of options</li>
                      </ul>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
            <div>Next step is to update your client RFP information...</div>
            <div className="clear-value-note">****  Please note: all fields are required unless otherwise noted.  Thank You. ****</div>
          </Grid.Row>
          <Grid.Row>
            <div className="pageFooterActions">
              <Button onClick={() => { this.changePage('next') }} primary floated={'right'} size="big">Continue</Button>
            </div>

          </Grid.Row>
        </Grid>
      </div>
    );
  }
}


export default Quote;
