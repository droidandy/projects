import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../styles.css';
import {
    merge
} from 'lodash/fp';
import {
    COMPLETED_TASKS_LINE
} from 'models/highchartConfig';
import Highchart from 'react-highcharts/ReactHighcharts';
import Placeholder from 'components/Placeholder';
import LegendRow from 'components/ListItem/LegendRow';

function TasksHistogram(props) {
    return (
        <div>
            {props.data.errors.cata({
                Nothing: () => props.data.results.cata({
                    Nothing: () => (
                        <Placeholder busy={props.data.busy} size={[ '100%', '180px' ]} />
                    ),
                    Just: fields => (
                        <div>
                            <div styleName='wrapper-legend'>
                                {
                                    fields.series.map((field, index) => (
                                        <LegendRow
                                            key={index}
                                            color={COMPLETED_TASKS_LINE.colors[index]}
                                            title={field.name}
                                        />
                                    ))
                                }
                            </div>
                            <Highchart config={merge(fields, COMPLETED_TASKS_LINE)} />
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
    data: PropTypes.object.isRequired
};

export default CSSModules(TasksHistogram, styles);
