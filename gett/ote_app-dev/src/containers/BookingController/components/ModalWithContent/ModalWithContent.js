import React from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'components';
import { FastComponent } from 'utils';
import { containers } from 'testIDs';

import paymentsOptions from 'containers/PaymentsOptions/PaymentsOptions';
import reasonForTravel from 'containers/ReasonForTravel/ReasonForTravel';
import messageToDriver from 'containers/MessageToDriver/MessageToDriver';
import passengersList from 'containers/PassengersList/PassengersList';
import flightSettings from 'containers/FlightSettings/FlightSettings';
import references from 'containers/References/References';
import styles from './styles';

const DEFAULT_RENDER_CONTENT = 'flightSettings';

const renderAs = {
  paymentsOptions,
  reasonForTravel,
  messageToDriver,
  passengersList,
  flightSettings,
  references
};

const IDs = containers.ModalWithContent;

class ModalWithContent extends FastComponent {
  static propTypes = {
    booking: PropTypes.object,
    contentComponent: PropTypes.node,
    contentStyles: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.bool]),
    gesturesEnabled: PropTypes.bool,
    isVisible: PropTypes.bool,
    modalContent: PropTypes.string,
    modalType: PropTypes.string,
    onClose: PropTypes.func,
    referenceIndex: PropTypes.number,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  };

  static defaultProps = {
    gesturesEnabled: false
  };

  render() {
    const {
      isVisible, contentComponent, modalContent, onClose, title, contentStyles,
      referenceIndex, booking, modalType, gesturesEnabled, ...rest
    } = this.props;
    const Component = renderAs[modalContent || DEFAULT_RENDER_CONTENT];

    return (
      <Modal
        gesturesEnabled={gesturesEnabled}
        title={title}
        titleStyles={styles.messageLength}
        isVisible={isVisible}
        contentStyles={[styles.container, contentStyles]}
        onClose={onClose}
        testID={IDs.view}
        type={modalType || (modalContent !== 'paymentsOptions' && 'fullScreen') || 'dynamicHeight'}
      >
        {contentComponent ||
          <Component booking={booking} onClose={onClose} referenceIndex={referenceIndex} {...rest} />
        }
      </Modal>
    );
  }
}

export default ModalWithContent;
