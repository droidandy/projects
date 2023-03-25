import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Button } from 'semantic-ui-react';
import { Link } from 'react-router';
import { Document, Page } from 'react-pdf';

class EmployerApplication extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    url: PropTypes.string,
    token: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      total: 1,
    };
  }

  onDocumentLoad = ({ numPages }) => {
    this.setState({ total: numPages });
  };

  changePage(by) {
    this.setState((prevState) => ({
      pageNumber: prevState.pageNumber + by,
    }));
  }

  download(filename, text) {
    const blob = new Blob([text], {
      type: 'application/pdf',
    });
    const link = document.createElement('a');

    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      link.setAttribute('href', window.URL.createObjectURL(blob));
      link.setAttribute('download', filename);
      if (document.createEvent) {
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        link.dispatchEvent(event);
      } else {
        link.click();
      }
    }
  }

  downloadPdf() {
    const { url, token } = this.props;
    fetch(url, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((response) => response.arrayBuffer())
      .then((responseText) => {
        this.download('employer-application.pdf', responseText);
      })
      .catch(() => {
      });
  }

  render() {
    const { pageNumber, total } = this.state;
    const { url, token } = this.props;
    return (
      <Grid stackable container className="medicalRfpMainContainer section-wrap preview-RFP">
        <Grid.Row>
          <Grid.Column width={16}>
            <Grid.Row>
              <Grid stackable as={Segment} className="gridSegment">
                <Grid.Row centered>
                  <Grid.Column width="16" textAlign="right" className="pdf-downloads-controls">
                    <Button
                      content="Download PDF"
                      className="pdf-button download-button"
                      disabled={pageNumber >= total}
                      onClick={() => this.downloadPdf()}
                    />
                  </Grid.Column>
                  <Grid.Column width={9} textAlign="center" >
                    <Header as="h1" className="rfpPageHeading">Preview Employer Application</Header>
                    <Header as="h2" className="rfpPageSubHeading">Page {pageNumber || '--'} of {total || '--'}</Header>
                    <div id="pdf-controls" className="pdf-pagination-controls">
                      <Button
                        content="Previous"
                        icon="left arrow"
                        className="pdf-button"
                        labelPosition="left"
                        disabled={pageNumber <= 1}
                        onClick={() => this.changePage(-1)}
                      />

                      <Button
                        content="Next"
                        icon="right arrow"
                        className="pdf-button"
                        labelPosition="right"
                        disabled={pageNumber >= total}
                        onClick={() => this.changePage(1)}
                      />
                    </div>
                    <div className="pdf-canvas">
                      <Document
                        onLoadSuccess={this.onDocumentLoad}
                        file={{
                          url,
                          httpHeaders: { authorization: `Bearer ${token}` },
                        }}
                      >
                        <Page onLoadSuccess={this.onPageLoad} pageNumber={pageNumber} />
                      </Document>
                    </div>

                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className="previewFooterActions">
                  <Grid.Column width={16} textAlign="center" >
                    <div className="divider"></div>
                  </Grid.Column>
                  <Grid.Column width={10} textAlign="center" />
                  <Grid.Column width={6} textAlign="center" >
                    <Button primary floated={'right'} as={Link} to="/onboarding/send" fluid size="big">Back to Preview and submit forms</Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default EmployerApplication;
