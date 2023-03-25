import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import CircularChart from 'components/CircularChart';

function CircularChartItem(props) {
    return (
        <CircularChart
            className={props.className ? props.className : 'install_decoder'}
            percentage={props.percentage ? props.percentage : 0}
            strokeWidth={5}
        >
            <div styleName={props.classNameIcon ? props.classNameIcon : 'new-installation-decoder'} />
            <div styleName="small_text">
                {props.name ? props.name.toString().split(' ').join('').toUpperCase() : ''}
            </div>
        </CircularChart>
    );
}

CircularChartItem.propTypes = {
    className: PropTypes.string.isRequired,
    classNameIcon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    percentage: PropTypes.number.isRequired
};
export default CSSModules(CircularChartItem, styles);
