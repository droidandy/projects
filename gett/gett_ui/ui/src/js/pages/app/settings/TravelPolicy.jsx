/* eslint-disable react/no-multi-comp */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty, map } from 'lodash';
import {Dropdown, Switch, Tooltip} from 'antd';
import { Icon, ActionMenu, ButtonIcon, ButtonEdit, notification, Desktop, Tablet, confirm } from 'components';
import MediaQuery from 'react-responsive';
import { TravelRuleModalContainer } from './components';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import CN from 'classnames';
import dispatchers from 'js/redux/app/settings.dispatchers';
import css from './travelPolicy.css';

const { Item } = ActionMenu;
// as this page doesn't use our ResponsiveTable we need to duplicate phones breakpoint
const phoneBreakpoint = 768;

function mapStateToProps(state) {
  return { rules: state.settings.travelRules.list };
}

const MobileMenu = (rule, showForm, destroyRecord, changeStatus) => (
  <ActionMenu>
    <Item onClick={ () => showForm(rule) }>
      Edit
    </Item>
    <Item onClick={ () => destroyRecord(rule) }>
      Delete
    </Item>
    <Item onClick={ () => changeStatus(rule) }>
      { rule.active ? 'Deactivate' : 'Activate' }
    </Item>
  </ActionMenu>
);

const DragHandle = SortableHandle(() => <Icon className={ CN('text-30 dark-grey-text', css.sortableHandle) } icon="ListBulleted" />);

const SortableItem = SortableElement(({ rule, arrIndex, destroyRecord, changeStatus, showForm }) => (
  <div className={ `layout horizontal center p-15 sm-pr-10 sm-pl-10 ${css.sortableItem}` } data-name="travelPolicy">
    <Desktop>
      <div className="w-50 sm-w-30 mr-5" data-name="dragHandle">
        <DragHandle />
      </div>
      <div className="flex mr-5 ml-40" data-name="priority">{ arrIndex + 1 }</div>
      <div className="flex mr-5">
        <Switch checked={ rule.active } onChange={ () => changeStatus(rule) } data-name="active" />
      </div>
      <div className="flex four mr-10 wrap-break-word" data-name="ruleName">{ rule.name }</div>
      <div className="flex two layout horizontal sm-wrap" data-name="actions">
        <ButtonEdit className="mr-10" size="small" type="secondary" onClick={ () => showForm(rule) }>Edit</ButtonEdit>
        <ButtonEdit size="small" type="danger" onClick={ () => destroyRecord(rule) }>Delete</ButtonEdit>
      </div>
    </Desktop>
    <Tablet>
      <MediaQuery maxWidth={ phoneBreakpoint - 1 }>
        { matches => (
          <Fragment>
            <div className="w-50 sm-w-30 mr-20" data-name="dragHandle">
              <DragHandle />
            </div>
            <div className={ CN('flex four', matches ? 'mr-5' : 'mr-10') }>
              <div className={ CN('layout mb-5', matches ? 'vertical' : 'horizontal center') }>
                <div className="medium-grey-text bold-text text-12 w-50" data-name="priority">Priority:</div>
                <div className={ CN('text-14', { 'ml-10': !matches }) }>{ arrIndex + 1 }</div>
              </div>
              <div className={ CN('layout', matches ? 'vertical' : 'horizontal center') }>
                <div className="medium-grey-text bold-text text-12 w-50 flex none">Rule:</div>
                <div className={ CN('text-14 wrap-break-word', { 'ml-10': !matches }) } data-name="ruleName">{ rule.name }</div>
              </div>
            </div>
            <div className={ CN('flex layout horizontal sm-wrap center', matches ? 'one': 'three', { [css.editColumn]: !matches, 'center-center': matches }) } data-name="actions">
              { !matches ?
                <Fragment>
                  <Switch className="mr-20" checked={ rule.active } onChange={ () => changeStatus(rule) } data-name="active" />
                  <ButtonEdit className="mr-10" size="small" type="secondary" onClick={ () => showForm(rule) }>Edit</ButtonEdit>
                  <ButtonEdit size="small" type="danger" onClick={ () => destroyRecord(rule) }>Delete</ButtonEdit>
                </Fragment>
                :
                <Dropdown overlay={ MobileMenu(rule, showForm, destroyRecord, changeStatus) } trigger={ ['click'] }>
                  <Icon icon="Dots" className="text-20 pointer dark-grey-text" />
                </Dropdown>
              }
            </div>
          </Fragment>
        ) }
      </MediaQuery>
    </Tablet>
  </div>
));

