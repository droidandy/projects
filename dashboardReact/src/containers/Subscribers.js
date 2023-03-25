import React, { Component, PropTypes } from 'react';
import {
    withRouter
} from 'react-router';
import {
    routerShape,
    locationShape
} from 'react-router/lib/PropTypes';
import {
    connect
} from 'react-redux';
import {
    compose,
    isArray,
    map,
    reduce,
    union
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';
import {
    showGoogleMapUser,
    showGoogleMapTasks,
    showGoogleMapCategory,
    setGoogleMapCategory
} from 'actions/ui/googleMap';
import {
    setRangeDate
} from 'actions/ui/dateRangePicker';
import {
    receivePage as receivePageSubscribersRatingBreakdown
} from 'actions/queryData/subscribersRatingBreakdown';
import {
    receivePage as receivePageSubscribersReturning
} from 'actions/queryData/subscribersReturning';
import {
    receivePage as receivePageSubscribersSharePerArea
} from 'actions/queryData/subscribersSharePerArea';
import {
    receivePage as receivePageTaskLocationByCategory
} from 'actions/queryData/taskLocationByCategory';
import Subscribers from 'components/Subscribers';
import {
    pChildren,
    pName,
    valueType
} from 'utils';

class SubscribersContainer extends Component {
    shouldComponentUpdate(nextProps) {
        return (!(this.props.hamburger !== nextProps.hamburger));
    }
    render() {
        return (
            <Subscribers
                commonCategories={this.props.commonCategories}
                getDashboardSettings={this.props.getDashboardSettings}
                subscribersSharePerArea={this.props.subscribersSharePerArea}
                subscribersRatingBreakdown={this.props.subscribersRatingBreakdown}
                subscribersReturning={this.props.subscribersReturning}
                subscribers={this.props.subscribers}
                listCategories={this.props.listCategories}
                dateRangePicker={this.props.dateRangePicker}
                onRangeDate={compose(
                    this.props.receivePageSubscribersRatingBreakdown,
                    this.props.receivePageSubscribersReturning,
                    this.props.receivePageSubscribersSharePerArea,
                    this.props.setRangeDate)}
                categories={this.props.categories}
                onChangeCategoryHandler={compose(
                    this.props.receivePageTaskLocationByCategory,
                    this.props.showGoogleMapCategory)}
                onChangeCategory={compose(
                    this.props.receivePageTaskLocationByCategory,
                    this.props.setGoogleMapCategory)}
            />
        );
    }
}

SubscribersContainer.propTypes = {
    router: routerShape.isRequired,
    location: locationShape.isRequired,

    dateRangePicker: PropTypes.object.isRequired,
    commonCategories: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    tasks: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
    listCategories: PropTypes.object.isRequired,
    subscribers: PropTypes.object.isRequired,
    subscribersReturning: PropTypes.object.isRequired,
    subscribersRatingBreakdown: PropTypes.object.isRequired,
    subscribersSharePerArea: PropTypes.object.isRequired,
    getDashboardSettings: PropTypes.object.isRequired,
    hamburger: PropTypes.object.isRequired,

    showGoogleMapUser: PropTypes.func.isRequired,
    showGoogleMapTasks: PropTypes.func.isRequired,
    showGoogleMapCategory: PropTypes.func.isRequired,
    setGoogleMapCategory: PropTypes.func.isRequired,
    setRangeDate: PropTypes.func.isRequired,
    receivePageSubscribersRatingBreakdown: PropTypes.func.isRequired,
    receivePageSubscribersReturning: PropTypes.func.isRequired,
    receivePageSubscribersSharePerArea: PropTypes.func.isRequired,
    receivePageTaskLocationByCategory: PropTypes.func.isRequired
};

function select({ ui, queryData }) {

    return {
        hamburger: ui.hamburger,
        commonCategories: queryData.getCategoryStatistics,
        getDashboardSettings: queryData.getDashboardSettings,
        subscribersSharePerArea: queryData.subscribersSharePerArea,
        subscribersRatingBreakdown: queryData.subscribersRatingBreakdown,
        subscribersReturning: queryData.subscribersReturning,
        subscribers: queryData.subscribers,
        listCategories: queryData.getCategoryStatistics.results.cata({
            Nothing: () => Nothing(),
            Just: fields => (Just(
                (fields.categoryGroups && isArray(fields.categoryGroups)) ?
                    reduce(
                        (result, subarray) => (
                            union(result, subarray)
                        ), [],
                        map(field => (
                            isArray(pChildren(field)) ? map(subCat => ({
                                style: valueType(field, subCat),
                                name: `${pName(field)} ${pName(subCat)}`
                            }), pChildren(field)) : Nothing()
                        ), fields.categoryGroups)) : Nothing()
            ))
        }),
        dateRangePicker: ui.dateRangePicker,
        users: ui.googlemap.users,
        tasks: ui.googlemap.tasks,
        categories: ui.googlemap.categories
    };
}

const bindActions = {
    showGoogleMapUser,
    showGoogleMapTasks,
    showGoogleMapCategory,
    setGoogleMapCategory,
    setRangeDate,
    receivePageTaskLocationByCategory,
    receivePageSubscribersRatingBreakdown,
    receivePageSubscribersReturning,
    receivePageSubscribersSharePerArea
};

export default compose(
    connect(select, bindActions),
    withRouter
)(SubscribersContainer);
