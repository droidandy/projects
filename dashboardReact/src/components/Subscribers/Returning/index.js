import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../styles.css';
import ListRow from 'components/ListItem/ListRow';
import Placeholder from 'components/Placeholder';

function SubscribersReturning(props) {
    return (
        <div styleName="returning_subscribers">
            <div style={{margin: 10, minWidth: 235}}>
                {props.data.errors.cata({
                    Nothing: () => props.data.results.cata({
                        Nothing: () => (
                            <Placeholder
                                style={{ width: 234, height: 100}}
                                busy={props.data.busy}
                                size={[ '100%', '100%' ]} />
                        ),
                        Just: fields => (
                            <div styleName="list_column">
                                <ListRow
                                    leftItem={fields.returningSubscribers ? fields.returningSubscribers : '0'}
                                    item={'NUMBER OF RETURNING SUBSCRIBERS'}
                                />
                                <ListRow
                                    leftItem={fields.followUpTasks ? fields.followUpTasks : '0'}
                                    item={'NUMBER OF FOLLOW UP TASKS'}
                                    subItem={'(SAME SUBSCRIBER SAME CATEGORY)'}
                                />
                                <ListRow
                                    leftItem={fields.recurringTasks ? fields.recurringTasks : '0'}
                                    item={'NUMBER OF RECURRING TASKS'}
                                    subItem={'(SAME SUBSCRIBER DIFFERENT CATEGORY)'}
                                />
                            </div>
                        )
                    }),
                    Just: errors => (
                        <div>{errors}</div>
                    )
                })}

            </div>
            <div style={{margin: 10, minWidth: 200}}>
                {props.data.errors.cata({
                    Nothing: () => props.data.results.cata({
                        Nothing: () => (
                            <Placeholder
                                style={{ width: 200, height: 64}}
                                busy={props.data.busy}
                                size={[ '100%', '100%' ]} />
                        ),
                        Just: fields => (
                            <div styleName="list_column">
                                <div styleName="list_row_reverse">
                                    <div styleName="list_item_number_default">
                                        {fields.completedTasks_2 ? fields.completedTasks_2 : '0'}
                                    </div>
                                    <div styleName="list_column_item_line">
                                        <strong styleName="strong_number">2</strong>
                                        &nbsp;TASKS
                                    </div>
                                </div>
                                <div styleName="list_row_reverse">
                                    <div styleName="list_item_number_default">
                                        {fields.completedTasks_3 ? fields.completedTasks_3 : '0'}
                                    </div>
                                    <div styleName="list_column_item_line">
                                        <strong styleName="strong_number">3</strong>
                                        &nbsp;TASKS COMPLETED
                                    </div>
                                </div>
                            </div>
                        )
                    }),
                    Just: errors => (
                        <div>{errors}</div>
                    )
                })}
            </div>
            <div style={{margin: 10, minWidth: 200}}>
                {props.data.errors.cata({
                    Nothing: () => props.data.results.cata({
                        Nothing: () => (
                            <Placeholder
                                style={{ width: 175, height: 64}}
                                busy={props.data.busy}
                                size={[ '100%', '100%' ]} />
                        ),
                        Just: fields => (
                            <div styleName="list_column">
                                <div styleName="list_row_reverse">
                                    <div styleName="list_item_number_default">
                                        {fields.completedTasks_4 ? fields.completedTasks_4 : '0'}
                                    </div>
                                    <div styleName="list_column_item_line">
                                        <strong styleName="strong_number">4</strong>
                                        &nbsp;TASKS COMPLETED
                                    </div>
                                </div>
                                <div styleName="list_row_reverse">
                                    <div styleName="list_item_number_default">
                                        {fields.completedTasks_more5 ? fields.completedTasks_more5 : '0'}
                                    </div>
                                    <div styleName="list_column_item_line">
                                        <small>+</small>
                                        <strong styleName="strong_number">5</strong>
                                        &nbsp;TASKS COMPLETED
                                    </div>
                                </div>
                            </div>
                        )
                    }),
                    Just: errors => (
                        <div>{errors}</div>
                    )
                })}
            </div>
        </div>
    );
}

SubscribersReturning.propTypes = {
    data: PropTypes.object.isRequired
};

export default CSSModules(SubscribersReturning, styles);
