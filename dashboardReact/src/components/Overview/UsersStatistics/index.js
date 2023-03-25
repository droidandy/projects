import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from '../styles.css';
import {
    has
} from 'lodash/fp';
import {
    pValue,
    pColor,
    pTitle,
    pSubtitle
} from 'utils';
import Placeholder from 'components/Placeholder';
import ReportRow from 'components/ListItem/ReportRow';
import StarRatingComponent from 'react-star-rating-component';

function OverviewUsersStatistics(props) {
    return (
        <div styleName='container-payment' style={{width: '100%'}}>
            <div style={{margin: 10}}>
                <div styleName='block_caption'>
                    FUNDIS
                </div>

                <div styleName="list_column" style={{marginTop: 10, marginBottom: 10}}>
                    {props.data.errors.cata({
                        Nothing: () => props.data.results.cata({
                            Nothing: () => (
                                <Placeholder
                                    style={{width: '100%', height: 190}}
                                    busy={props.data.busy}
                                    size={[ '100%', '100%' ]} />
                            ),
                            Just: fields => (
                                <div styleName='container_wrapper'>
                                    <div styleName='wrapper-reportRow'>
                                        <ReportRow
                                            styleChildren={{
                                                backgroundColor: '#FBAA1A'
                                            }}
                                            styleUpItem={{
                                                color: (fields.activeGoFundis &&
                                                    has('color', fields.activeGoFundis)) ?
                                                    pColor(fields.activeGoFundis) : '#FBAA1A',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden'}}
                                            styleReportBlock={{width: 200}}
                                            upItem={
                                                fields.activeGoFundis &&
                                                has('value', fields.activeGoFundis) ?
                                                    pValue(fields.activeGoFundis) : '0'}
                                            item={
                                                fields.activeGoFundis &&
                                                has('title', fields.activeGoFundis) ?
                                                    pTitle(fields.activeGoFundis).toUpperCase() : ''}
                                            subItem={
                                                fields.activeGoFundis &&
                                                has('subtitle', fields.activeGoFundis) ?
                                                    pSubtitle(fields.activeGoFundis).toUpperCase() :
                                                    '\u00a0'.toUpperCase()}
                                        >
                                            <div styleName="user" />
                                        </ReportRow>
                                        <ReportRow
                                            styleUpItem={{
                                                color: (fields.averageTravelDistance &&
                                                    has('color', fields.averageTravelDistance)) ?
                                                    pColor(fields.averageTravelDistance) : '#FBAA1A',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden'}}
                                            styleReportBlock={{width: 200}}
                                            upItem={
                                                fields.averageTravelDistance &&
                                                has('value', fields.averageTravelDistance) ?
                                                    pValue(fields.averageTravelDistance) : '0'}
                                            item={
                                                fields.averageTravelDistance &&
                                                has('title', fields.averageTravelDistance) ?
                                                    pTitle(fields.averageTravelDistance).toUpperCase() : ''}
                                            subItem={
                                                fields.averageTravelDistance &&
                                                has('subtitle', fields.averageTravelDistance) ?
                                                    pSubtitle(fields.averageTravelDistance).toUpperCase() :
                                                    '\u00a0'.toUpperCase()}
                                        />
                                        <ReportRow
                                            styleUpItem={{
                                                color: (fields.averageRating &&
                                                    has('color', fields.averageRating)) ?
                                                    pColor(fields.averageRating) : '#FBAA1A',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden',
                                                height: '30px'}}
                                            styleReportBlock={{width: 200}}
                                            upItem={
                                                fields.averageRating &&
                                                has('value', fields.averageRating) ?
                                                    (
                                                        <StarRatingComponent
                                                            starCount={5}
                                                            value={
                                                                pValue(fields.averageRating) ?
                                                                    parseFloat(
                                                                        parseFloat(
                                                                            pValue(fields.averageRating)).toFixed(1)) :
                                                                        0}
                                                            name="rate2"
                                                            editing={false}
                                                            starColor={'#f47423'}
                                                            emptyStarColor={'#ccc'}
                                                            renderStarIcon={(index, value) => (
                                                                <span
                                                                    style={{
                                                                        fontSize: '18px',
                                                                        fontWeight: 300}}
                                                                    className={
                                                                        index <= value ? 'fa fa-star' : 'fa fa-star-o'
                                                                    } />
                                                            )}
                                                            renderStarIconHalf={() => (
                                                                <span
                                                                    style={{
                                                                        fontSize: '18px',
                                                                        fontWeight: 300,
                                                                        color: '#f47423'}}
                                                                    className="fa fa-star-half-full" />)}
                                                        />


                                                    ) : '0'}

                                            item={
                                                fields.averageRating &&
                                                has('title', fields.averageRating) ?
                                                    pTitle(fields.averageRating).toUpperCase() : ''}
                                            subItem={
                                                fields.averageTravelDistance &&
                                                has('subtitle', fields.averageTravelDistance) ?
                                                    pSubtitle(fields.averageTravelDistance).toUpperCase() :
                                                    '\u00a0'.toUpperCase()}
                                        />
                                    </div>
                                    <div styleName='wrapper-reportRow'>
                                        <ReportRow
                                            styleUpItem={{
                                                color: (fields.averageResponseTime &&
                                                    has('color', fields.averageResponseTime)) ?
                                                    pColor(fields.averageResponseTime) : '#FBAA1A',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden'}}
                                            styleReportBlock={{width: 200}}
                                            upItem={
                                                fields.averageResponseTime &&
                                                has('value', fields.averageResponseTime) ?
                                                    pValue(fields.averageResponseTime) : '0'}
                                            item={
                                                fields.averageResponseTime &&
                                                has('title', fields.averageResponseTime) ?
                                                    pTitle(fields.averageResponseTime).toUpperCase() : ''}
                                            subItem={
                                                fields.averageResponseTime &&
                                                has('subtitle', fields.averageResponseTime) ?
                                                    pSubtitle(fields.averageResponseTime).toUpperCase() :
                                                    '\u00a0'.toUpperCase()}
                                        />
                                        <ReportRow
                                            styleUpItem={{
                                                color: (fields.averageExecutionTime &&
                                                    has('color', fields.averageExecutionTime)) ?
                                                    pColor(fields.averageExecutionTime) : '#FBAA1A',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden'}}
                                            styleReportBlock={{width: 200}}
                                            upItem={
                                                fields.averageExecutionTime &&
                                                has('value', fields.averageExecutionTime) ?
                                                    pValue(fields.averageExecutionTime) : '0'}
                                            item={
                                                fields.averageExecutionTime &&
                                                has('title', fields.averageExecutionTime) ?
                                                    pTitle(fields.averageExecutionTime).toUpperCase() : ''}
                                            subItem={
                                                fields.averageExecutionTime &&
                                                has('subtitle', fields.averageExecutionTime) ?
                                                    pSubtitle(fields.averageExecutionTime).toUpperCase() :
                                                    '\u00a0'.toUpperCase()}
                                        />
                                        <ReportRow
                                            styleUpItem={{
                                                color: (fields.averageCompletionTime &&
                                                    has('color', fields.averageCompletionTime)) ?
                                                    pColor(fields.averageCompletionTime) : '#FBAA1A',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden'}}
                                            styleReportBlock={{width: 200}}
                                            upItem={
                                                fields.averageCompletionTime &&
                                                has('value', fields.averageCompletionTime) ?
                                                    pValue(fields.averageCompletionTime) : '0'}

                                            item={
                                                fields.averageCompletionTime &&
                                                has('title', fields.averageCompletionTime) ?
                                                    pTitle(fields.averageCompletionTime).toUpperCase() : ''}
                                            subItem={
                                                fields.averageCompletionTime &&
                                                has('subtitle', fields.averageCompletionTime) ?
                                                    pSubtitle(fields.averageCompletionTime).toUpperCase() :
                                                    '\u00a0'.toUpperCase()}
                                        />
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
            <div style={{
                margin: 10
            }}>
                <div styleName='block_caption'>
                    SUBSCRIBERS
                </div>

                <div styleName="list_column" style={{marginTop: 10, marginBottom: 10}}>
                    {props.data.errors.cata({
                        Nothing: () => props.data.results.cata({
                            Nothing: () => (
                                <Placeholder
                                    style={{width: '100%', height: 190}}
                                    busy={props.data.busy}
                                    size={[ '100%', '100%' ]} />
                            ),
                            Just: fields => (
                                <div styleName='container_wrapper'>
                                    <div styleName='wrapper-reportRow'>
                                        <ReportRow
                                            styleChildren={{
                                                backgroundColor: '#C6D92D'
                                            }}
                                            styleUpItem={{
                                                color: (fields.averageNumberOfReportedIssues &&
                                                    has('color', fields.averageNumberOfReportedIssues)) ?
                                                    pColor(fields.averageNumberOfReportedIssues) : '#FBAA1A',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden'}}
                                            styleReportBlock={{width: 200}}
                                            upItem={
                                                fields.averageNumberOfReportedIssues &&
                                                has('value', fields.averageNumberOfReportedIssues) ?
                                                    pValue(fields.averageNumberOfReportedIssues) : '0'}
                                            item={
                                                fields.averageNumberOfReportedIssues &&
                                                has('title', fields.averageNumberOfReportedIssues) ?
                                                    pTitle(fields.averageNumberOfReportedIssues).toUpperCase() : ''}
                                            subItem={
                                                fields.averageNumberOfReportedIssues &&
                                                has('subtitle', fields.averageNumberOfReportedIssues) ?
                                                    pSubtitle(fields.averageNumberOfReportedIssues).toUpperCase() :
                                                    '\u00a0'.toUpperCase()}
                                        >
                                            <div styleName="user" />
                                        </ReportRow>
                                        <ReportRow
                                            styleUpItem={{
                                                color: (fields.percentageOfFollowUpTasks &&
                                                    has('color', fields.percentageOfFollowUpTasks)) ?
                                                    pColor(fields.percentageOfFollowUpTasks) : '#FBAA1A',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden'}}
                                            styleReportBlock={{width: 200}}
                                            upItem={
                                                fields.percentageOfFollowUpTasks &&
                                                has('value', fields.percentageOfFollowUpTasks) ?
                                                    pValue(fields.percentageOfFollowUpTasks) : '0'}
                                            item={
                                                fields.percentageOfFollowUpTasks &&
                                                has('title', fields.percentageOfFollowUpTasks) ?
                                                    pTitle(fields.percentageOfFollowUpTasks).toUpperCase() : ''}
                                            subItem={
                                                fields.percentageOfFollowUpTasks &&
                                                has('subtitle', fields.percentageOfFollowUpTasks) ?
                                                    pSubtitle(fields.percentageOfFollowUpTasks).toUpperCase() :
                                                    '\u00a0'.toUpperCase()}
                                        />
                                        <ReportRow
                                            styleUpItem={{
                                                color: (fields.percentageOfRecurringTasks &&
                                                    has('color', fields.percentageOfRecurringTasks)) ?
                                                    pColor(fields.percentageOfRecurringTasks) : '#FBAA1A',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden'}}
                                            styleReportBlock={{width: 200}}
                                            upItem={
                                                fields.percentageOfRecurringTasks &&
                                                has('value', fields.percentageOfRecurringTasks) ?
                                                    pValue(fields.percentageOfRecurringTasks) : '0'}

                                            item={
                                                fields.percentageOfRecurringTasks &&
                                                has('title', fields.percentageOfRecurringTasks) ?
                                                    pTitle(fields.percentageOfRecurringTasks).toUpperCase() : ''}
                                            subItem={
                                                fields.percentageOfRecurringTasks &&
                                                has('subtitle', fields.percentageOfRecurringTasks) ?
                                                    pSubtitle(fields.percentageOfRecurringTasks).toUpperCase() :
                                                    '\u00a0'.toUpperCase()}
                                        />
                                    </div>
                                    <div styleName='wrapper-reportRow'>
                                        <ReportRow
                                            styleUpItem={{
                                                color: (fields.preferredTimeForService &&
                                                    has('color', fields.preferredTimeForService)) ?
                                                    pColor(fields.preferredTimeForService) : '#FBAA1A',
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden'}}
                                            styleReportBlock={{width: 200}}
                                            upItem={
                                                fields.preferredTimeForService &&
                                                has('value', fields.preferredTimeForService) ?
                                                    pValue(fields.preferredTimeForService) : '0'}
                                            item={
                                                fields.preferredTimeForService &&
                                                has('title', fields.preferredTimeForService) ?
                                                    pTitle(fields.preferredTimeForService).toUpperCase() : ''}
                                            subItem={
                                                fields.preferredTimeForService &&
                                                has('subtitle', fields.preferredTimeForService) ?
                                                    pSubtitle(fields.preferredTimeForService).toUpperCase() :
                                                    '\u00a0'.toUpperCase()}
                                        />
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

        </div>
    );
}

OverviewUsersStatistics.propTypes = {
    data: PropTypes.object.isRequired
};

export default CSSModules(OverviewUsersStatistics, styles);
