import React from 'react';
import PropTypes from 'prop-types';
import { Card, Header, Button, Dimmer, Loader } from 'semantic-ui-react';
import CardItem from './components/CardItem';
import CardItemEmpty from './components/CardItemEmpty';
import DiscountBanner from '../components/DiscountBanner';
import CardItemCVDirectToPresentation from './components/CardItemCVDirectToPresentation';
import CarriersModal from './components/CarriersModal';
import { CompareImage, GuideTour } from '@benrevo/benrevo-react-core';
import { PLAN_TYPE_MEDICAL, RENEWAL, UHC } from '../constants';

class Options extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    selected: PropTypes.number,
    loading: PropTypes.bool.isRequired,
    qualificationLoading: PropTypes.bool.isRequired,
    readonly: PropTypes.bool.isRequired,
    showEmptyOption: PropTypes.bool.isRequired,
    hasClearValue: PropTypes.bool.isRequired,
    hideMultiCarrier: PropTypes.bool,
    showQuotes: PropTypes.bool.isRequired,
    showDtp: PropTypes.bool.isRequired,
    dtp: PropTypes.bool.isRequired,
    quotes: PropTypes.array.isRequired,
    load: PropTypes.bool.isRequired,
    client: PropTypes.object.isRequired,
    qualification: PropTypes.object.isRequired,
    current: PropTypes.object.isRequired,
    mainCarrier: PropTypes.object.isRequired,
    clearValueCarrier: PropTypes.object.isRequired,
    checkedOptions: PropTypes.array.isRequired,
    quotesStatus: PropTypes.array.isRequired,
    options: PropTypes.array.isRequired,
    carrierList: PropTypes.array.isRequired,
    changePage: PropTypes.func.isRequired,
    optionCheck: PropTypes.func.isRequired,
    getOptions: PropTypes.func.isRequired,
    optionsSelect: PropTypes.func.isRequired,
    optionsDelete: PropTypes.func.isRequired,
    getQuotesStatus: PropTypes.func.isRequired,
    downloadQuote: PropTypes.func.isRequired,
    info: PropTypes.func.isRequired,
    createDTPClearValue: PropTypes.func.isRequired,
    updateClient: PropTypes.func.isRequired,
    getDTPClearValueStatus: PropTypes.func.isRequired,
    noButton: PropTypes.bool,
    downloadPPT: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
    };
    this.changePage = this.changePage.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
    this.onCompare = this.onCompare.bind(this);
  }

  componentWillMount() {
    const section = this.props.section;

    if (this.props.load) this.props.getQuotesStatus(section);
  }

  componentDidMount() {
    const section = this.props.section;

    if (this.props.load) this.props.getOptions(section);
  }

  onCompare() {
    if (this.props.checkedOptions.length < 2) {
      const notificationOpts = {
        message: 'Please add at least two Options to Compare',
        position: 'tc',
        autoDismiss: 5,
      };
      this.props.info(notificationOpts);
    } else this.changePage('Compare');
  }

  modalToggle() {
    const { current, mainCarrier } = this.props;
    if (mainCarrier.carrier.displayName === current.carrier && current.carrier === UHC) {
      this.props.changePage(this.props.section, 'Overview', false, this.props.options.length + 1, 'new', mainCarrier, { kaiser: false, optionType: RENEWAL });
    } else {
      this.setState({ modalOpen: !this.state.modalOpen });
    }
  }

  changePage(page = 'Overview', readOnly, index = this.props.options.length, id, carrier, options) {
    this.modalToggle();
    this.props.changePage(this.props.section, page, readOnly, index + 1, id, carrier, options);
  }

  render() {
    const {
      current,
      readonly,
      dtp,
      quotes,
      options,
      section,
      optionCheck,
      checkedOptions,
      optionsSelect,
      mainCarrier,
      clearValueCarrier,
      selected,
      loading,
      optionsDelete,
      carrierList,
      downloadQuote,
      showQuotes,
      showDtp,
      showEmptyOption,
      hasClearValue,
      hideMultiCarrier,
      noButton,
      downloadPPT,
    } = this.props;
    let hasKaiser = false;
    let hasStandard = false;
    let declined = false;
    const notSubmitted = !this.props.quotesStatus.length;

    for (let i = 0; i < this.props.quotes.length; i += 1) {
      const item = this.props.quotes[i];
      if (item.rfpCarrierId === mainCarrier.rfpCarrierId && (item.quoteType === 'KAISER' || item.quoteType === 'KAISER_EASY')) {
        hasKaiser = true;
      } else if (item.rfpCarrierId === mainCarrier.rfpCarrierId && (item.quoteType === 'STANDARD' || item.quoteType === 'EASY')) {
        hasStandard = true;
      } else if (item.rfpCarrierId === mainCarrier.rfpCarrierId && (item.quoteType === 'DECLINED')) {
        declined = true;
      }
    }

    return (
      <div className="presentation-options">
        <Dimmer active={loading} inverted>
          <Loader indeterminate size="big">Loading options</Loader>
        </Dimmer>
        <div>
          <Header className="presentation-options-header" as="h2">{section} Options { section === PLAN_TYPE_MEDICAL && <DiscountBanner /> }</Header>
          {!notSubmitted &&
            <div className="action-button">
              <Button primary onClick={() => downloadPPT()}>Download Powerpoint Presentation</Button>
              <Button primary onClick={this.onCompare}>Compare Options</Button>
            </div>
          }
        </div>
        <Card.Group stackable itemsPerRow="3">
          {current.id &&
            <CardItem
              section={section}
              data={current}
              notSubmitted={notSubmitted}
              carrierList={carrierList}
              mainCarrier={mainCarrier}
              isCurrent
              checkedOptions={checkedOptions}
              optionCheck={optionCheck}
            />
          }
          { declined &&
          <CardItem
            section={section}
            declined={declined}
            data={{ id: -1, name: 'Option 1', carrier: mainCarrier.carrier.name }}
            checkedOptions={checkedOptions}
            carrierList={carrierList}
            mainCarrier={mainCarrier}

          />
          }
          { !declined && showEmptyOption && this.props.quotesStatus.length > 0 &&
            <CardItemEmpty
              section={section}
              mainCarrier={mainCarrier}
            />
          }
          { options.map((item, i) =>
            <CardItem
              section={section}
              readonly={readonly}
              data={item}
              carrierList={carrierList}
              mainCarrier={mainCarrier}
              key={i}
              index={i}
              changePage={this.changePage}
              optionCheck={optionCheck}
              checkedOptions={checkedOptions}
              optionsSelect={optionsSelect}
              optionsDelete={optionsDelete}
              selected={selected}
            />
          )}
          {showDtp && dtp && !hasClearValue && !loading && !notSubmitted &&
            <CardItemCVDirectToPresentation
              client={this.props.client}
              qualification={this.props.qualification}
              qualificationLoading={this.props.qualificationLoading}
              createDTPClearValue={this.props.createDTPClearValue}
              getDTPClearValueStatus={this.props.getDTPClearValueStatus}
              updateClient={this.props.updateClient}
            />
          }
          {!notSubmitted && !declined && (hasStandard || hasKaiser || hasClearValue) &&
            <Card
              as="div"
              className="card-add"
              onClick={() => { this.modalToggle(); }}
            >
              <div className="card-add-inner">
                <div className="plus">+</div>
                <div className="title">Add new option</div>
              </div>
            </Card>
          }
        </Card.Group>
        <CarriersModal
          showEmptyOption={showEmptyOption}
          clearValueCarrier={clearValueCarrier}
          hasClearValue={hasClearValue}
          hideMultiCarrier={hideMultiCarrier}
          mainCarrier={mainCarrier}
          quotes={quotes}
          current={current}
          section={section}
          open={this.state.modalOpen}
          carrierList={this.props.carrierList}
          modalToggle={this.modalToggle}
          changePage={this.changePage}
        />
        {hasStandard && showQuotes && !noButton &&
          <div className="download-quote-button">
            <a tabIndex={0} onClick={() => { downloadQuote(section); }}>View Original Quote</a>
          </div>
        }
        {hasKaiser && showQuotes && !noButton &&
          <div className="download-quote-button">
            <a tabIndex={0} onClick={() => { downloadQuote(section, true); }}>View Original Quote (Alongside Kaiser)</a>
          </div>
        }
        { !loading && options.length > 0 && section === PLAN_TYPE_MEDICAL && !showEmptyOption && !declined && <GuideTour page="OptionList" /> }
        { !loading && options.length > 0 && section === PLAN_TYPE_MEDICAL && (showEmptyOption || declined) && <GuideTour page="OptionListCV" /> }
      </div>
    );
  }
}

export default Options;
