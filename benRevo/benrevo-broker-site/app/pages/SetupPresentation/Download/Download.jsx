import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Grid, Card, List, Button, Loader, Image } from 'semantic-ui-react';
import { CompleteIcon } from '@benrevo/benrevo-react-core';

class Download extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    client: PropTypes.object.isRequired,
    clientId: PropTypes.string.isRequired,
    downloadPresentation: PropTypes.func.isRequired,
    loadingPresentationFile: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.downloadPresentation = this.downloadPresentation.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.setComplete = this.setComplete.bind(this);
    this.state = {
      showComplete: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { loadingPresentationFile } = this.props;
    if (loadingPresentationFile && !nextProps.loadingPresentationFile) {
      this.setComplete();
    }
  }

  setComplete() {
    this.setState({ showComplete: true });
    setTimeout(() => {
      this.setState({ showComplete: false });
    }, 3000);
  }

  downloadPresentation(type) {
    const { downloadPresentation, clientId } = this.props;
    downloadPresentation(clientId, type);
  }
  render() {
    const { loadingPresentationFile } = this.props;
    const { showComplete } = this.state;
    return (
      <div className="download-page">
        <div className="client">
          <Helmet
            title="Client"
            meta={[
              { name: 'description', content: 'Description of Client' },
            ]}
          />
          <Grid padded>
            <Grid.Row>
              <Grid.Column width={12}>
                <Card className="download-card">
                  <Card.Header>
                    Your Presentation
                  </Card.Header>
                  <Card.Content>
                    <Grid>
                      <Grid.Row columns={2}>
                        <Grid.Column>
                          <div className="content-block">
                            <p>Here is a list of slides that will be in your presentation:</p>
                            <List>
                              <List.Item>1. Cover</List.Item>
                              <List.Item>2. Disclosures</List.Item>
                              <List.Item>3. Financial Summary (Current/Renewal)</List.Item>
                              <List.Item>4. Financial Summary (Alternatives)</List.Item>
                              <List.Item>5. Medical Summary</List.Item>
                              <List.Item>6. Medical Overview</List.Item>
                              <List.Item>7. Medical Alternatives</List.Item>
                              <List.Item>8. Medical Marketing</List.Item>
                              <List.Item>9. Contribution Analysis</List.Item>
                              <List.Item>10. Timeline and Next Steps</List.Item>
                            </List>
                            <div className="download-controls">
                              <Button primary tabIndex={1} onClick={() => this.downloadPresentation('powerPoint')} fluid>Download Powerpoint Presentation</Button>
                              {/* <a tabIndex={2} onClick={() => this.downloadPresentation('exel')}>Download Financial Tables (Excel)</a> */}
                            </div>
                            { loadingPresentationFile &&
                            <div className="download-controls">
                              <Loader className="downloading" inline active={loadingPresentationFile} indeterminate size="big">Downloading Powerpoint file. This may take few seconds</Loader>
                            </div>
                            }
                            { showComplete &&
                            <div className="complete">
                              <Image src={CompleteIcon} />
                              <p>Downloading complete.</p>
                            </div>
                            }
                          </div>
                        </Grid.Column>
                        <Grid.Column />
                      </Grid.Row>
                    </Grid>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column width={4}>
                <Card className="about-card">
                  <Card.Header>
                    About the presentation
                  </Card.Header>
                  <Card.Content>
                    <p>
                      Give your clients all the information they need to understand their current financial
                      and competitive employee benefits position. This presentation displays the most important
                      details in a simple and thorough format,
                      designed by professionals.
                    </p>
                    <p>
                      Based on the information you have entered in the prior sections, we have automatically created a
                      presentation you can download. The format is PowerPoint, so you can customize it to meet your
                      needs.
                    </p>
                    <span className="list-header">Benefits:</span>
                    <List as="ul">
                      <List.Item as="li">
                        Your plan info and rates are automatically spread
                      </List.Item>
                      <List.Item as="li">
                        The format is optimized for a quality presentation
                      </List.Item>
                      <List.Item as="li">
                        You can add additional text directly in PowerPoint
                      </List.Item>
                      <List.Item as="li">
                        Update information and re-download the presentation at any time
                      </List.Item>
                    </List>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Download;
