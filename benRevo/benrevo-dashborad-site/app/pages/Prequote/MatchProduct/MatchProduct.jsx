import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Loader } from 'semantic-ui-react';
import { DetailPage } from '@benrevo/benrevo-react-match';
import BlockerModal from '../components/BlockerModal/BlockerModal';
import { KAISER_SECTION } from '../constants';

class MatchProduct extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    quoteType: PropTypes.string.isRequired,
    creatingPlans: PropTypes.bool.isRequired,
    getOptions: PropTypes.func.isRequired,
    changeCurrentPage: PropTypes.func.isRequired,
    createClientPlans: PropTypes.func.isRequired,
    options: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,
    carriersList: PropTypes.array.isRequired,
    mainCarrier: PropTypes.object.isRequired,
    page: PropTypes.object.isRequired,
    loadingOptions: PropTypes.bool.isRequired,
    history: PropTypes.array.isRequired,
    rfpIds: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
  };
  state = {
    isModalOpen: false,
  };

  componentWillMount() {
    const { section, changeCurrentPage, history, rfpIds } = this.props;
    if (!history.length) {
      this.setState({
        isModalOpen: true,
      });
    }

    if (rfpIds.length) {
      this.start();
    }

    const option = {
      carrier: {},
      id: null,
    };
    changeCurrentPage(section, option);
  }

  componentWillReceiveProps(nextProps) {
    const { options, loadingOptions, quoteType, rfpIds, creatingPlans, getOptions, section } = nextProps;

    if (rfpIds.length && !this.props.rfpIds.length) {
      this.start(nextProps);
    }

    if (!creatingPlans && this.props.creatingPlans) {
      getOptions(section);
    }

    if (loadingOptions !== this.props.loadingOptions && this.props.loadingOptions) {
      let hasOption1 = false;
      for (let i = 0; i < options.length; i += 1) {
        const item = options[i];
        if (item.name === 'Option 1' && item.quoteType === quoteType) {
          hasOption1 = true;
          this.createOption1(item.id);
          break;
        }
      }

      if (!hasOption1) this.createOption1();
    }
  }

  start(props = this.props) {
    const { section, rfpIds } = props;

    this.props.createClientPlans(section, rfpIds);
  }

  createOption1(id) {
    const { carriersList, mainCarrier } = this.props;
    let carrier = null;

    for (let i = 0; i < carriersList.length; i += 1) {
      const item = carriersList[i].carrier;

      if (item.name === mainCarrier.name) {
        carrier = carriersList[i];
        break;
      }
    }

    const option = {
      carrier,
      id: id || 'new',
      optionType: 'OPTION',
      kaiser: this.props.quoteType === KAISER_SECTION,
    };
    this.props.changeCurrentPage(this.props.section, option);
  }

  render() {
    const {
      section,
      options,
      quoteType,
      page,
      loadingOptions,
    } = this.props;
    const { isModalOpen } = this.state;
    const clientId = this.props.params.clientId ? this.props.params.clientId : 'new';
    const link = `prequote/clients/${clientId}/summary`;
    let hasOption1 = false;
    for (let i = 0; i < options.length; i += 1) {
      const item = options[i];
      if (item.name === 'Option 1' && item.quoteType === quoteType) {
        hasOption1 = true;
        break;
      }
    }

    return (
      <Fragment>
        {
          !isModalOpen ?
            <div className="prequoted-match" key={section + quoteType}>
              { (page.id) && !loadingOptions &&
                <DetailPage
                  {...this.props}
                  section={section}
                />
              }
              { (loadingOptions || !page.id) &&
                <div className="prequoted-match-loader">
                  <Loader inline active indeterminate size="big">Fetching plans</Loader>
                </div>
              }
            </div>
          :
            <BlockerModal
              open={isModalOpen}
              title="We need a little more info"
              description="Before moving to the Match Plans section, we'll need you to complete Send to Rater"
              link={link}
            />
        }
      </Fragment>
    );
  }
}

export default withRouter(MatchProduct);
