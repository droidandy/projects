import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Card, Grid, Header, Button, Table, Loader } from 'semantic-ui-react';
import {
  selectSectionTitle,
} from '@benrevo/benrevo-react-rfp';
import { validateSection } from './FormValidator';

class Summary extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    client: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
    rfpClient: PropTypes.object.isRequired,
    medical: PropTypes.object.isRequired,
    dental: PropTypes.object.isRequired,
    vision: PropTypes.object.isRequired,
    life: PropTypes.object.isRequired,
    std: PropTypes.object.isRequired,
    ltd: PropTypes.object.isRequired,
    rfpCreated: PropTypes.bool.isRequired,
    loadingOptimizer: PropTypes.bool.isRequired,
    plansLoaded: PropTypes.bool.isRequired,
    changeShowErrors: PropTypes.func.isRequired,
    downloadOptimizer: PropTypes.func.isRequired,
    rfpSubmitDate: PropTypes.string,
  };

  componentWillMount() {
    const { rfpCreated } = this.props;
    validateSection(this.props);

    if (rfpCreated) {
      this.setState({ rfpSaved: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.plansLoaded && !this.props.plansLoaded) {
      validateSection(nextProps);
    }
  }

  render() {
    const {
      client,
      products,
      plansLoaded,
      changeShowErrors,
      downloadOptimizer,
      rfpClient,
      medical,
      dental,
      vision,
      life,
      std,
      ltd,
      rfpSubmitDate,
      loadingOptimizer,
    } = this.props;
    let isComplete = rfpClient.complete;

    if ((!medical.complete && products.medical) || (!dental.complete && products.dental) || (!vision.complete && products.vision) || (!life.complete && products.life) || (!std.complete && products.std) || (!ltd.complete && products.ltd)) {
      isComplete = false;
    }

    return (
      <Card className="prequoted-summary main-card" fluid>
        <Card.Content>
          <Grid>
            <Grid.Row>
              <Grid.Column width={16} textAlign="center">
                <Header as="h1" className="title1">Information Summary</Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <Table className="stripped" fixed>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell width={3}>Section</Table.HeaderCell>
                      <Table.HeaderCell width={8}>STATUS/MISSING DATA</Table.HeaderCell>
                      <Table.HeaderCell width={5}>LAST UPDATED</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        Client
                      </Table.Cell>
                      <Table.Cell className="client-complete">
                        { plansLoaded && rfpClient.complete && 'Complete' }
                        { plansLoaded && !rfpClient.complete &&
                        <div className="error-link">
                          <span>Missing Information</span>
                          <Button className="btnLink" onClick={() => { changeShowErrors(true); }} as={Link} to={`/prequote/clients/${client.id}/client/info`}>Jump to page</Button>
                        </div>
                        }
                        {!plansLoaded &&
                        <div className="error-link">
                          <Loader inline active={!plansLoaded} size="small" />
                        </div>
                        }
                      </Table.Cell>
                      <Table.Cell>{rfpSubmitDate || 'N/A'}</Table.Cell>
                    </Table.Row>
                    {Object.keys(products).map((product, i) => {
                      if (products[product]) {
                        return (
                          <Table.Row key={i}>
                            <Table.Cell verticalAlign="top">
                              {selectSectionTitle(product)}
                            </Table.Cell>
                            <Table.Cell className={`${product}-complete`}>
                              <div>
                                {plansLoaded && this.props[product].valid && Object.keys(this.props[product].valid).map((page, j) => {
                                  if (!this.props[product].valid[page]) {
                                    return (
                                      <div key={j} className="error-link">
                                        <span>{page}</span>
                                        <Button className="btnLink" as={Link} onClick={() => { changeShowErrors(true); }} to={`/prequote/clients/${client.id}/${product}/${(page === 'information') ? 'info' : page}`}>Jump to page</Button>
                                      </div>
                                    );
                                  }

                                  return null;
                                })}
                                {plansLoaded && this.props[product].complete &&
                                <div className="error-link">
                                  <span>Complete</span>
                                </div>
                                }
                                {!plansLoaded &&
                                <div className="error-link">
                                  <Loader inline active={!plansLoaded} size="small" />
                                </div>
                                }
                              </div>
                            </Table.Cell>
                            <Table.Cell verticalAlign="top">{this.props[product].lastUpdated || 'N/A'}</Table.Cell>
                          </Table.Row>
                        );
                      }

                      return null;
                    })}
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16} className="optimizer-line">
                <Button
                  disabled={loadingOptimizer || !plansLoaded}
                  color="grey" size="medium" primary onClick={downloadOptimizer}
                >Download Optimizer</Button>
                <Loader inline active={loadingOptimizer} size="small" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <div className="bottom-actions">
            <Button
            //  disabled={!isComplete}
              as={Link} to={`/prequote/clients/${client.id}/rater`} primary floated={'right'} size="big"
            >Continue</Button>
          </div>
        </Card.Content>
      </Card>
    );
  }
}

export default Summary;
