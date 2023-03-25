import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import {
    merge,
    reduce,
    map,
    toString
} from 'lodash/fp';
import {
    COMPLETED_TASKS
} from 'models/highchartConfig';
import Highchart from 'react-highcharts/ReactHighcharts';
import LegendRow from 'components/ListItem/LegendRow';
import Placeholder from 'components/Placeholder';

function CompletedTasksHightChart(props) {
    return (
        <div styleName='container'>
            <div styleName='sub_container_header'>COMPLETED TASKS</div>
            {props.data.errors.cata({
                Nothing: () => props.data.results.cata({
                    Nothing: () => (
                        <Placeholder
                            style={{ width: 200, height: 222}}
                            busy={props.data.busy}
                            size={[ '100%', '100%' ]} />
                    ),
                    Just: fields => (
                        <div styleName="list_column_highcharts" style={{margin: 5}}>
                            <Highchart config={merge(
                                COMPLETED_TASKS,
                                {title: {
                                    text: toString(reduce(
                                        (sum, n) => (sum + n), 0,
                                        map(field => (parseFloat(field.completedTasks)),
                                            fields.categoryTasks)))
                                },
                                    series: [{
                                        data: map(field => (
                                            [field.category.name,
                                                parseFloat(field.completedTasks)]
                                        ), fields.categoryTasks)
                                    }]
                                }
                            )} />
                            <div styleName='wrapper-label'>
                                {
                                    fields.categoryTasks.map((field, index) => (
                                        <LegendRow
                                            key={index}
                                            color={COMPLETED_TASKS.colors[index]}
                                            title={field.category.name}
                                        />
                                    ))
                                }
                            </div>
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

CompletedTasksHightChart.propTypes = {
    data: PropTypes.object.isRequired
};

export default CSSModules(CompletedTasksHightChart, styles);
