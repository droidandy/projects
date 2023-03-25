import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import CircularChart from 'components/CircularChart';

function CircularChartItem(props) {
    return (
        <CircularChart
            className={(props.category && props.category.shortStyle) ?
                props.category.shortStyle : null}
            percentage={props.percentage ? props.percentage : 0}
            strokeWidth={5}
            upder={
                <div styleName="reparate_item_col" >
                    <div styleName="small_text_panel">
                        {props.reported ?
                            props.reported.toString().toUpperCase() : ''
                        }
                    </div>
                    <div styleName="small_text_panel">
                        {props.completed ?
                            props.completed.toString().toUpperCase() : ''
                        }
                    </div>
                </div>
            }
        >
            <div styleName={(props.category && props.category.style) ?
                props.category.style : 'new-installation-decoder'
            } />
            <div styleName="small_text">
                {(props.category && props.category.shortName) ?
                    props.category.shortName.toString().toUpperCase() : ''
                }
            </div>
        </CircularChart>
    );
}

CircularChartItem.propTypes = {
    category: PropTypes.object.isRequired,
    percentage: PropTypes.number.isRequired,
    completed: PropTypes.string.isRequired,
    reported: PropTypes.string.isRequired
};
export default CSSModules(CircularChartItem, styles);
