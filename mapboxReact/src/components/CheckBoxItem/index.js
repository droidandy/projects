import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import {
    Checkbox
} from 'react-bootstrap';
import {
    compose,
    property
} from 'lodash/fp';

import styles from './styles.css';

const pTarget = property('target');
const pTargetChecked = compose(
    property('checked'),
    pTarget
);

function CheckBoxItem(props) {
    return (
        <div style={{ }}>
            <Checkbox
                checked={props.value}
                inline={false}
                onChange={compose(
                    props.onChange,
                    pTargetChecked
                )}
            >
                {props.children}
            </Checkbox>
        </div>
    );
}

CheckBoxItem.propTypes = {
    children: PropTypes.string,

    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};

export default CSSModules(CheckBoxItem, styles);
