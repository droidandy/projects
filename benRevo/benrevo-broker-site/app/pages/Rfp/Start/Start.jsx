import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { Grid, Header, Segment, Button, Form, Radio, Loader } from 'semantic-ui-react';
import Navigation from '../../../components/Navigation';

class StartPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    clientSaveInProgress: PropTypes.bool.isRequired,
    client: PropTypes.object.isRequired,
    updateClient: PropTypes.func.isRequired,
    saveClient: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    clientId: PropTypes.string,
  };

  static defaultProps = {
    clientId: '',
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.clientSaveInProgress && this.props.clientSaveInProgress) {
      const nextPage = (!nextProps.client.submittedRfpSeparately) ? `/clients/${nextProps.clientId}/rfp` : `/clients/${nextProps.clientId}`;
      nextProps.changePage(nextPage);
    }
  }

  render() {
    const { client, updateClient, saveClient, clientSaveInProgress } = this.props;

    return (
      <div>
        <Navigation client={client} type="rfp" />
        <Grid stackable container className="section-wrap">
          <Grid.Row>
            <Grid.Column width={16}>
              <div className="start">
                <Helmet
                  title="RFP Start"
                  meta={[
                    { name: 'description', content: 'Description of RFP Start' },
                  ]}
                />
                <Grid stackable as={Segment} className="gridSegment">
                  <Grid.Row className="rfpRowDivider">
                    <Grid.Column width={16}>
                      <Header as="h3" className="rfpPageFormSetHeading">Do you want to create an RFP for this client?</Header>
                      <Form>
                        <Form.Field>
                          <Radio
                            label="Yes, walk me through filling one out."
                            value="yes"
                            checked={!client.submittedRfpSeparately}
                            onChange={(e, inputState) => { updateClient('submittedRfpSeparately', inputState.value === 'no'); }}
                          />
                        </Form.Field>
                        <Form.Field>
                          <Radio
                            label="No, I have already submitted or plan on submitting the RFP separately."
                            value="no"
                            checked={client.submittedRfpSeparately}
                            onChange={(e, inputState) => { updateClient('submittedRfpSeparately', inputState.value === 'no'); }}
                          />
                        </Form.Field>
                      </Form>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={16} textAlign="right" className="bottom-line">
                      <div className="pageFooterActions">
                        <Loader inline active={clientSaveInProgress} />
                        <Button disabled={clientSaveInProgress} primary onClick={saveClient} size="big">Save & Continue</Button>
                        <Button as={Link} to={`/clients/${client.id}`} floated="left" size="big" basic>Back</Button>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default StartPage;
