import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
// import {
//     Checkbox
// } from 'react-bootstrap';
import Checkbox from 'rc-checkbox';
import {
    compose,
    property
} from 'lodash/fp';

const pTarget = property('target');
const pTargetChecked = compose(
    property('checked'),
    pTarget
);

function CheckBoxItem(props) {
    return (
        <div styleName='checkbox_wrap'>
            <label styleName='label'>
                <Checkbox
                    styleName='checkbox'
                    style={props.style ? props.style : null}
                    checked={props.value}
                    inline={props.inline ? props.inline : false}
                    onChange={compose(
                        props.onChange,
                        pTargetChecked
                    )}
                />
                {props.children}
            </label>
        </div>
    );
}

CheckBoxItem.propTypes = {
    children: PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.array,
        React.PropTypes.string,
        React.PropTypes.object
    ]),

    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    inline: PropTypes.bool,
    style: PropTypes.object
};

export default CSSModules(CheckBoxItem, styles);
