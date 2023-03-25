import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../styles.css';
import {
    merge
} from 'lodash/fp';
import Highchart from 'react-highcharts/ReactHighcharts';
import Placeholder from 'components/Placeholder';
import LegendRow from 'components/ListItem/LegendRow';

function TasksHistogram(props) {
    return (
        <div>
            {props.data.errors.cata({
                Nothing: () => props.data.results.cata({
                    Nothing: () => (
                        <Placeholder
                            busy={props.data.busy}
                            size={[ '100%', (props.model.chart && props.model.chart.height) ?
                                `${props.model.chart.height.toString()}px` : '240px' ]}
                        />
                    ),
                    Just: fields => (
                        <div>
                            <div styleName='wrapper-legend'>
                                {
                                    fields.series.map((field, index) => (
                                        <LegendRow
                                            key={index}
                                            color={props.model.colors[index]}
                                            title={field.name}
                                        />
                                    ))
                                }
                            </div>
                            <Highchart config={merge(fields, props.model)} />
                        </div>
                    )
                }),
                Just: errors => (
                    <div>{errors}</div>
                )
            })}
        </div>
    );
}

TasksHistogram.propTypes = {
    data: PropTypes.object.isRequired,
    model: PropTypes.object.isRequired
};

export default CSSModules(TasksHistogram, styles);
