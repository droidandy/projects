import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../styles.css';
import Placeholder from 'components/Placeholder';
import ListRowReverse from 'components/ListItem/ListRowReverse';

function TasksHighlightsRight(props) {
    return (
        <div>
            {props.data.errors.cata({
                Nothing: () => props.data.results.cata({
                    Nothing: () => (
                        <Placeholder
                            style={{ margin: 10, width: 238, height: 200}}
                            busy={props.data.busy}
                            size={[ '100%', '100%' ]} />
                    ),
                    Just: fields => (
                        <div styleName="list_column" style={{margin: 10, minWidth: 239}}>
                            <ListRowReverse
                                rightItem={fields.unassignedTasks ? fields.unassignedTasks : '0'}
                                item={'UNASSIGNED TASKS'}
                                subItem={'(TASK NOT YET ACCEPTED BY GOFUNDI)'}
                            />
                            <ListRowReverse
                                rightItem={fields.completedTasks ? fields.completedTasks : '0'}
                                item={'INCREASE SINCE LAST MONTH'}
                                subItem={'(TASKS COMPLETED)'}
                            />
                            <ListRowReverse
                                rightItem={fields.cancellations ? fields.cancellations : '0'}
                                item={'NUMBER OF CANCELLATIONS'}
                                subItem={'(FOR SELECTED PERIOD)'}
                            />
                            <ListRowReverse
                                styleRightItem={{color: '#ed1967'}}
                                rightItem={fields.avgTimeCompletion ? fields.avgTimeCompletion : '0'}
                                item={'AVERAGE TIME FOR COMPLETION'}
                                subItem={'(FROM REQUESTED TO COMPLETED)'}
                            />
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

TasksHighlightsRight.propTypes = {
    data: PropTypes.object.isRequired
};

export default CSSModules(TasksHighlightsRight, styles);
