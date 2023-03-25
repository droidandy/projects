import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import gettAnalytics from 'utils/gettAnalytics';
import Form, { Input, Select, TimePicker, CheckboxGroup, Checkbox, VehicleCheckbox } from 'components/form';
import { Button, Phone } from 'components';
import { Row, Col } from 'antd';
import { map, find, noop, isEmpty } from 'lodash';
import moment from 'moment';
import dispatchers from 'js/redux/app/settings.dispatchers';

import css from './settings.css';
import CN from 'classnames';

const { Option } = Select;

function mapStateToProps(state) {
  return { data: state.settings.travelRules.formData, companyName: state.session.layout.companyName };
}

class TravelRuleForm extends Form {
  static propTypes = {
    ...Form.propTypes,
    data: PropTypes.shape({
      members: PropTypes.arrayOf(PropTypes.object),
      workRoles: PropTypes.arrayOf(PropTypes.object),
      departments: PropTypes.arrayOf(PropTypes.object),
      vehicles: PropTypes.arrayOf(PropTypes.object)
    }),
    onRequestClose: PropTypes.func,
    companyName: PropTypes.string
  };

  save = this.save.bind(this);

  validations = {
    name: {
      presence: { message: 'Give this rule a name'}
    },
    minDistance: 'numericality',
    maxDistance: 'numericality',
    maxTime: function(value) {
      const [minHour, minMunute] = this.get('minTime').split(':');
      const [maxHour, maxMinute] = value.split(':');

      if (moment().hour(maxHour).minute(maxMinute).isSameOrBefore(moment().hour(minHour).minute(minMunute))) {
        return 'after time should be less than before time';
      }
    }
  };

  containerRef = container => this.container = container;

  getPopupContainer = () => this.container;

  getUserName(id) {
    const user = find(this.props.data.members, { id });

    return `${user.firstName} ${user.lastName}`;
  }

  createAnalyticsCallback = (eventName) => {
    const { companyName, attrs: { id } } = this.props;
    const travelRuleId = id || 0;

    switch (eventName) {
      case 'guest_passenger_checked':
        return () => {
          if (!this.props.attrs.allowUnregistered) {
            gettAnalytics(`company_web|travel_policy|${eventName}`, { travelRuleId, companyName });
          }
        };
      case 'cheapest_enabled':
        return () => {
          if (!this.props.attrs.cheapest) {
            gettAnalytics(`company_web|travel_policy|${eventName}`, { travelRuleId, companyName });
          }
        };
      default: return noop;
    }
  };

