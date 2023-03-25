import React from 'react';
import PropTypes from 'prop-types';
import { } from '@benrevo/benrevo-react-core';
import CarrierCheck from './components/CarrierCheck';
import CarrierSelect from './components/CarrierSelect';
import CarrierSend from './components/CarrierSend';
import SubNavigation from '../components/SubNavigation';
import messages from '../messages';

class CarrierPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    route: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    virginCoverage: PropTypes.object.isRequired,
    getCarrierEmails: PropTypes.func.isRequired,
    rfpCreated: PropTypes.bool.isRequired,
    getRFPStatus: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    clearCarrierData: PropTypes.func.isRequired,
    statusLoaded: PropTypes.bool.isRequired,
    page: PropTypes.string.isRequired,
    rfpCarriers: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.changePage = this.changePage.bind(this);
  }

  componentWillMount() {
    const { getCarrierEmails, rfpCreated, getRFPStatus, clearCarrierData } = this.props;
    clearCarrierData();
    getCarrierEmails();

    if (rfpCreated) {
      getRFPStatus();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rfpCreated !== this.props.rfpCreated && !nextProps.statusLoaded) {
      nextProps.getRFPStatus();
    }
  }

  changePage(page) {
    this.props.changePage(page);
  }

  render() {
    const { products, page, client } = this.props;
    const selected = {};
    for (let i = 0; i < Object.keys(products).length; i += 1) {
      const key = Object.keys(products)[i];
      selected[key] = products[key];
    }

    return (
      <div>
        <SubNavigation
          route={this.props.route}
          messages={messages}
          prefix={`/clients/${client.id}`}
          products={this.props.products}
          virginCoverage={this.props.virginCoverage}
          parent="rfp"
        />
        { page === 'check' && <CarrierCheck {...this.props} changePage={this.changePage} selected={selected} /> }
        { page === 'select' && <CarrierSelect {...this.props} changePage={this.changePage} /> }
        { page === 'send' && <CarrierSend {...this.props} changePage={this.changePage} /> }
      </div>
    );
  }
}

export default CarrierPage;
