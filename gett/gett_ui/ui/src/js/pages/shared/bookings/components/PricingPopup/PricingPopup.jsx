import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { ButtonLink, notification } from 'components';
import { bindModalState } from 'components/form';
import PricingForm from './PricingForm';

function mapStateToProps(state) {
  return { data: state.bookings.pricing };
}

class PricingPopup extends Component {
  static propTypes = {
    bookingId: PropTypes.number,
    data: PropTypes.shape({
      bookers: PropTypes.arrayOf(PropTypes.object),
      can: PropTypes.object,
      form: PropTypes.object,
      loading: PropTypes.bool,
      fees: PropTypes.object,
      vatRate: PropTypes.number,
      fareQuote: PropTypes.number
    }),
    onShow: PropTypes.func,
    onSave: PropTypes.func
  };

  componentDidUpdate(prevProps) {
    const { data: { form } } = this.props;
    const { data: { form: prevForm } } = prevProps;

    if (!isEqual(form, prevForm)) {
      this.setState({ form });
    }
  }

  showForm = () => {
    this.props.onShow(this.props.bookingId);
    this.setState({ formVisible: true });
  };

  closeForm = () => {
    this.setState({ formVisible: false });
  };

  saveForm = (attrs, form) => {
    this.props.onSave(this.props.bookingId, attrs)
      .then(this.closeForm)
      .then(() => notification.success('Changes have been saved'))
      .catch(err => form.setErrors(err.response.data.errors));
  };

  render() {
    const { data: { bookers, loading, can, fees, vatRate, fareQuote } } = this.props;

    return (
      <div className="layout horizontal">
        <ButtonLink
          type="secondary"
          className="flex mb-10 sm-ml-5 sm-mr-5"
          buttonClassName="block ant-btn-sm"
          onClick={ this.showForm }
          key="sendMessageButton"
        >
          Pricing
        </ButtonLink>
        <PricingForm
          { ...bindModalState(this) }
          width={ 480 }
          title="Pricing Details"
          bookers={ bookers }
          readonly={ !can.edit }
          fees={ fees }
          vatRate={ vatRate }
          fareQuote={ fareQuote }
          loading={ loading }
          onRequestSave={ this.saveForm }
          onRequestClose={ this.closeForm }
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(PricingPopup);