const SortableList = SortableContainer(({ rules, showForm, destroyRecord, changeStatus }) => (
  <div>
    <div className={ CN('layout horizontal p-15 sm-pr-10 sm-pl-10', css.sortableList) }>
      <Desktop>
          <div className="w-50 sm-w-30 mr-5 text-10 bold-text text-uppercase">&nbsp;</div>
          <div className="flex mr-5 text-10 bold-text text-uppercase ml-40">Priority</div>
          <div className="flex mr-5 text-10 bold-text text-uppercase">Active</div>
          <div className="flex four mr-5 text-10 bold-text text-uppercase">Rule</div>
          <div className={ CN('flex two text-10 bold-text text-uppercase', css.editColumn) }>Actions</div>
      </Desktop>
      <Tablet>
        <MediaQuery maxWidth={ phoneBreakpoint - 1 }>
          { matches => (
            <Fragment>
              <div className="w-50 sm-w-30 mr-5 text-10 bold-text text-uppercase">&nbsp;</div>
              <div className="flex four mr-5 text-10 bold-text text-uppercase ml-15">Priority</div>
              <div className={ CN('flex text-10 bold-text text-uppercase', css.editColumn, matches ? 'one text-center' : 'two') }>
                { matches ? 'Actions' : 'Active and Actions' }
              </div>
            </Fragment>
          ) }
        </MediaQuery>
      </Tablet>
    </div>
    { map(rules, (rule, index) => (
        <SortableItem
          key={ rule.id }
          index={ index }
          arrIndex={ index }
          rule={ rule }
          showForm={ showForm }
          destroyRecord={ destroyRecord }
          changeStatus={ changeStatus }
        />
    )) }
  </div>
));

class TravelPolicy extends PureComponent {
  static propTypes = {
    rules: PropTypes.arrayOf(PropTypes.object),
    getTravelRules: PropTypes.func,
    destroyTravelRule: PropTypes.func,
    changeTravelRuleStatus: PropTypes.func,
    onSortEnd: PropTypes.func
  };

  componentDidMount() {
    this.props.getTravelRules();
  }

  setPopupRef = popup => this.modalContainer = popup;

  onSortEnd = ({ oldIndex, newIndex }) => {
    const newOrder = arrayMove(this.props.rules, oldIndex, newIndex);
    this.props.onSortEnd(newOrder)
      .then(() => notification.success('Priorities have been updated'))
      .catch(() => notification.error('Something went wrong'));
  };

  showForm = (rule) => {
    this.modalContainer.show(rule);
  };

  destroyRecord(record) {
    const { id } = record;

    confirm({
      content: 'Are you sure you want to delete this rule?',
      onOk: () => {
        this.props.destroyTravelRule(id)
          .then(() => notification.success('Rule has been deleted'));
      }
    });
  }

  changeStatus(rule) {
    this.props.changeTravelRuleStatus(rule).then(() => notification.success('Status has been changed'));
  }

  renderTooltipContent() {
    return (
      <div>
        <div>How to add a travel policy</div>
        <div>1. Select 'Add New Rule'</div>
        <div>2. Choose a rule name and select who it applies to</div>
        <div>3. Add in details of the rule</div>
        <div>4. Click 'save'</div>
      </div>
    );
  }

  render() {
    const { rules } = this.props;

    return (
      <Fragment>
        <div className="layout horizontal center mb-30">
          <div className="page-title flex">Travel Policy</div>
          <ButtonIcon type="primary" onClick={ () => this.showForm() } icon="Add">
            Add new policy
          </ButtonIcon>
          <Tooltip title={ this.renderTooltipContent }>
            <Icon className="ml-20 text-20" icon="Question" />
          </Tooltip>
        </div>
        <SortableList
          showForm={ this.showForm }
          destroyRecord={ record => this.destroyRecord(record) }
          changeStatus={ record => this.changeStatus(record) }
          rules={ rules }
          onSortEnd={ this.onSortEnd }
          useDragHandle
        />
        { isEmpty(rules) &&
          <div className="ant-table-placeholder">You haven't got any travel policies in place.</div>
        }
        <TravelRuleModalContainer ref={ this.setPopupRef } />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(TravelPolicy);
