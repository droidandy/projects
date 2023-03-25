import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../styles.css';
import {
    has
} from 'lodash/fp';
import Placeholder from 'components/Placeholder';
import ReportRow from 'components/ListItem/ReportRow';

function OverviewPaymentStatistics(props) {
    return (
        <div styleName='container-payment'>
            <div styleName="list_column" style={{margin: 10}}>
                {props.data.errors.cata({
                    Nothing: () => props.data.results.cata({
                        Nothing: () => (
                            <Placeholder
                                style={{width: 235, height: 190}}
                                busy={props.data.busy}
                                size={[ '220px', '190px' ]} />
                        ),
                        Just: fields => (
                            <div>
                                <ReportRow
                                    styleChildren={{
                                        backgroundColor: (fields.totalTaskValue &&
                                            has('iconBackground', fields.totalTaskValue)) ?
                                            fields.totalTaskValue.iconBackground : '#07944a'
                                    }}
                                    styleUpItem={{
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        color: (fields.totalTaskValue &&
                                            has('color', fields.totalTaskValue)) ?
                                            fields.totalTaskValue.color : '#07944a'
                                    }}
                                    styleReportBlock={{width: 200}}
                                    upItem={
                                        fields.totalTaskValue &&
                                        has('value', fields.totalTaskValue) ?
                                            fields.totalTaskValue.value : '0'}
                                    item={
                                        fields.totalTaskValue &&
                                        has('title', fields.totalTaskValue) ?
                                            fields.totalTaskValue.title.toUpperCase() : ''}
                                    // subItem={'(IN AVERAGE PER GOFUNDI)'}
                                >
                                    <div styleName="check" />
                                </ReportRow>
                                <ReportRow
                                    styleChildren={{
                                        backgroundColor: (fields.totalGoFundiEarnings &&
                                            has('iconBackground', fields.totalGoFundiEarnings)) ?
                                            fields.totalGoFundiEarnings.iconBackground : '#07944a'
                                    }}
                                    styleUpItem={{
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        color: (fields.totalGoFundiEarnings &&
                                            has('color', fields.totalGoFundiEarnings)) ?
                                            fields.totalGoFundiEarnings.color : '#07944a'
                                    }}
                                    styleReportBlock={{width: 200}}
                                    upItem={
                                        fields.totalGoFundiEarnings &&
                                        has('value', fields.totalGoFundiEarnings) ?
                                            fields.totalGoFundiEarnings.value : '0'}
                                    item={
                                        fields.totalGoFundiEarnings &&
                                        has('title', fields.totalGoFundiEarnings) ?
                                            fields.totalGoFundiEarnings.title.toUpperCase() : ''}
                                    // subItem={'(TASKS COMPLETED)'}
                                >
                                    <div styleName="money-bag" />
                                </ReportRow>
                            </div>
                        )
                    }),
                    Just: errors => (
                        <div>{errors}</div>
                    )
                })}
            </div>
            <div styleName="list_column" style={{margin: 10}}>
                {props.data.errors.cata({
                    Nothing: () => props.data.results.cata({
                        Nothing: () => (
                            <Placeholder
                                style={{width: 200, height: 190}}
                                busy={props.data.busy}
                                size={[ '220px', '190px' ]} />
                        ),
                        Just: fields => (
                            <div>
                                <ReportRow
                                    styleChildren={{
                                        backgroundColor: (fields.paidOutTasks &&
                                            has('iconBackground', fields.paidOutTasks)) ?
                                            fields.paidOutTasks.iconBackground : '#07944a'
                                    }}
                                    styleUpItem={{
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        color: (fields.paidOutTasks &&
                                            has('color', fields.paidOutTasks)) ?
                                            fields.paidOutTasks.color : '#07944a'
                                    }}
                                    styleReportBlock={{width: 165}}
                                    upItem={
                                        fields.paidOutTasks &&
                                        has('value', fields.paidOutTasks) ?
                                            fields.paidOutTasks.value : '0'}
                                    item={
                                        fields.paidOutTasks &&
                                        has('title', fields.paidOutTasks) ?
                                            fields.paidOutTasks.title.toUpperCase() : ''}
                                    // subItem={'(IN AVERAGE PER GOFUNDI)'}
                                >
                                    <div styleName="logout" />
                                </ReportRow>
                                <ReportRow
                                    styleChildren={{
                                        backgroundColor: (fields.pendingPayments &&
                                            has('iconBackground', fields.pendingPayments)) ?
                                            fields.pendingPayments.iconBackground : '#07944a'
                                    }}
                                    styleUpItem={{
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        color: (fields.pendingPayments &&
                                            has('color', fields.pendingPayments)) ?
                                            fields.pendingPayments.color : '#07944a'
                                    }}
                                    styleReportBlock={{width: 165}}
                                    upItem={
                                        fields.pendingPayments &&
                                        has('value', fields.pendingPayments) ?
                                            fields.pendingPayments.value : '0'}
                                    item={
                                        fields.pendingPayments &&
                                        has('title', fields.pendingPayments) ?
                                            fields.pendingPayments.title.toUpperCase() : ''}
                                    // subItem={'(TASKS COMPLETED)'}
                                >
                                    <div styleName="loading" />
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

OverviewPaymentStatistics.propTypes = {
    data: PropTypes.object.isRequired
};

export default CSSModules(OverviewPaymentStatistics, styles);
