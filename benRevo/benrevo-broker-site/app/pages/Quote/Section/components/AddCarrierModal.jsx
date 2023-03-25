import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Grid, Message, Image, Loader } from 'semantic-ui-react';
import AddCarrierContent from '../../../../components/AddCarrier';
import * as types from '../../constants';

class AddCarrierBlock extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    openModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    carriers: PropTypes.object.isRequired,
    selectedCarriers: PropTypes.object.isRequired,
    selectCarrier: PropTypes.func.isRequired,
    clsaData: PropTypes.object.isRequired,
    openCLSAModal: PropTypes.func.isRequired,
    hideCLSA: PropTypes.bool.isRequired,
    kaiser: PropTypes.bool.isRequired,
    uhcChecked: PropTypes.bool.isRequired,
    uhcQuoted: PropTypes.bool.isRequired,
    checkUHC: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      modalQuote: false,
      selectedQuote: 'STANDARD',
      uhcNotice: false,
      uhcImg: '',
    };
    this.handleClose = this.handleClose.bind(this);
    this.selectQuote = this.selectQuote.bind(this);
    this.addCarrier = this.addCarrier.bind(this);
    this.handleCloseNotice = this.handleCloseNotice.bind(this);
  }

  componentWillMount() {
    const {
      section,
      checkUHC,
      carriers,
    } = this.props;
    let uhcId = '';
    for (let i = 0; i < carriers[section].length; i += 1) {
      if (carriers[section][i].carrier.name === types.UHC) {
        this.setState({ uhcImg: carriers[section][i].carrier.originalImageUrl });
        uhcId = carriers[section][i].rfpCarrierId;
      }
    }
    checkUHC(section, uhcId);
  }

  componentWillReceiveProps(nextProps) {
    const {
      openModal,
      kaiser,
      section,
    } = nextProps;

    if (openModal && !this.props.openModal) {
      if (kaiser && section === types.MEDICAL_SECTION) {
        this.setState({ modalQuote: true });
      }
    }
  }

  handleCloseNotice() {
    this.setState({ uhcNotice: false });
  }

  addCarrier(carrier, section, rfpCarrier) {
    const {
      selectCarrier,
      uhcChecked,
      uhcQuoted,
    } = this.props;
    if (carrier.name === types.UHC && uhcChecked && !uhcQuoted) {
      this.setState({ uhcNotice: true });
      return;
    }
    selectCarrier(carrier, section, rfpCarrier, this.state.selectedQuote === 'KAISER');
  }

  handleClose = (modalType) => {
    const { kaiser } = this.props;
    if (modalType === 'closeQuote') {
      this.setState({ modalQuote: false });
    } else if (modalType === 'closeOptions') {
      if (kaiser) {
        this.setState({ modalQuote: true });
      } else {
        this.setState({ modalQuote: false });
      }
    }
  };

  selectQuote = (e) => {
    this.setState({ selectedQuote: e });
  };

  render() {
    const {
      section,
      openModal,
      closeModal,
      selectedCarriers,
      carriers,
      clsaData,
      openCLSAModal,
      hideCLSA,
      uhcChecked,
    } = this.props;
    const { modalQuote } = this.state;
    // console.log('add option props', this.props);
    return (
      <div>
        <Modal
          size="small"
          open={openModal && modalQuote}
          className="choose-quote-modal"
          onClose={() => {
            closeModal();
          }}
          closeIcon={<span className="close">X</span>}
        >
          <Modal.Content>
            <p className="choose-quote-modal__header">How would you like to create your option?</p>
            <div className="choose-quote-modal__btn-holder">
              <Button
                size="medium"
                primary
                onClick={() => {
                  this.selectQuote('STANDARD');
                  this.handleClose('closeQuote');
                }}
                className="choose-quote-modal__btn"
              >
               Full takeover
              </Button>
              <Button
                size="medium"
                primary
                onClick={() => {
                  this.selectQuote('KAISER');
                  this.handleClose('closeQuote');
                }}
                className="choose-quote-modal__btn"
              >
                Alongside Kaiser
              </Button>
            </div>
          </Modal.Content>
        </Modal>

        <Modal
          open={openModal && !modalQuote}
          className="add-carrier-modal"
          onClose={() => {
            closeModal();
            this.handleClose('closeOptions');
          }}
          closeIcon={<span className="close">X</span>}
          closeOnDimmerClick={false}
        >
          { uhcChecked &&
            <Modal.Content scrolling>
              { this.state.uhcNotice &&
                <Grid>
                  <Grid.Row className="notice-row">
                    <Grid.Column className="notice-column">
                      <Message>
                        <Image className="uhc-notice-img" src={this.state.uhcImg} />
                        <p>
                          We would like to load your entire UnitedHealthcare quote automatically, but we need to receive it from UnitedHealthcare first!
                          Please reach out to your UnitedHealthcare sales representative and ask them to send your quote directly to BenRevo (they&apos;ll know what that means).
                        </p>
                        <p>
                          Don&apos;t worry, you&apos;ll receive an email notification when your quote is ready!
                        </p>
                        <Button className="back-button" primary onClick={this.handleCloseNotice}>Back</Button>
                      </Message>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              }
              { !this.state.uhcNotice &&
                <div className="add-carrier-transition">
                  <AddCarrierContent
                    selectCarrier={this.addCarrier}
                    selectedCarriers={selectedCarriers}
                    carriers={carriers}
                    showAll
                    hideMedical={section !== types.MEDICAL_SECTION}
                    hideDental={section !== types.DENTAL_SECTION}
                    hideVision={section !== types.VISION_SECTION}
                    hideLife={section !== types.LIFE_SECTION}
                    hideVolLife={section !== types.VOL_LIFE_SECTION}
                    hideStd={section !== types.STD_SECTION}
                    hideVolStd={section !== types.VOL_STD_SECTION}
                    hideLtd={section !== types.LTD_SECTION}
                    hideVolLtd={section !== types.VOL_LTD_SECTION}
                    titleMedical="Select Medical Carrier"
                    titleDental="Select Dental Carrier"
                    titleVision="Select Vision Carrier"
                    titleLife="Select Life Carrier"
                    titleVolLife="Select Voluntary Life Carrier"
                    titleStd="Select STD Carrier"
                    titleVolStd="Select Voluntary STD Carrier"
                    titleLtd="Select LTD Carrier"
                    titleVolLtd="Select Voluntary LTD Carrier"
                    clsaData={clsaData}
                    openCLSAModal={openCLSAModal}
                    hideCLSA={hideCLSA}
                  />
                </div>
              }
            </Modal.Content>
          }
          { !uhcChecked &&
            <Loader active />
          }
        </Modal>
      </div>
    );
  }
}

export default AddCarrierBlock;
