import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../styles.css';
import {
    has
} from 'lodash/fp';
import Placeholder from 'components/Placeholder';
import ReportRow from 'components/ListItem/ReportRow';

function OverviewTaskStatistics(props) {
    return (
        <div styleName='container-payment'>
            <div styleName="list_column" style={{margin: 10}}>
                {props.data.errors.cata({
                    Nothing: () => props.data.results.cata({
                        Nothing: () => (
                            <Placeholder
                                style={{width: 220, height: 190}}
                                busy={props.data.busy}
                                size={[ '220px', '190px' ]} />
                        ),
                        Just: fields => (
                            <div>
                                <ReportRow
                                    styleChildren={{
                                        backgroundColor: (fields.completedTasksPerDay &&
                                            has('iconBackground', fields.completedTasksPerDay)) ?
                                            fields.completedTasksPerDay.iconBackground : '#07944a'
                                    }}
                                    styleUpItem={{
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        color: (fields.completedTasksPerDay &&
                                            has('color', fields.completedTasksPerDay)) ?
                                            fields.completedTasksPerDay.color : '#07944a'
                                    }}
                                    styleReportBlock={{width: 185}}
                                    upItem={
                                        fields.completedTasksPerDay &&
                                        has('value', fields.completedTasksPerDay) ?
                                            fields.completedTasksPerDay.value : '0'}
                                    item={
                                        fields.completedTasksPerDay &&
                                        has('title', fields.completedTasksPerDay) ?
                                            fields.completedTasksPerDay.title.toUpperCase() : ''}
                                    subItem={
                                        fields.completedTasksPerDay &&
                                        has('subtitle', fields.completedTasksPerDay) ?
                                            fields.completedTasksPerDay.subtitle.toUpperCase() : ''}
                                >
                                    <div styleName="check" />
                                </ReportRow>
                                <ReportRow
                                    styleChildren={{
                                        backgroundColor: (fields.increasePercentage &&
                                            has('iconBackground', fields.increasePercentage)) ?
                                            fields.increasePercentage.iconBackground : '#07944a'
                                    }}
                                    styleUpItem={{
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        color: (fields.increasePercentage &&
                                            has('color', fields.increasePercentage)) ?
                                            fields.increasePercentage.color : '#07944a'
                                    }}
                                    styleReportBlock={{width: 185}}
                                    upItem={
                                        fields.increasePercentage &&
                                        has('value', fields.increasePercentage) ?
                                            fields.increasePercentage.value : '0'}
                                    item={
                                        fields.increasePercentage &&
                                        has('title', fields.increasePercentage) ?
                                            fields.increasePercentage.title.toUpperCase() : ''}
                                    subItem={
                                        fields.increasePercentage &&
                                        has('subtitle', fields.increasePercentage) ?
                                            fields.increasePercentage.subtitle.toUpperCase() : ''}
                                >
                                    <div styleName="line-chart" />
                                </ReportRow>
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

OverviewTaskStatistics.propTypes = {
    data: PropTypes.object.isRequired
};

export default CSSModules(OverviewTaskStatistics, styles);
