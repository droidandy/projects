import React from 'react';
import PropTypes from 'prop-types';
import { ButtonEdit } from 'components';
import { ModalForm, Switch } from 'components/form';

export default class CancelForm extends ModalForm {
  static propTypes = {
    ...ModalForm.propTypes,
    handleFee: PropTypes.bool,
    recurring: PropTypes.bool
  };

  saveWithSchedule = () => {
    return this.ifValid(() => {
      const params = { ...this.get(), cancelSchedule: true };

      this.props.onRequestSave(params, this);
    });
  };

  getTitle() {
    return 'Cancel Order';
  }

  getFooter() {
    const { onRequestClose, recurring, loadingProp, [loadingProp]: loading } = this.props;

    return [
      <ButtonEdit type="secondary" key="back" onClick={ onRequestClose }>
        No
      </ButtonEdit>,
      recurring &&
        <ButtonEdit type="primary" key="submitRecurring" onClick={ this.saveWithSchedule } loading={ !!loading }>
          Cancel Order And Schedule
        </ButtonEdit>,
      <ButtonEdit type="primary" key="submit" onClick={ this.save } loading={ !!loading }>
        Yes
      </ButtonEdit>
    ];
  }

  $render($) {
    const { handleFee } = this.props;

    return (
      <div>
        <p>
          Are you sure you want to cancel your booking?
          The driver will no longer pick your passenger(s) up.
        </p>

        { handleFee &&
          <div>
            <div className="layout horizontal center mt-20 mb-20">
              <Switch data-name="cancellationFee" { ...$('cancellationFee') } />
              <label className="ml-15">Add cancellation fee</label>
              { this.getError('cancellationFee') &&
                <div className="error">Select an option</div>
              }
            </div>
          </div>
        }
      </div>
    );
  }
}
