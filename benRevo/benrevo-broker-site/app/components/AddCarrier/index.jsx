import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Card, Image } from 'semantic-ui-react';
import {
  MEDICAL_SECTION,
  DENTAL_SECTION,
  VISION_SECTION,
  LIFE_SECTION,
  VOL_LIFE_SECTION,
  STD_SECTION,
  VOL_STD_SECTION,
  LTD_SECTION,
  VOL_LTD_SECTION,
} from '@benrevo/benrevo-react-clients';

class AddCarrierContent extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    selectCarrier: PropTypes.func.isRequired,
    selectedCarriers: PropTypes.object.isRequired,
    carriers: PropTypes.object.isRequired,
    showAll: PropTypes.bool,
    hideMedical: PropTypes.bool,
    hideDental: PropTypes.bool,
    hideVision: PropTypes.bool,
    hideLife: PropTypes.bool,
    hideLtd: PropTypes.bool,
    hideStd: PropTypes.bool,
    hideVolLife: PropTypes.bool,
    hideVolLtd: PropTypes.bool,
    hideVolStd: PropTypes.bool,
    titleMedical: PropTypes.string,
    titleDental: PropTypes.string,
    titleVision: PropTypes.string,
    // programs: PropTypes.object.isRequired,
    carrierEmailList: PropTypes.array.isRequired,
    titleLife: PropTypes.string,
    titleLtd: PropTypes.string,
    titleStd: PropTypes.string,
    titleVolLife: PropTypes.string,
    titleVolLtd: PropTypes.string,
    titleVolStd: PropTypes.string,
    clsaData: PropTypes.object,
    openCLSAModal: PropTypes.func,
    hideCLSA: PropTypes.bool,
  };

  static defaultProps = {
    hideMedical: false,
    hideDental: false,
    hideVision: false,
    hideLife: false,
    hideLtd: false,
    hideStd: false,
    hideVolLife: false,
    hideVolLtd: false,
    hideVolStd: false,
    showAll: false,
    titleMedical: '',
    titleDental: '',
    titleVision: '',
    titleLife: '',
    titleLtd: '',
    titleStd: '',
    titleVolLife: '',
    titleVolLtd: '',
    titleVolStd: '',
    clsaData: {},
    openCLSAModal: () => {},
    hideCLSA: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      visibleCarriers: {
        medical: [],
        dental: [],
        vision: [],
        life: [],
        ltd: [],
        std: [],
      },
      filteredCarriers: {},
      visibleMedicalLength: 10,
      visibleDentalLength: 10,
      visibleVisionLength: 10,
      visibleLifeLength: 10,
      visibleLtdLength: 10,
      visibleStdLength: 10,
      visibleVolLifeLength: 10,
      visibleVolStdLength: 10,
      visibleVolLtdLength: 10,
    };

    this.showMore = this.showMore.bind(this);
  }


  componentWillMount() {
    const { carriers, carrierEmailList } = this.props;
    const filtered = this.filterCarriers(carriers, carrierEmailList);
    this.setState({
      filteredCarriers: filtered,
    });
    this.setVisibleCarriers(filtered);
  }

  componentDidMount() {
    if (Object.keys(this.props.carriers) === 9) {
      this.setVisibleCarriers(this.props.carriers);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { carriers, carrierEmailList } = nextProps;
    const filtered = this.filterCarriers(carriers, carrierEmailList);
    this.setState({
      filteredCarriers: filtered,
    });
    this.setVisibleCarriers(filtered);

    if (Object.keys(nextProps.carriers) === 9) {
      this.setVisibleCarriers(nextProps.carriers);
    }
  }


  setVisibleCarriers(carriers) {
    const {
      visibleMedicalLength,
      visibleDentalLength,
      visibleVisionLength,
      visibleLifeLength,
      visibleLtdLength,
      visibleStdLength,
      visibleVolLifeLength,
      visibleVolStdLength,
      visibleVolLtdLength,
    } = this.state;
    const newVisibleCarriers = {
      medical: carriers.medical.slice(0, visibleMedicalLength),
      dental: carriers.dental.slice(0, visibleDentalLength),
      vision: carriers.vision.slice(0, visibleVisionLength),
      life: carriers.life.slice(0, visibleLifeLength),
      ltd: carriers.ltd.slice(0, visibleLtdLength),
      std: carriers.std.slice(0, visibleStdLength),
      vol_life: carriers.vol_life.slice(0, visibleVolLifeLength),
      vol_std: carriers.vol_std.slice(0, visibleVolStdLength),
      vol_ltd: carriers.vol_ltd.slice(0, visibleVolLtdLength),
    };
    this.setState({ visibleCarriers: newVisibleCarriers });
  }

  filterCarriers = (carriers, carrierEmailList) => {
    const filteredCarriers = {
      dental: [],
      medical: [],
      vision: [],
      life: [],
      vol_life: [],
      std: [],
      vol_std: [],
      ltd: [],
      vol_ltd: [],
    };
    carrierEmailList.map((listItem) => {
      Object.keys(carriers).map((carrier) =>
        carriers[carrier].map((item) => {
          if (item.carrier.carrierId === listItem.carrierId && listItem.approved) {
            filteredCarriers[carrier].push(item);
          }
        })
      );
    });
    return filteredCarriers;
  };

  showMore(section) {
    // const { carriers } = this.props;
    const { filteredCarriers } = this.state;
    switch (section) {
      case MEDICAL_SECTION:
        this.setState({ visibleMedicalLength: filteredCarriers[MEDICAL_SECTION].length }, () => { this.setVisibleCarriers(filteredCarriers); });
        break;
      case DENTAL_SECTION:
        this.setState({ visibleDentalLength: filteredCarriers[DENTAL_SECTION].length }, () => { this.setVisibleCarriers(filteredCarriers); });
        break;
      case VISION_SECTION:
        this.setState({ visibleVisionLength: filteredCarriers[VISION_SECTION].length }, () => { this.setVisibleCarriers(filteredCarriers); });
        break;
      case LIFE_SECTION:
        this.setState({ visibleLifeLength: filteredCarriers[LIFE_SECTION].length }, () => { this.setVisibleCarriers(filteredCarriers); });
        break;
      case STD_SECTION:
        this.setState({ visibleStdLength: filteredCarriers[STD_SECTION].length }, () => { this.setVisibleCarriers(filteredCarriers); });
        break;
      case LTD_SECTION:
        this.setState({ visibleLtdLength: filteredCarriers[LTD_SECTION].length }, () => { this.setVisibleCarriers(filteredCarriers); });
        break;
      default:
        break;
    }
  }

  showLess(section) {
    // const { carriers } = this.props;
    const { filteredCarriers } = this.state;
    switch (section) {
      case MEDICAL_SECTION:
        this.setState({ visibleMedicalLength: 10 }, () => { this.setVisibleCarriers(filteredCarriers); });
        break;
      case DENTAL_SECTION:
        this.setState({ visibleDentalLength: 10 }, () => { this.setVisibleCarriers(filteredCarriers); });
        break;
      case VISION_SECTION:
        this.setState({ visibleVisionLength: 10 }, () => { this.setVisibleCarriers(filteredCarriers); });
        break;
      case LIFE_SECTION:
        this.setState({ visibleLifeLength: 10 }, () => { this.setVisibleCarriers(filteredCarriers); });
        break;
      case STD_SECTION:
        this.setState({ visibleStdLength: 10 }, () => { this.setVisibleCarriers(filteredCarriers); });
        break;
      case LTD_SECTION:
        this.setState({ visibleLtdLength: 10 }, () => { this.setVisibleCarriers(filteredCarriers); });
        break;
      default:
        break;
    }
  }

  render() {
    const {
      showAll,
      selectCarrier,
      selectedCarriers,
      carriers,
      hideMedical,
      hideDental,
      hideVision,
      hideLife,
      hideVolLife,
      hideLtd,
      hideVolLtd,
      hideStd,
      hideVolStd,
      titleMedical,
      titleDental,
      titleVision,
      titleLife,
      titleVolLife,
      titleLtd,
      titleVolLtd,
      titleStd,
      titleVolStd,
      // programs,
      clsaData,
      openCLSAModal,
      hideCLSA,
    } = this.props;
    const { filteredCarriers } = this.state;
    let data = this.state.visibleCarriers;
    if (showAll) data = carriers;
    // console.log('add carrier modal content props', this.props);
    return (
      <Grid className="add-carrier-content">
        { !hideCLSA && clsaData && clsaData.programId &&
          <Grid.Row className="title-row">
            <Grid.Column width="16">Select a Program</Grid.Column>
          </Grid.Row>
        }
        { !hideCLSA && clsaData && clsaData.programId &&
          <Grid.Row columns={5}>
            <Grid.Column>
              <Card
                onClick={() => { openCLSAModal(); }}
                className="carrier-card"
              >
                <Image src="https://s3-us-west-2.amazonaws.com/benrevo-prod-global-static/trust/clsa/clsa_2x.png" />
              </Card>
            </Grid.Column>
          </Grid.Row>
        }
        {!hideMedical &&
        <Grid.Row className="title-row">
          <Grid.Column width="16">{ titleMedical || 'Select all Medical Carriers that apply' }</Grid.Column>
        </Grid.Row>
        }
        { !hideMedical &&
        <Grid.Row columns={5} className="medical-options">
          {data[MEDICAL_SECTION] && data[MEDICAL_SECTION].map((item, i) =>
            <Grid.Column key={i} >
              <Card
                onClick={() => { if (!selectedCarriers[MEDICAL_SECTION][item.carrier.carrierId] || (selectedCarriers[MEDICAL_SECTION][item.carrier.carrierId] && !selectedCarriers[MEDICAL_SECTION][item.carrier.carrierId].lock)) selectCarrier(item.carrier, MEDICAL_SECTION, item); }}
                className={selectedCarriers[MEDICAL_SECTION][item.carrier.carrierId] ? 'carrier-card selected' : 'carrier-card'}
              >
                <Image src={item.carrier.originalImageUrl} />
              </Card>
            </Grid.Column>
          )}
        </Grid.Row>
        }
        {!hideMedical &&
        <Grid.Row centered columns={5} className="show-more">
          { !showAll && data[MEDICAL_SECTION].length !== filteredCarriers[MEDICAL_SECTION].length &&
          <a tabIndex={1} onClick={() => this.showMore('medical')}>+ Show more</a>
          }
          { !showAll && data[MEDICAL_SECTION].length === filteredCarriers[MEDICAL_SECTION].length && filteredCarriers[MEDICAL_SECTION].length > 10 &&
          <a tabIndex={3} onClick={() => this.showLess('medical')}>- Show Less</a>
          }
        </Grid.Row>
        }
        {!hideDental &&
        <Grid.Row className="title-row">
          <Grid.Column width="16">{ titleDental || 'Select all Dental Carriers that apply' }</Grid.Column>
        </Grid.Row>
        }
        {!hideDental &&
        <Grid.Row columns={5} className="dental-options">
          {data[DENTAL_SECTION] && data[DENTAL_SECTION].map((item, i) =>
            <Grid.Column key={i} >
              <Card
                onClick={() => { if (!selectedCarriers[DENTAL_SECTION][item.carrier.carrierId] || (selectedCarriers[DENTAL_SECTION][item.carrier.carrierId] && !selectedCarriers[DENTAL_SECTION][item.carrier.carrierId].lock)) selectCarrier(item.carrier, DENTAL_SECTION, item); }}
                className={selectedCarriers[DENTAL_SECTION][item.carrier.carrierId] ? 'carrier-card selected' : 'carrier-card'}
              >
                <Image src={item.carrier.originalImageUrl} />
              </Card>
            </Grid.Column>
          )}
        </Grid.Row>
        }
        {!hideDental &&
        <Grid.Row centered columns={5} className="show-more">
          { !showAll && data[DENTAL_SECTION].length !== filteredCarriers[DENTAL_SECTION].length &&
          <a tabIndex={2} onClick={() => this.showMore('dental')}>+ Show more</a>
          }
          { !showAll && data[DENTAL_SECTION].length === filteredCarriers[DENTAL_SECTION].length && filteredCarriers[DENTAL_SECTION].length > 10 &&
          <a tabIndex={3} onClick={() => this.showLess('dental')}>- Show Less</a>
          }
        </Grid.Row>
        }
        {!hideVision &&
        <Grid.Row className="title-row">
          <Grid.Column width="16">{ titleVision || 'Select all Vision Carriers that apply' }</Grid.Column>
        </Grid.Row>
        }
        {!hideVision &&
        <Grid.Row columns={5} className="vision-options">
          {data[VISION_SECTION] && data[VISION_SECTION].map((item, i) =>
            <Grid.Column key={i} >
              <Card
                onClick={() => { if (!selectedCarriers[VISION_SECTION][item.carrier.carrierId] || (selectedCarriers[VISION_SECTION][item.carrier.carrierId] && !selectedCarriers[VISION_SECTION][item.carrier.carrierId].lock)) selectCarrier(item.carrier, VISION_SECTION, item); }}
                className={selectedCarriers[VISION_SECTION][item.carrier.carrierId] ? 'carrier-card selected' : 'carrier-card'}
              >
                <Image src={item.carrier.originalImageUrl} />
              </Card>
            </Grid.Column>
          )}
        </Grid.Row>
        }
        {!hideVision &&
        <Grid.Row centered columns={5} className="show-more">
          { !showAll && data[VISION_SECTION].length !== filteredCarriers[VISION_SECTION].length &&
          <a tabIndex={3} onClick={() => this.showMore('vision')}>+ Show more</a>
          }
          { !showAll && data[VISION_SECTION].length === filteredCarriers[VISION_SECTION].length && filteredCarriers[DENTAL_SECTION].length > 10 &&
          <a tabIndex={3} onClick={() => this.showLess('vision')}>- Show Less</a>
          }
        </Grid.Row>
        }
        {!hideLife &&
        <Grid.Row className="title-row">
          <Grid.Column width="16">{ titleLife || 'Select all Life Carriers that apply' }</Grid.Column>
        </Grid.Row>
        }
        {!hideLife &&
        <Grid.Row columns={5} className="vision-options">
          { data[LIFE_SECTION] && data[LIFE_SECTION].map((item, i) =>
            <Grid.Column key={i} >
              <Card
                onClick={() => { if (!selectedCarriers[LIFE_SECTION][item.carrier.carrierId] || (selectedCarriers[LIFE_SECTION][item.carrier.carrierId] && !selectedCarriers[LIFE_SECTION][item.carrier.carrierId].lock)) selectCarrier(item.carrier, LIFE_SECTION, item); }}
                className={selectedCarriers[LIFE_SECTION][item.carrier.carrierId] ? 'carrier-card selected' : 'carrier-card'}
              >
                <Image src={item.carrier.originalImageUrl} />
              </Card>
            </Grid.Column>
          )}
        </Grid.Row>
        }
        {!hideLife &&
        <Grid.Row centered columns={5} className="show-more">
          { !showAll && data[LIFE_SECTION].length !== filteredCarriers[LIFE_SECTION].length &&
          <a tabIndex={3} onClick={() => this.showMore('life')}>+ Show more</a>
          }
          { !showAll && data[LIFE_SECTION].length === filteredCarriers[LIFE_SECTION].length && filteredCarriers[LIFE_SECTION].length > 10 &&
          <a tabIndex={3} onClick={() => this.showLess('life')}>- Show Less</a>
          }
        </Grid.Row>
        }

        {!hideVolLife &&
        <Grid.Row className="title-row">
          <Grid.Column width="16">{ titleVolLife || 'Select all Life Carriers that apply' }</Grid.Column>
        </Grid.Row>
        }
        {!hideVolLife &&
        <Grid.Row columns={5} className="vision-options">
          { data[VOL_LIFE_SECTION] && data[VOL_LIFE_SECTION].map((item, i) =>
            <Grid.Column key={i} >
              <Card
                onClick={() => { if (!selectedCarriers[VOL_LIFE_SECTION][item.carrier.carrierId] || (selectedCarriers[VOL_LIFE_SECTION][item.carrier.carrierId] && !selectedCarriers[VOL_LIFE_SECTION][item.carrier.carrierId].lock)) selectCarrier(item.carrier, VOL_LIFE_SECTION, item); }}
                className={selectedCarriers[VOL_LIFE_SECTION][item.carrier.carrierId] ? 'carrier-card selected' : 'carrier-card'}
              >
                <Image src={item.carrier.originalImageUrl} />
              </Card>
            </Grid.Column>
          )}
        </Grid.Row>
        }
        {!hideVolLife &&
        <Grid.Row centered columns={5} className="show-more">
          { !showAll && data[VOL_LIFE_SECTION] && data[VOL_LIFE_SECTION].length !== filteredCarriers[VOL_LIFE_SECTION].length &&
          <a tabIndex={3} onClick={() => this.showMore('vol_life')}>+ Show more</a>
          }
          { !showAll && data[VOL_LIFE_SECTION] && data[VOL_LIFE_SECTION].length === filteredCarriers[VOL_LIFE_SECTION].length && filteredCarriers[VOL_LIFE_SECTION].length > 10 &&
          <a tabIndex={3} onClick={() => this.showLess('vol_life')}>- Show Less</a>
          }
        </Grid.Row>
        }

        {!hideLtd &&
        <Grid.Row className="title-row">
          <Grid.Column width="16">{ titleLtd || 'Select all LTD Carriers that apply' }</Grid.Column>
        </Grid.Row>
        }
        {!hideLtd &&
        <Grid.Row columns={5} className="vision-options">
          {data[LTD_SECTION] && data[LTD_SECTION].map((item, i) =>
            <Grid.Column key={i} >
              <Card
                onClick={() => { if (!selectedCarriers[LTD_SECTION][item.carrier.carrierId] || (selectedCarriers[LTD_SECTION][item.carrier.carrierId] && !selectedCarriers[LTD_SECTION][item.carrier.carrierId].lock)) selectCarrier(item.carrier, LTD_SECTION, item); }}
                className={selectedCarriers[LTD_SECTION][item.carrier.carrierId] ? 'carrier-card selected' : 'carrier-card'}
              >
                <Image src={item.carrier.originalImageUrl} />
              </Card>
            </Grid.Column>
          )}
        </Grid.Row>
        }
        {!hideLtd &&
        <Grid.Row centered columns={5} className="show-more">
          { !showAll && data[LTD_SECTION] && data[LTD_SECTION].length !== filteredCarriers[LTD_SECTION].length &&
          <a tabIndex={3} onClick={() => this.showMore('ltd')}>+ Show more</a>
          }
          { !showAll && data[LTD_SECTION] && data[LTD_SECTION].length === filteredCarriers[LTD_SECTION].length && filteredCarriers[LTD_SECTION].length > 10 &&
          <a tabIndex={3} onClick={() => this.showLess('ltd')}>- Show Less</a>
          }
        </Grid.Row>
        }
        {!hideVolLtd &&
        <Grid.Row className="title-row">
          <Grid.Column width="16">{ titleVolLtd || 'Select all LTD Carriers that apply' }</Grid.Column>
        </Grid.Row>
        }
        {!hideVolLtd &&
        <Grid.Row columns={5} className="vision-options">
          {data[VOL_LTD_SECTION] && data[VOL_LTD_SECTION].map((item, i) =>
            <Grid.Column key={i} >
              <Card
                onClick={() => { if (!selectedCarriers[VOL_LTD_SECTION][item.carrier.carrierId] || (selectedCarriers[VOL_LTD_SECTION][item.carrier.carrierId] && !selectedCarriers[VOL_LTD_SECTION][item.carrier.carrierId].lock)) selectCarrier(item.carrier, VOL_LTD_SECTION, item); }}
                className={selectedCarriers[VOL_LTD_SECTION][item.carrier.carrierId] ? 'carrier-card selected' : 'carrier-card'}
              >
                <Image src={item.carrier.originalImageUrl} />
              </Card>
            </Grid.Column>
          )}
        </Grid.Row>
        }
        {!hideVolLtd &&
        <Grid.Row centered columns={5} className="show-more">
          { !showAll && data[VOL_LTD_SECTION] && data[VOL_LTD_SECTION].length !== filteredCarriers[VOL_LTD_SECTION].length &&
          <a tabIndex={3} onClick={() => this.showMore('vol_ltd')}>+ Show more</a>
          }
          { !showAll && data[VOL_LTD_SECTION] && data[VOL_LTD_SECTION].length === filteredCarriers[VOL_LTD_SECTION].length && filteredCarriers[VOL_LTD_SECTION].length > 10 &&
          <a tabIndex={3} onClick={() => this.showLess('vol_ltd')}>- Show Less</a>
          }
        </Grid.Row>
        }
        {!hideStd &&
        <Grid.Row className="title-row">
          <Grid.Column width="16">{ titleStd || 'Select all STD Carriers that apply' }</Grid.Column>
        </Grid.Row>
        }
        {!hideStd &&
        <Grid.Row columns={5} className="vision-options">
          {data[STD_SECTION] && data[STD_SECTION].map((item, i) =>
            <Grid.Column key={i} >
              <Card
                onClick={() => { if (!selectedCarriers[STD_SECTION][item.carrier.carrierId] || (selectedCarriers[STD_SECTION][item.carrier.carrierId] && !selectedCarriers[STD_SECTION][item.carrier.carrierId].lock)) selectCarrier(item.carrier, STD_SECTION, item); }}
                className={selectedCarriers[STD_SECTION][item.carrier.carrierId] ? 'carrier-card selected' : 'carrier-card'}
              >
                <Image src={item.carrier.originalImageUrl} />
              </Card>
            </Grid.Column>
          )}
        </Grid.Row>
        }
        {!hideStd &&
        <Grid.Row centered columns={5} className="show-more">
          { !showAll && data[STD_SECTION] && data[STD_SECTION].length !== filteredCarriers[STD_SECTION].length &&
          <a tabIndex={3} onClick={() => this.showMore('std')}>+ Show more</a>
          }
          { !showAll && data[STD_SECTION] && data[STD_SECTION].length === filteredCarriers[STD_SECTION].length && filteredCarriers[STD_SECTION].length > 10 &&
          <a tabIndex={3} onClick={() => this.showLess('std')}>- Show Less</a>
          }
        </Grid.Row>
        }
        {!hideVolStd &&
        <Grid.Row className="title-row">
          <Grid.Column width="16">{ titleVolStd || 'Select all STD Carriers that apply' }</Grid.Column>
        </Grid.Row>
        }
        {!hideVolStd &&
        <Grid.Row columns={5} className="vision-options">
          {data[VOL_STD_SECTION] && data[VOL_STD_SECTION].map((item, i) =>
            <Grid.Column key={i} >
              <Card
                onClick={() => { if (!selectedCarriers[VOL_STD_SECTION][item.carrier.carrierId] || (selectedCarriers[VOL_STD_SECTION][item.carrier.carrierId] && !selectedCarriers[VOL_STD_SECTION][item.carrier.carrierId].lock)) selectCarrier(item.carrier, VOL_STD_SECTION, item); }}
                className={selectedCarriers[VOL_STD_SECTION][item.carrier.carrierId] ? 'carrier-card selected' : 'carrier-card'}
              >
                <Image src={item.carrier.originalImageUrl} />
              </Card>
            </Grid.Column>
          )}
        </Grid.Row>
        }
        {!hideVolStd &&
        <Grid.Row centered columns={5} className="show-more">
          { !showAll && data[VOL_STD_SECTION] && data[VOL_STD_SECTION].length !== filteredCarriers[VOL_STD_SECTION].length &&
          <a tabIndex={3} onClick={() => this.showMore('vol_std')}>+ Show more</a>
          }
          { !showAll && data[VOL_STD_SECTION] && data[VOL_STD_SECTION].length === filteredCarriers[VOL_STD_SECTION].length && filteredCarriers[VOL_STD_SECTION].length > 10 &&
          <a tabIndex={3} onClick={() => this.showLess('vol_std')}>- Show Less</a>
          }
        </Grid.Row>
        }
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  // const adminBrokerState = state.get('adminBroker');
  const clientPageState = state.get('client');
  return {
    carrierEmailList: state.get('adminBroker').get('carrierEmailList').toJS(),
    programs: clientPageState.get('programs').toJS(),
  };
}

export default connect(mapStateToProps)(AddCarrierContent);
