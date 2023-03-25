import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import CN from 'classnames';
import Form, { Select, Switch, ImageEditor, Checkbox } from 'components/form';
import MemberFormBlock from 'pages/shared/members/MemberFormBlock';
import { Alert, Button, Tooltip } from 'antd';
import { Avatar, ButtonLink } from 'components';

import css from './style.css';

const { Option } = Select;

export default class BookerForm extends Form {
  static propTypes = {
    ...Form.propTypes,
    data: PropTypes.shape({
      booker: PropTypes.object,
      passengers: PropTypes.arrayOf(PropTypes.object),
      workRoles: PropTypes.arrayOf(PropTypes.object),
      departments: PropTypes.arrayOf(PropTypes.object)
    }),
    isAffiliate: PropTypes.bool,
    backTo: PropTypes.string
  };

  static defaultProps = {
    ...Form.defaultProps,
    backTo: '/bookers'
  };

  validations = {
    email: {
      presence: { message: 'Please fill in the email' },
      email: true
    },
    firstName: {
      presence: { message: 'Please fill in the first name' },
      personName: { length: 30 }
    },
    lastName: {
      presence: { message: 'Please fill in the last name' },
      personName: { length: 30 }
    },
    phone: {
      presence: { message: 'Please fill in the phone number' },
      phoneNumber: true
    },
    mobile: 'phoneNumber'
  };

  save = this.save.bind(this);

  changeActive(value) {
    if (value && this.rollbackPassengerPks) {
      return this.rollbackPassengerPks();
    }

    const currentPassengerPks = this.get('passengerPks');
    const currentAssignedToAllPassengers = this.get('assignedToAllPassengers');
    const attrs = { active: value };

    if (!value && currentPassengerPks.length) {
      this.rollbackPassengerPks = () => {
        this.rollbackPassengerPks = null;

        this.set({
          active: true,
          passengerPks: currentPassengerPks,
          assignedToAllPassengers: currentAssignedToAllPassengers
        });
      };
      attrs.passengerPks = [];
      attrs.assignedToAllPassengers = false;
    }

    this.set(attrs);
  }

  changeOnboarding(value) {
    this.mutableOnboarding = true;
    this.set('onboarding', value ? value : null);
  }

  changeAssignedToAllPassengers(checked) {
    const attrs = { assignedToAllPassengers: checked };
    if (checked) {
      attrs.passengerPks = this.props.data.passengers.map(pass => pass.id);
    }
    this.set(attrs);
  }

  getTitle() {
    const id = this.get('id');
    return id ? `Edit Booker #${id}` : 'Add New Booker';
  }

  getRolesList() {
    return this.props.isAffiliate
      ? ['admin', 'booker']
      : ['admin', 'booker', 'finance', 'travelmanager'];
  }

  renderActive() {
    return (
      <Tooltip
        placement="left"
        title={ this.get('active')
          ? 'Deactivate to stop booker from making bookings'
          : 'Activate to allow booker to make bookings'
        }
      >
        <div className="layout horizontal center mb-20">
          <Switch { ...this.$('active')(this.changeActive) } />
          <div className="ml-20">Active</div>
        </div>
      </Tooltip>
    );
  }

  renderOnboarding() {
    return (
      this.get('onboarding') === false
      ? <div className="layout horizontal center mb-20">
          <div>Onboarded</div>
        </div>
      : <Tooltip placement="left" title="Invite booker to join the platform and set a password">
          <div className="layout horizontal center mb-20">
            <Switch
              { ...this.$('onboarding')(this.changeOnboarding) }
              disabled={ !this.mutableOnboarding && !this.isNew && this.get('onboarding') }
            />
            <div className="ml-20">Onboarding</div>
          </div>
        </Tooltip>
    );
  }

  renderReinvite() {
    const { onReinvite } = this.props;
    return (
      <Tooltip placement="left" title="Resend the onboarding invitation">
        <Button size="small" className="mt-10" onClick={ onReinvite } type="secondary">Reinvite</Button>
      </Tooltip>
    );
  }

  $render($) {
    const { attrs, data: { passengers, workRoles, departments, can }, backTo } = this.props;

    return (
      <Fragment>
        <div className={ CN('layout justified', css.header, { [css.editable]: this.get('id') }) }>
          <div className={ CN('page-title', css.title) }>{ this.getTitle() }</div>
          <div className={ CN('layout horizontal center', css.actions) }>
            <ButtonLink type="secondary" className="mr-10" to={ backTo } data-name="cancel">
              Cancel
            </ButtonLink>
            <Button type="primary" onClick={ this.save } data-name="saveBooker">
              { this.get('id') ? 'Update' : 'Add booker' }
            </Button>
          </div>
        </div>
        <div className={ CN('sm-wrap', css.bookerMainContainer) }>
          <div className={ CN('flex two sm-order-2 contentContainer pl-0 mb-20 mr-20 sm-mr-0 sm-full-width', css.bookerFormContainer) }>
            <MemberFormBlock
              $={ $ }
              attrs={ attrs }
              can={ can }
              roles={ this.getRolesList() }
              workRoles={ workRoles }
              departments={ departments }
            />
            { can.editAll &&
              <div className="ml-30 mr-30">
                { this.rollbackPassengerPks &&
                  <Alert
                    message="Warning"
                    description="Deactivating this booker will unassign them from all passengers"
                    type="warning"
                    showIcon
                  />
                }

                <div className="layout horizontal justified">
                  <p className="mb-5 text-12 bold-text dark-grey-text">Passengers</p>
                  <Tooltip
                    placement="left"
                    title="Add all available passengers"
                    className="layout horizontal"
                  >
                    <Checkbox
                      { ...$('assignedToAllPassengers')(this.changeAssignedToAllPassengers) }
                      disabled={ !can.assignPassengers || !this.get('active') }
                    />
                    <div className="ml-5 text-12 bold-text">Add all available passengers</div>
                  </Tooltip>
                </div>

                <Select
                  { ...$('passengerPks') }
                  mode="multiple"
                  className={ CN('mb-20', css.select) }
                  placeholder="Please select passengers"
                  labelClassName="mb-5"
                  disabled={ !can.assignPassengers || !this.get('active') || this.get('assignedToAllPassengers') }
                  filterOption={ Select.caseInsensitiveFilter }
                >
                  { passengers.map(pass =>
                      <Option key={ pass.id }>{ `${pass.firstName} ${pass.lastName}` }</Option>
                    )
                  }
                </Select>
              </div>
            }
          </div>

          <div className={ CN('flex one sm-order-1 text-center contentContainer pt-30 p-20 mb-20 sm-full-width', css.bookerAvatarSection) }>
            <ImageEditor { ...$('avatar') } uploadText={ this.get('avatarUrl') ? 'Edit' : 'Add new photo' }>
              <Avatar className="mb-20 center-block" name={ `${ this.get('firstName') } ${ this.get('lastName') }` } src={ this.get('avatar') || this.get('avatarUrl') } />
            </ImageEditor>

            { can.reinvite && this.renderReinvite() }

            <div className={ CN('layout horizontal mt-20', css.bookerControllsRow) }>
              <div className={ css.bookerControllsContainer }>
                { can.changeActive && this.renderActive() }
                { can.editAll && this.renderOnboarding() }
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
