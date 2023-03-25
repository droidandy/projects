import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import {
    findIndex
} from 'lodash/fp';
import {
    TASK_STATYS_ALL,
    TASK_STATYS_UNASSIGNED,
    TASK_STATYS_ASSIGNED,
    TASK_STATYS_PERFORMED,
    TASK_STATYS_COMPLETED,
    TASK_STATYS_CANCELLED,
    TASK_STATYS_SCHEDULED
} from 'models/googlemap';
import {
    capitalize
} from 'utils';
import CheckBoxItem from 'components/CheckBoxItem';

function TaskPanel(props) {
    return (
        <div styleName='container-panel'>
            <div styleName='inline_items' style={{alignSelf: 'auto'}}>
                <CheckBoxItem
                    value={(!!~findIndex(item => (item === TASK_STATYS_ALL), props.value.getOrElse([])))}
                    onChange={f => props.onChange(TASK_STATYS_ALL, f)}
                >
                    {capitalize(TASK_STATYS_ALL)}
                </CheckBoxItem>
            </div>
            <div styleName='inline_items' style={{width: '140px', justifyContent: 'space-between'}}>
                <CheckBoxItem
                    value={(!!~findIndex(item => (item === TASK_STATYS_UNASSIGNED), props.value.getOrElse([])))}
                    onChange={f => props.onChange(TASK_STATYS_UNASSIGNED, f)}
                >
                    {capitalize(TASK_STATYS_UNASSIGNED)}
                </CheckBoxItem>
                <div styleName="subscribers_user_block" style={{backgroundColor: '#F47321'}}>
                    <div styleName="next_inner" />
                </div>
            </div>
            <div styleName='inline_items' style={{width: '125px', justifyContent: 'space-between'}}>
                <CheckBoxItem
                    value={(!!~findIndex(item => (item === TASK_STATYS_ASSIGNED), props.value.getOrElse([])))}
                    onChange={f => props.onChange(TASK_STATYS_ASSIGNED, f)}
                >
                    {capitalize(TASK_STATYS_ASSIGNED)}
                </CheckBoxItem>
                <div styleName="subscribers_user_block" style={{backgroundColor: '#C21F50'}}>
                    <div styleName="loading_inner" />
                </div>
            </div>
            <div styleName='inline_items' style={{width: '133px', justifyContent: 'space-between'}}>
                <CheckBoxItem
                    value={(!!~findIndex(item => (item === TASK_STATYS_PERFORMED), props.value.getOrElse([])))}
                    onChange={f => props.onChange(TASK_STATYS_PERFORMED, f)}
                >
                    {capitalize(TASK_STATYS_PERFORMED)}
                </CheckBoxItem>
                <div styleName="subscribers_user_block" style={{backgroundColor: '#0B3B37'}}>
                    <div styleName="loading_inner" />
                </div>
            </div>
            <div styleName='inline_items' style={{width: '135px', justifyContent: 'space-between'}}>
                <CheckBoxItem
                    value={(!!~findIndex(item => (item === TASK_STATYS_COMPLETED), props.value.getOrElse([])))}
                    onChange={f => props.onChange(TASK_STATYS_COMPLETED, f)}
                >
                    {capitalize(TASK_STATYS_COMPLETED)}
                </CheckBoxItem>
                <div styleName="subscribers_user_block" style={{backgroundColor: '#07944A'}}>
                    <div styleName="check_inner" />
                </div>
            </div>
            <div styleName='inline_items' style={{width: '130px', justifyContent: 'space-between'}}>
                <CheckBoxItem
                    value={(!!~findIndex(item => (item === TASK_STATYS_CANCELLED), props.value.getOrElse([])))}
                    onChange={f => props.onChange(TASK_STATYS_CANCELLED, f)}
                >
                    {capitalize(TASK_STATYS_CANCELLED)}
                </CheckBoxItem>
                <div styleName="subscribers_user_block" style={{backgroundColor: '#ED1C24'}}>
                    <div styleName="cancelled_inner" />
                </div>
            </div>
            <div styleName='inline_items' style={{width: '135px', justifyContent: 'space-between'}}>
                <CheckBoxItem
                    value={(!!~findIndex(item => (item === TASK_STATYS_SCHEDULED), props.value.getOrElse([])))}
                    onChange={f => props.onChange(TASK_STATYS_SCHEDULED, f)}
                >
                    {capitalize(TASK_STATYS_SCHEDULED)}
                </CheckBoxItem>
                <div styleName="subscribers_user_block" style={{backgroundColor: '#FFDE00'}}>
                    <div styleName="time_inner" />
                </div>
            </div>
        </div>
    );
}

TaskPanel.propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default CSSModules(TaskPanel, styles);
