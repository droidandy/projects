import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Image, Button, Modal, Input, Icon, Dimmer, Loader, Header } from 'semantic-ui-react';

class CLSAModal extends React.Component {
  static propTypes = {
    getCLSAQuote: PropTypes.func.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    programId: PropTypes.number,
    clsaLoading: PropTypes.bool.isRequired,
    clsaZipError: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    resetZip: PropTypes.func.isRequired,
    getClientAttributes: PropTypes.func.isRequired,
    clientAttributes: PropTypes.array,
    loadingAttributes: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      clsa: {
        zip: '',
        age: '',
        number: '',
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.closeErrorModal = this.closeErrorModal.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
  }

  componentDidMount(){
    if (this.props && this.props.getClientAttributes) {
      this.props.getClientAttributes();
    }
  }

  componentWillReceiveProps(nextProps){
    const { clsa } = this.state;

    let zipValue = '';
    let ageValue = '';
    let numberValue = '';
    if (!nextProps.loadingAttributes && this.props.loadingAttributes) {
      nextProps.clientAttributes.forEach((obj) => {
        if (obj.attributeName === 'CLSA_AVG_AGE') {
          ageValue = obj.value;
        }
        if (obj.attributeName === 'CLSA_ZIP_CODE') {
          zipValue = obj.value;
        }
        if (obj.attributeName === 'CLSA_NUM_ELIGIBLE') {
          numberValue = obj.value;
        }
      });

      if (clsa.zip !== zipValue || clsa.age !== ageValue || clsa.number !== numberValue){
        clsa.zip = zipValue;
        clsa.age = ageValue;
        clsa.number = numberValue;
        this.setState({ clsa });
      }
    }
  }

  closeErrorModal(closeAll) {
    if (closeAll) {
      this.props.closeModal();
    } else {
      this.props.resetZip();
    }
  }

  handleInputChange(key, value) {
    const { clsa } = this.state;
    const numberOnly = /^[0-9]*$/;
    if (value.match(numberOnly) || value === '') {
      clsa[key] = value;
      this.setState({ clsa });
    }
  }

  render() {
    const {
      getCLSAQuote,
      programId,
      clsaLoading,
      clsaZipError,
      section,
    } = this.props;
    const { clsa } = this.state;
    let disabled = true;
    if (clsa.zip && clsa.age && clsa.number && !clsaLoading) {
      disabled = false;
    }
    return (
      <Modal
        className="clsa" // eslint-disable-line react/style-prop-objec
        open={this.props.modalOpen}
        onClose={this.props.closeModal}
        closeOnDimmerClick={false}
        closeIcon={<span className="close">X</span>}
      >
        <Grid stackable className="clsa-inner">
          <Grid.Row>
            <Grid.Column width="7" className="clsa-left" textAlign="center">
              <Image src="https://s3-us-west-2.amazonaws.com/benrevo-prod-global-static/trust/clsa/clsa_2x.png" centered />
              <div className="title1">Answer three questions to receive a CLSA Trust quote instantly.</div>
            </Grid.Column>
            <Grid.Column width="9" className="clsa-right">
              <div>
                Enter group Zip Code
              </div>
              <Input value={clsa.zip} onChange={(e, inputState) => this.handleInputChange('zip', inputState.value)} />
              <div>
                Enter number of eligible employees
              </div>
              <Input value={clsa.number} onChange={(e, inputState) => this.handleInputChange('number', inputState.value)} />
              <div>
                Enter average age of employees
              </div>
              <Input value={clsa.age} onChange={(e, inputState) => this.handleInputChange('age', inputState.value)} />
              <div>
                <Button disabled={disabled} onClick={() => getCLSAQuote(clsa.zip, clsa.number, clsa.age, programId, section)} primary size="big" fluid>
                  Get Instant Quote
                  <Icon name="angle right" />
                </Button>
                <Dimmer inverted active={clsaLoading}>
                  <Loader active={clsaLoading} size="large" />
                </Dimmer>
              </div>
              <div className="title3">CLSA Trust rates are illustrative and information submitted is subject to confirmation by carriers and Hub International.</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Modal
          className="submit-modal" // eslint-disable-line react/style-prop-objec
          size="tiny"
          open={clsaZipError.length > 0}
          onClose={() => this.closeErrorModal()}
          closeOnDimmerClick={false}
          closeIcon={<span className="close">X</span>}
        >
          <Grid>
            <Grid.Row centered>
              <Grid.Column width={16} textAlign="center" className="page-heading-top">
                { clsaZipError.length > 0 && clsaZipError.indexOf('administrator') !== -1 &&
                  <Header as="h1" className="page-heading small center">The zip code you entered <b>needs approval</b> for CLSA trust</Header>
                }
                { clsaZipError.length > 0 && clsaZipError.indexOf('Region') !== -1 &&
                  <Header as="h1" className="page-heading small center">The zip code you entered is <b>not eligible</b> for CLSA trust</Header>
                }
                { clsaZipError.length > 0 && clsaZipError.indexOf('effective year') !== -1 &&
                  <Header as="h1" className="page-heading small center">The client effective date is <b>not eligible</b> to receive a CLSA Trust quote at this time.</Header>
                }
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className="rfpRowDivider">
              <Grid.Column width={16} textAlign="center">
                <p>
                  If you think you entered the wrong
                  { clsaZipError.length > 0 && (clsaZipError.indexOf('administrator') !== -1 || clsaZipError.indexOf('Region') !== -1) && ' zip code '}
                  { clsaZipError.length > 0 && clsaZipError.indexOf('effective year') !== -1 && ' effective date '}
                  in error, please re-enter.<br /> Otherwise, select CLOSE
                  { clsaZipError.length > 0 && clsaZipError.indexOf('administrator') === -1 ?
                    ' to return to the options page.' : ' and contact the trust administrator (ashley.ball@hubinternational.com).'
                  }
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <div className="buttons">
                { clsaZipError.length > 0 && (clsaZipError.indexOf('administrator') !== -1 || clsaZipError.indexOf('Region') !== -1) &&
                  <Button className="button-prev" size="medium" primary onClick={() => { this.closeErrorModal(); }}>Re-enter Zip</Button>
                }
                <Button className="button-next" size="medium" primary onClick={() => { this.closeErrorModal(true); }}>Close</Button>
              </div>
            </Grid.Row>
          </Grid>
        </Modal>
      </Modal>
    );
  }
}

export default CLSAModal;
