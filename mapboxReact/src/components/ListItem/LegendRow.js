import React, { PropTypes } from 'react';
import {
    assign
} from 'lodash/fp';
import CSSModules from 'react-css-modules';
import styles from './styles.css';


const LegendRow = props => (
    <div styleName="legend_item" style={props.style ? props.style : null}>
        <div styleName="legend_dot"
             style={props.styleDot ?
                 assign(props.styleDot,
                     props.color ? {backgroundColor: props.color} : {}) :
                 assign({}, props.color ? {backgroundColor: props.color} : {})} />
        {
            props.title ?
                <div
                    styleName="legend_title"
                    style={props.styleTitle ? props.styleTitle : null}>
                    {props.title}
                </div> : null
        }

    </div>
);

LegendRow.propTypes = {
    style: React.PropTypes.object,
    styleDot: React.PropTypes.object,
    color: React.PropTypes.string,
    styleTitle: React.PropTypes.object,
    title: PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.string,
        React.PropTypes.number
    ])

};

export default CSSModules(LegendRow, styles);
