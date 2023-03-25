import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../styles.css';
import Placeholder from 'components/Placeholder';
import ListRowReverse from 'components/ListItem/ListRowReverse';

function TasksHighlightsLeft(props) {
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
                                rightItem={fields.retortedTasks ? fields.retortedTasks : '0'}
                                item={'NUMBER OF TASKS REPORTED'}
                                subItem={'(FOR SELECTED PERIOD)'}
                            />
                            <ListRowReverse
                                rightItem={fields.assignedTasks ? fields.assignedTasks : '0'}
                                item={'ASSIGNED TASKS'}
                                subItem={'(ASSIGNED TO GOFUNDI BUT PENDING COMPLETION)'}
                            />
                            <ListRowReverse
                                rightItem={fields.declines ? fields.declines : '0'}
                                item={'NUMBER OF DECLINES'}
                                subItem={'(FOR SELECTED PERIOD)'}
                            />
                            <ListRowReverse
                                styleRightItem={{color: '#ed1967'}}
                                rightItem={fields.avgTimeAssinment ? fields.avgTimeAssinment : '0'}
                                item={'AVERAGE TIME FOR ASSINMENT'}
                                subItem={'(FROM REQUESTED ACCEPTED)'}
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

TasksHighlightsLeft.propTypes = {
    data: PropTypes.object.isRequired
};

export default CSSModules(TasksHighlightsLeft, styles);