  $render($) {
    const { onRequestClose, data: { members, workRoles, departments, vehicles }, attrs: { location } } = this.props;

    return (
      <div id={ this.componentName } ref={ this.containerRef }>
        <Input { ...$('name') } placeholder="Rule Name" className="mb-20" />
        <div className="text-16 mt-10 mb-10 light-text">People</div>
        <Row type="flex" gutter={ 20 }>
          <Col md={ 12 } sm={ 24 } xs={ 24 }>
            <Select
              { ...$('departmentPks') }
              mode="multiple"
              allowClear
              className="block mb-20"
              placeholder="Departments"
              containerId={ this.componentName }
              getPopupContainer={ this.getPopupContainer }
            >
              { map(departments, dep => <Option key={ dep.id }>{ dep.name }</Option>) }
            </Select>

            <Select
              { ...$('workRolePks') }
              mode="multiple"
              allowClear
              className="block mb-20"
              placeholder="Work Roles"
              containerId={ this.componentName }
              getPopupContainer={ this.getPopupContainer }
            >
              { map(workRoles, role => <Option key={ role.id }>{ role.name }</Option>) }
            </Select>
          </Col>
          <Col md={ 12 } sm={ 24 } xs={ 24 }>
            <Select
              { ...$('memberPks') }
              mode="multiple"
              filterOption={ Select.caseInsensitiveFilter }
              allowClear
              className="block mb-20"
              placeholder="Users"
              icon="UsersIcon"
              getPopupContainer={ this.getPopupContainer }
            >
              { map(members, user => <Option key={ user.id }>{ this.getUserName(user.id) }</Option>) }
            </Select>
            <Checkbox { ...$('allowUnregistered') } onClick={ this.createAnalyticsCallback('guest_passenger_checked') }>Guest passenger</Checkbox>

            { this.getError('users') &&
              <div className="error mb-20">{ this.getError('users') }</div>
            }
          </Col>
        </Row>
        <Row type="flex" gutter={ 20 }>
          <Col className="layout vertical" md={ 12 } sm={ 24 } xs={ 24 }>
            <div className="text-16 mb-10 light-text mt-10">Location</div>
            <Select
              { ...$('location') }
              allowClear={ !isEmpty(location) }
              className="block"
              containerId={ this.componentName }
              getPopupContainer={ this.getPopupContainer }
            >
              <Option key="GreaterLondon">Greater London</Option>
              <Option key="CentralLondon">Central London</Option>
              <Option key="Birmingham">Birmingham</Option>
              <Option key="Leeds">Leeds</Option>
              <Option key="Glasgow">Glasgow</Option>
              <Option key="Manchester">Manchester</Option>
              <Option key="Edinburgh">Edinburgh</Option>
              <Option key="Liverpool">Liverpool</Option>
            </Select>
          </Col>
          <Col className="layout vertical" md={ 12 } sm={ 24 } xs={ 24 }>
            <div className="text-16 light-text mt-10">Distance</div>
            <Row type="flex" gutter={ 20 }>
              <Col className="layout horizontal center mt-10" sm={ 12 } xs={ 24 }>
                <div className="mr-15 text-12 bold-text w-60">more than</div>
                <Input { ...$('minDistance') } addonAfter="mi" className="flex" />
              </Col>
              <Col className="layout horizontal center mt-10" sm={ 12 } xs={ 24 }>
                <div className="mr-15 text-12 bold-text w-60">less than</div>
                <Input { ...$('maxDistance') } addonAfter="mi" className="flex" />
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="layout horizontal sm-wrap mb-20 mt-30">
          <div className="flex sm-full-width xs-mb-20">
            <div className="text-16 mb-10 light-text">Week day</div>
            <div className="layout horizontal center wrap mt-20">
              <CheckboxGroup { ...$('weekdays') } className="layout horizontal center mb-20 wrap">
                <Checkbox value="7" className={ css.weekdayCheckbox } data-name="sunday">Sun</Checkbox>
                <Checkbox value="1" className={ css.weekdayCheckbox } data-name="monday">Mon</Checkbox>
                <Checkbox value="2" className={ css.weekdayCheckbox } data-name="tuesday">Tue</Checkbox>
                <Checkbox value="3" className={ css.weekdayCheckbox } data-name="wednesday">Wed</Checkbox>
                <Checkbox value="4" className={ css.weekdayCheckbox } data-name="thursday">Thu</Checkbox>
                <Checkbox value="5" className={ css.weekdayCheckbox } data-name="friday">Fri</Checkbox>
                <Checkbox value="6" className={ css.weekdayCheckbox } data-name="saturday">Sat</Checkbox>
              </CheckboxGroup>
            </div>
          </div>
          <div className="flex xs-full-width mb-10 ml-20 sm-ml-0">
            <div className="text-16 mb-10 light-text">Time</div>
            <div className="layout horizontal center wrap">
              <div className="flex layout vertical xs-mb-20 mr-25 xs-full-width">
                <div className="text-12 bold-text mb-5">after</div>
                <TimePicker { ...$('minTime') } hourClassName={ css.timePicker } minuteClassName={ css.timePicker } mode="string" />
              </div>
              <div className="flex layout vertical">
                <div className="text-12 bold-text mb-5">before</div>
                <TimePicker { ...$('maxTime') } hourClassName={ css.timePicker } minuteClassName={ css.timePicker } mode="string" />
              </div>
            </div>
          </div>
        </div>
        <Phone>
          { matches => (
              <CheckboxGroup { ...$('vehiclePks') } className={ CN('layout horizontal center wrap', css.vehicleTypeWrapper) } name="carTypes">
                { map(vehicles, ({ id, name }, i) => {
                    return (
                      <VehicleCheckbox
                        key={ i }
                        vehicle={ name }
                        size={ matches ? 'small' : 'big' }
                        value={ `${id}` }
                        className={ CN('mr-20', css.vehicleType) }
                        data-name={ name }
                      />
                    );
                  })
                }
              </CheckboxGroup>
          ) }
        </Phone>
        <div className="layout horizontal mt-30 sm-wrap">
          <div className="flex sm-full-width">
            <Checkbox { ...$('cheapest') } disabled={ (this.get('vehiclePks.length') || 0) < 2 } onClick={ this.createAnalyticsCallback('cheapest_enabled') }>Cheapest</Checkbox>
          </div>
          <div className="flex text-12 grey-text bold-text text-right ml-20 sm-ml-0 sm-text-left sm-mt-20">
            You will be unable to book a taxi if there are no vehicles selected
          </div>
        </div>

        <Row type="flex" justify="end" className="mt-35 layout center-justified">
          <Button type="secondary" className="mr-20 xs-mr-5" key="back" onClick={ onRequestClose }>
            Cancel
          </Button>
          <Button type="primary" key="submit" onClick={ this.save } >
            Save Travel Policy
          </Button>
        </Row>
      </div>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(TravelRuleForm);
