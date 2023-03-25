import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'components';
import { connect } from 'react-redux';
import { bindState } from 'components/form';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import { BookingsSidebar, BookingForm } from './components';
import dispatchers from 'js/redux/affiliate/bookings.dispatchers';

import css from './components/Bookings.css';

const defaultLogoUrl = '/assets/images/no-company-logo.png';

function mapStateToProps(state) {
  return {
    companyAddress: state.session.layout.address,
    companyName: state.session.layout.companyName,
    logoUrl: state.session.layout.logoUrl,
    defaultDriverMessage: state.bookings.formData.defaultDriverMessage
  };
}

class Bookings extends PureComponent {
  static propTypes = {
    companyName: PropTypes.string,
    companyAddress: PropTypes.object,
    saveBooking: PropTypes.func,
    getFormData: PropTypes.func,
    logoUrl: PropTypes.string
  };

  state = {
    form: this.buildBooking()
  };

  componentDidMount() {
    const { getFormData } = this.props;

    this.setState({ form: this.buildBooking(this.props) });

    getFormData();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps, this.props)) {
      this.setState({ form: this.buildBooking(this.props) });
    }
  }

  buildBooking(props = this.props) {
    return {
      scheduledType: 'now',
      scheduledAt: moment(),
      vehicleName: 'BlackTaxi',
      pickupAddress: props.companyAddress,
      message: props.defaultDriverMessage || ''
    };
  }

  saveBooking = (booking) => {
    return this.props.saveBooking(booking)
      .then(() => this.setState({ form: this.buildBooking() }));
  };

  render() {
    const { companyName, companyAddress, logoUrl } = this.props;

    return (
      <div className={ css.wrapper }>
        <div className="page-title mb-10">Bookings</div>
        <div className="p-15 pl-20 pr-20 layout horizontal card br-6">
          <Avatar squared size={ 140 } smSize={ 80 } className="mr-15" src={ logoUrl || defaultLogoUrl } />
          <div>
            <div className="mb-5" data-name="companyName">{ companyName }</div>
            <div className="mb-5" data-name="companyAddress">{ companyAddress && companyAddress.line }</div>
          </div>
        </div>
        <BookingForm
          { ...bindState(this) }
          onRequestSave={ this.saveBooking }
          validateOnSave={ false }
        />
        <BookingsSidebar />
      </div>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(Bookings);
