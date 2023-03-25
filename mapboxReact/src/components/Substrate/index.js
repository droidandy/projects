import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';


const Substrate = props => (
    <div styleName='substrate_container'>
        {
            props.title ? <div styleName='substrate_container_title'>{props.title}</div> : null
        }
        {
            props.children ? props.children : null
        }
    </div>
);

Substrate.propTypes = {
    children: PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.array,
        React.PropTypes.object
    ]),
    title: PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.string,
        React.PropTypes.number
    ])
};

export default CSSModules(Substrate, styles);
