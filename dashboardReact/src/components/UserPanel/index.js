import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import {
    findIndex
} from 'lodash/fp';
import {
    USER_TYPE_SUBSCRIBER,
    USER_TYPE_GOFUNDI,
    USER_TYPE_ALL
} from 'models/googlemap';
import {
    capitalize
} from 'utils';
import CheckBoxItem from 'components/CheckBoxItem';

function UserPanel(props) {
    return (
        <div styleName='row_items'>
            <div styleName='inline_items'>
                <CheckBoxItem
                    value={(!!~findIndex(item => (item === USER_TYPE_ALL), props.value.getOrElse([])))}
                    onChange={f => props.onChange(USER_TYPE_ALL, f)}
                >
                    {capitalize(USER_TYPE_ALL)}
                </CheckBoxItem>
            </div>
            <div styleName='inline_items'>
                <CheckBoxItem
                    value={(!!~findIndex(item => (item === USER_TYPE_SUBSCRIBER), props.value.getOrElse([])))}
                    onChange={f => props.onChange(USER_TYPE_SUBSCRIBER, f)}
                >
                    {capitalize(`${USER_TYPE_SUBSCRIBER}s`)}
                </CheckBoxItem>
                <div styleName="subscribers_user_block">
                    <div styleName="user_inner" />
                </div>
            </div>
            <div styleName='inline_items'>
                <CheckBoxItem
                    value={(!!~findIndex(item => (item === USER_TYPE_GOFUNDI), props.value.getOrElse([])))}
                    onChange={f => props.onChange(USER_TYPE_GOFUNDI, f)}
                >
                    {capitalize(`${USER_TYPE_GOFUNDI}s`)}
                </CheckBoxItem>
                <div styleName="gofundis_user_block">
                    <div styleName="user_inner" />
                </div>
            </div>
        </div>
    );
}

UserPanel.propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export default CSSModules(UserPanel, styles);
