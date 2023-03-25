import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Link } from 'react-router';
import { Card, Grid, Icon, Loader, Image, Button } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import UploadLeft from '../../../assets/img/svg/upload-left.svg';
import UploadRight from '../../../assets/img/svg/upload-right.svg';
import ModalWindow from './components/ModalWindow';
import ErrorsModal from './components/ErrorsModal';

class Quote extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    getDownloadedQuotes: PropTypes.func.isRequired,
    validateQuote: PropTypes.func.isRequired,
    removeQuote: PropTypes.func.isRequired,
    uploadQuote: PropTypes.object,
    setQuoteType: PropTypes.func.isRequired,
    selectQuoteType: PropTypes.func.isRequired,
    closeQuoteTypesModal: PropTypes.func,
    closeUploadQuotesErrorsModal: PropTypes.func,
    client: PropTypes.object,
  };

  state = {}
  componentWillMount() {
    this.props.getDownloadedQuotes();
  }
  render() {
    const {
      validateQuote,
      removeQuote,
      uploadQuote,
      client,
      setQuoteType,
      selectQuoteType,
      closeQuoteTypesModal,
      closeUploadQuotesErrorsModal,
    } = this.props;
    const isLoadingQuote = uploadQuote.get('isLoadingQuote');
    const receivedQuotes = uploadQuote.get('files');
    const filteredQuotes = receivedQuotes.filter((quote) => quote.get('date') !== 'N/A');
    const errors = uploadQuote.get('errors');
    const errorsModal = uploadQuote.get('errorsModal');
    const standart = uploadQuote.get('standart');
    const kaiser = uploadQuote.get('kaiser');
    const { fileToUpload } = this.state;
    const type = standart || kaiser || Map({});
    const needsMedicalQuoteType = type.getIn(['validation', 'needsMedicalQuoteType']) || false;
    const needsDPPOOption = type.getIn(['validation', 'needsDPPOOption']) || false;
    return (
      <Card className="upload-quote" fluid>
        <Card.Content className="upload-quote__content">
          <h1 className="upload-quote__title">Upload Quote</h1>
          <h2 className="upload-quote__text">Upload your latest quotes from Rating Team.</h2>
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={16} computer={8}>
                <div className="line line--first"></div>
                <Dropzone
                  // accept=".xls, .xlsx"
                  className="upload-quote__zone upload-zone"
                  name="uploadQuoteByProduct"
                  files={[]} maxSize={5242880}
                  multiple={false}
                  onDrop={(file) => {
                    this.setState({ fileToUpload: file, name: 'productZone' });
                    validateQuote(file, 'standart');
                  }}
                >
                  <p className="upload-zone__title">Medical, Dental, Vision</p>
                  { isLoadingQuote && this.state.name === 'productZone' ?
                    <Loader inline active={isLoadingQuote} className="upload-quote__spinner" indeterminate size="big">Validation</Loader> :
                    <Image src={UploadLeft} />
                   }
                  <p className="upload-zone__caption">Drag &amp; Drop or...</p>
                  <div className="upload-zone__button">Upload File</div>
                  <p className="upload-zone__types">Supported File Types:  .xls, .xlsx</p>
                  {/* <p>{standartValidationErrors}</p> */}
                </Dropzone>


              </Grid.Column>
              <Grid.Column mobile={16} computer={8}>
                <div className="line line--secondary"></div>
                <Dropzone
                  className="upload-quote__zone upload-zone"
                  // accept=".doc, .docx, .xls, .xlsx"
                  name="uploadQuoteByType"
                  files={[]}
                  multiple={false}
                  maxSize={5242880}
                  onDrop={(file) => {
                    this.setState({ fileToUpload: file, name: 'typeZone' });
                    validateQuote(file, 'standart');
                  }}
                >
                  <p className="upload-zone__title">Life/AD&amp;D, STD, LTD</p>
                  { isLoadingQuote && this.state.name === 'typeZone' ?
                    <Loader inline active={isLoadingQuote} className="upload-quote__spinner" indeterminate size="big">Validation</Loader> :
                    <Image src={UploadRight} />
                   }

                  <p className="upload-zone__caption">Drag &amp; Drop or...</p>
                  <div className="upload-zone__button upload-zone__button--light">Upload File</div>
                  <p className="upload-zone__types">Supported File Types:  .doc, .docx, .xls, .xlsx</p>
                </Dropzone>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <h3 className="upload-quote__subtitle">Uploaded quote by product:</h3>
                <table className="ui celled full-celled structured table upload-table">
                  <thead>
                    <tr>
                      <th className="upload-table__product" rowSpan="3">PRODUCT</th>
                      <th className="upload-table__updated" rowSpan="3">LAST UPDATED</th>
                      <th className="upload-table__name" rowSpan="3">FILE NAME</th>
                      <th rowSpan="3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array(10).fill(1).map((el, i) => {
                      const quote = filteredQuotes.get(i);
                      return (<tr key={i}>
                        <td>{(quote && quote.get('date') && quote.get('name')) || ''}</td>
                        <td>{(quote && quote.get('date')) || ''}</td>
                        <td>{quote && quote.get('date') && <Icon className="file alternate outline" />}{(quote && quote.get('fileName')) || ''}</td>
                        <td>{quote && quote.get('date') ? <button className="circular ui icon button" onClick={() => { removeQuote({ type: quote.get('type'), name: quote.get('name') }); }}>
                         X
                        </button> : ''}</td>
                      </tr>);
                    }
                  )}
                  </tbody>
                </table>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Button className="upload-quote__continue" as={Link} to={`/prequote/clients/${client.id}/match/medical`} primary floated={'right'} size="big">Continue</Button>
          <ModalWindow
            changeRadio={setQuoteType}
            cancel={() => { closeQuoteTypesModal({ quoteType: 'standart', validateQuote: {} }); }}
            continue={() => { selectQuoteType(fileToUpload, 'standart'); }}
            open={needsMedicalQuoteType}
            labelOne="Standalone Medical"
            labelTwo="Alongside Kaiser"
            valueOne="medical"
            valueTwo="kaiser"
            name="modalStandart"
          />

          <ModalWindow
            changeRadio={setQuoteType}
            cancel={() => { closeQuoteTypesModal({ quoteType: 'standart', validateQuote: {} }); }}
            continue={() => { selectQuoteType(fileToUpload, 'standart'); }}
            open={needsDPPOOption}
            labelOne="Add a second DPPO quote"
            labelTwo="Replace DPPO quote"
            valueOne="addDPPO"
            valueTwo="replaceDPPO"
            name="modalDental"
          />
          <ErrorsModal errors={errors} open={errorsModal} close={closeUploadQuotesErrorsModal} />
        </Card.Content>
      </Card>
    );
  }
}

export default Quote;
