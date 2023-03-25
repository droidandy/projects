import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Button, Image, Loader } from 'semantic-ui-react';
import { Document, Page } from 'react-pdf';
import { Link } from 'react-router';
import { DownloadIcon, CompleteIcon } from '@benrevo/benrevo-react-core';

class PreviewRfp extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    client: PropTypes.object,
    url: PropTypes.string,
    urlWord: PropTypes.string,
    token: PropTypes.string,
    scale: PropTypes.number,
    prefixBackButton: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      total: 1,
      downloadingPdf: false,
      downloadingWord: false,
      showComplete: false,
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

  download(filename, text, type) {
    const blob = new Blob([text], {
      type,
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
    this.setState({ downloadingPdf: true });
    fetch(url, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((response) => response.arrayBuffer())
      .then((responseText) => {
        this.download('rfp.pdf', responseText, 'application/pdf');
        // https://app.asana.com/0/792456121231212/792402115669232/f
        this.setState({ downloadingPdf: false, showComplete: true });
        setTimeout(() => {
          this.setState({ showComplete: false });
        }, 3000);
      })
      .catch(() => {
      });
  }

  downloadWord() {
    const { urlWord, token } = this.props;
    this.setState({ downloadingWord: true });
    fetch(urlWord, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((response) => response.arrayBuffer())
      .then((responseText) => {
        this.download('rfp.docx', responseText, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword');
        // https://app.asana.com/0/792456121231212/792402115669232/f
        this.setState({ downloadingWord: false, showComplete: true });
        setTimeout(() => {
          this.setState({ showComplete: false });
        }, 3000);
      })
      .catch(() => {
      });
  }

  render() {
    const { pageNumber, total, showComplete, downloadingPdf, downloadingWord } = this.state;
    const { url, token, prefixBackButton, scale } = this.props;

    return (
      <Grid stackable container className="medicalRfpMainContainer section-wrap preview-RFP">
        { url && <Grid.Row>
          <Grid.Column width={16}>
            <Grid.Row>
              <Grid stackable as={Segment} className="gridSegment">
                <Grid.Row centered>
                  <Grid.Column width="16" textAlign="right" className="pdf-downloads-controls">
                    { showComplete &&
                    <div className="complete">
                      <Image src={CompleteIcon} />
                      Downloading complete.
                    </div>
                    }
                    { downloadingWord &&
                    <div className="complete">
                      <Loader className="downloading" inline active={downloadingWord} indeterminate size="medium">Downloading word file</Loader>
                    </div>
                    }
                    { downloadingPdf &&
                    <div className="complete">
                      <Loader className="downloading" inline active={downloadingPdf} indeterminate size="medium">Downloading pdf file</Loader>
                    </div>
                    }
                    <Button
                      primary
                      className="pdf-button"
                      onClick={() => this.downloadPdf()}
                    >
                      <Image src={DownloadIcon} />
                      Download PDF</Button>
                    <Button
                      primary
                      className="pdf-button"
                      onClick={() => this.downloadWord()}
                    >
                      <Image src={DownloadIcon} />
                      Download Word
                    </Button>
                  </Grid.Column>
                  <Grid.Column width={16} textAlign="center" >
                    <Header as="h1" className="rfpPageHeading">Preview RFP</Header>
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
                        <Page scale={scale || 1} onLoadSuccess={this.onPageLoad} pageNumber={pageNumber} />
                      </Document>
                    </div>
                  </Grid.Column>
                </Grid.Row>
                {prefixBackButton &&
                  <Grid.Row>
                    <Grid.Column computer="3" tablet={16} mobile={16} textAlign="left">
                      <Button
                        as={Link}
                        fluid
                        to={`${prefixBackButton}/rfp/send-to-carrier`}
                        className="ui big basic left floated button preview-back-button"
                      >
                        <span>Back</span>
                      </Button>
                    </Grid.Column>
                  </Grid.Row>
                }

              </Grid>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row> }
      </Grid>
    );
  }
}

export default PreviewRfp;
