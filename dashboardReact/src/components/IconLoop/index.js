import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import FIcon from 'react-fontawesome';
import {
    times
} from 'lodash/fp';

const IconLoop = props => (
    <div styleName="list_item_star" style={props.style ? props.style : null}>
        {
            times(i => (
                props.children ? props.children :
                <FIcon
                    key={i}
                    name={props.name ? props.name : 'star'}
                />
            ), props.number ? props.number : 1)
        }
    </div>
);

IconLoop.propTypes = {
    children: PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.array,
        React.PropTypes.object
    ]),
    name: PropTypes.string,
    number: PropTypes.number,
    style: React.PropTypes.object
};

export default CSSModules(IconLoop, styles);
