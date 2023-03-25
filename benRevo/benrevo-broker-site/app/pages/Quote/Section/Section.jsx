import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Loader, Card } from 'semantic-ui-react';
import { OPTION_TYPE_RENEWAL, OPTION_TYPE_OPTION, MEDICAL_SECTION, DENTAL_SECTION, VISION_SECTION } from '../constants';
import CardItem from './components/CardItem';
import AddCarrierModal from './components/AddCarrierModal';
import EditCurrent from '../EditCurrent';
import EditCurrentAncillary from '../EditCurrentAncillary';
import EditRenewal from '../EditRenewal';
import EditRenewalAncillary from '../EditRenewalAncillary';
import CLSAModal from '../../../components/AddCarrier/components/CLSAModal';

class SectionPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    // addOption: PropTypes.func.isRequired,
    children: PropTypes.node,
    loading: PropTypes.bool.isRequired,
    loadingOptions: PropTypes.bool.isRequired,
    section: PropTypes.string.isRequired,
    current: PropTypes.object.isRequired,
    options: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,
    load: PropTypes.bool.isRequired,
    client: PropTypes.object.isRequired,
    rfpCarriers: PropTypes.object.isRequired,
    getOptions: PropTypes.func.isRequired,
    initOptions: PropTypes.func.isRequired,
    optionsDelete: PropTypes.func.isRequired,
    changeCurrentPage: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    getPlansTemplates: PropTypes.func.isRequired,
    getAnotherOptions: PropTypes.func.isRequired,
    violationNotification: PropTypes.object.isRequired,
    routes: PropTypes.array.isRequired,
    getCLSAQuote: PropTypes.func.isRequired,
    getClientAttributes: PropTypes.func.isRequired,
    clientAttributes: PropTypes.array.isRequired,
    clsaData: PropTypes.object.isRequired,
    clsaLoading: PropTypes.bool.isRequired,
    clsaZipError: PropTypes.string.isRequired,
    resetZip: PropTypes.func.isRequired,
    clsaModalOpen: PropTypes.func.isRequired,
    clsaModalClose: PropTypes.func.isRequired,
    isCLSAModalOpen: PropTypes.bool.isRequired,
    getNextCLSA: PropTypes.func.isRequired,
    changeLoad: PropTypes.func.isRequired,
    uhcChecked: PropTypes.bool.isRequired,
    uhcQuoted: PropTypes.bool.isRequired,
    loadingAttributes: PropTypes.bool.isRequired,
    checkUHC: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      openModalAddCarrier: false,
      editCurrent: false,
      editRenewal: false,
      params: {},
      loaded: false,
    };

    this.toggleEditOptionModal = this.toggleEditOptionModal.bind(this);
    this.toggleModalAddOption = this.toggleModalAddOption.bind(this);
    this.addCarrier = this.addCarrier.bind(this);
    this.toggleCLSAModal = this.toggleCLSAModal.bind(this);
    this.getNextCLSA = this.getNextCLSA.bind(this);
  }

  componentWillMount() {
    const { section } = this.props;
    // API is GET "/v1/benefitNames/" with request params => planType(HMO, PPO, HSA, DPPO, DHMO, VISION, RX_PPO, RX_HMO, etc)
    if (this.props.load) {
      if (section === 'medical' || section === 'dental' || section === 'vision') {
        this.props.getOptions(section);
      } else if (section !== 'medical' && section !== 'dental' && section !== 'vision') {
        this.props.getAnotherOptions(section); // get options for life || vol_life || STD || Vol_STD || LTD || vol_LTD
      }
      this.props.getPlansTemplates(section);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      loading,
      options,
      initOptions,
      section,
      load,
      loadingOptions,
      children,
    } = nextProps;
    if (loadingOptions !== this.props.loadingOptions && this.props.loadingOptions && load) {
      let hasRenewal = false;
      for (let i = 0; i < options.length; i += 1) {
        const option = options[i];

        if (option.optionType === OPTION_TYPE_RENEWAL) {
          hasRenewal = true;
          break;
        }
      }
      if (!hasRenewal) {
        initOptions(section);
      }
    }
    // reload option page after "back to option" button pushed
    if (!children && !nextProps.routes[5] && !this.state.loaded && !loadingOptions && !loading) {
      /* if (section === 'medical' || section === 'dental' || section === 'vision') this.props.getOptions(section);
      else this.props.getAnotherOptions(section); */
      this.setState({ loaded: true });
    }

    if ((section !== 'medical' && section !== 'dental' && section !== 'vision') && (load !== this.props.load && load && !loadingOptions)) {
      this.props.getAnotherOptions(section);
    }
    if ((load !== this.props.load && load && !loadingOptions) && (section === 'medical' || section === 'dental' || section === 'vision')) {
      this.props.getOptions(section);
    }
  }

  getNextCLSA(programId, section) {
    this.props.getNextCLSA(programId, section);
    this.toggleModalAddOption();
  }

  toggleEditOptionModal(type, params) {
    const {
      section,
      changeLoad,
    } = this.props;
    const close = !this.state[type];
    this.setState({ [type]: close, params });

    if ((type === 'editCurrent' || type === 'editRenewal') && !close) {
      changeLoad(section, { options: true });
    }
  }

  toggleModalAddOption() {
    this.setState({ openModalAddCarrier: !this.state.openModalAddCarrier });
  }

  toggleCLSAModal() {
    if (!this.props.isCLSAModalOpen) {
      this.props.resetZip();
      this.props.clsaModalOpen();
      this.setState({ openModalAddCarrier: false });
    } else {
      this.props.clsaModalClose();
    }
  }

  addCarrier(carrier, section, rfpCarrier, kaiser) {
    const { current } = this.props;

    let optionType = OPTION_TYPE_OPTION;

    if (current.carriers) {
      for (let i = 0; i < current.carriers.length; i += 1) {
        const item = current.carriers[i];

        if (item === carrier.name) optionType = OPTION_TYPE_RENEWAL;
      }
    }

    const option = {
      carrier: rfpCarrier,
      id: 'new',
      optionType,
      kaiser,
    };
    this.props.changeCurrentPage(section, option);
    this.toggleModalAddOption();
    this.props.changePage(this.props.client.id, section);
  }

  render() {
    const {
      children,
      loading,
      section,
      current,
      options,
      optionsDelete,
      changeCurrentPage,
      client,
      rfpCarriers,
      violationNotification,
      getCLSAQuote,
      clsaData,
      clsaLoading,
      clsaZipError,
      resetZip,
      uhcChecked,
      checkUHC,
      uhcQuoted,
      getClientAttributes,
      clientAttributes,
      loadingAttributes,
    } = this.props;
    const selectedCarriers = {
      medical: {},
      dental: {},
      vision: {},
      life: {},
      ltd: {},
      std: {},
      vol_life: {},
      vol_std: {},
      vol_ltd: {},
    };

    let hideCLSA = false;
    let skipCLSAData = false;
    const currentCLSA = clsaData && clsaData[section.toUpperCase()] ? clsaData[section.toUpperCase()] : {};

    if (!currentCLSA && !currentCLSA.programId) {
      hideCLSA = true;
    }

    for (let i = 0; i < options.length; i += 1) {
      if (options[i].quoteType === 'CLSA_TRUST_PROGRAM') {
        skipCLSAData = true;
      }
    }
    const { quoteType } = current;
    const mainProducts = section === MEDICAL_SECTION || section === DENTAL_SECTION || section === VISION_SECTION;
    return (
      <div>
        { !children &&
          <div className="presentation-options" key={section}>
            <div>
              <Header className="presentation-options-header" as="h2">{section} Options</Header>
            </div>
            { !loading &&
              <Card.Group stackable itemsPerRow="3" doubling>
                {current.id &&
                  <CardItem
                    section={section}
                    data={current}
                    client={client}
                    changeCurrentPage={changeCurrentPage}
                    editAction={this.toggleEditOptionModal}
                    isCurrent
                  />
                }
                { (options && options.length > 0) && options.map((item, i) =>
                  <CardItem
                    key={i}
                    section={section}
                    data={item}
                    carriers={rfpCarriers[section]}
                    client={client}
                    optionsDelete={optionsDelete}
                    changeCurrentPage={changeCurrentPage}
                    editAction={this.toggleEditOptionModal}
                    violationNotification={violationNotification}
                  />
                )}
                <Card
                  as="div"
                  className="card-add"
                  onClick={() => { this.toggleModalAddOption(); }}
                >
                  <div className="topbottom" />
                  <div className="leftright" />
                  <div className="card-add-inner">
                    <div className="plus">+</div>
                    <div className="title">Add new option</div>
                  </div>
                </Card>
              </Card.Group>
            }
            { loading &&
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16} textAlign="center">
                    <Loader inline active={loading} indeterminate size="big">Loading options</Loader>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            }
            <AddCarrierModal
              kaiser={quoteType !== 'STANDARD'}
              section={section}
              selectCarrier={this.addCarrier}
              selectedCarriers={selectedCarriers}
              carriers={rfpCarriers}
              openModal={this.state.openModalAddCarrier}
              closeModal={this.toggleModalAddOption}
              openCLSAModal={skipCLSAData ? (() => this.getNextCLSA(currentCLSA && currentCLSA.programId, section)) : this.toggleCLSAModal}
              clsaData={currentCLSA}
              hideCLSA={hideCLSA}
              uhcChecked={uhcChecked}
              checkUHC={checkUHC}
              uhcQuoted={uhcQuoted}
            />
            { this.state.editCurrent && mainProducts && <EditCurrent section={section} openModal={this.state.editCurrent} closeModal={this.toggleEditOptionModal} /> }
            { this.state.editCurrent && !mainProducts && <EditCurrentAncillary section={section} openModal={this.state.editCurrent} closeModal={this.toggleEditOptionModal} /> }
            { this.state.editRenewal && mainProducts && <EditRenewal optionId={this.state.params.id} section={section} openModal={this.state.editRenewal} closeModal={this.toggleEditOptionModal} /> }
            { this.state.editRenewal && !mainProducts && <EditRenewalAncillary optionId={this.state.params.id} section={section} openModal={this.state.editRenewal} closeModal={this.toggleEditOptionModal} /> }
          </div>
        }
        { children && <div>{children}</div> }
        <CLSAModal
          updateCLA={this.updateCLA}
          getCLSAQuote={getCLSAQuote}
          closeModal={this.toggleCLSAModal}
          modalOpen={this.props.isCLSAModalOpen}
          programId={currentCLSA && currentCLSA.programId}
          clsaLoading={clsaLoading}
          clsaZipError={clsaZipError}
          section={section}
          resetZip={resetZip}
          getClientAttributes={getClientAttributes}
          clientAttributes={clientAttributes}
          loadingAttributes={loadingAttributes}
        />
      </div>
    );
  }
}

export default SectionPage;
