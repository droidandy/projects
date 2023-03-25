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
    receivePage as receivePageCompletedTasksHistogram
} from 'actions/queryData/completedTaskHistogram';
import {
    receivePage as receivePageTaskLocationByStatus
} from 'actions/queryData/taskLocationByStatus';
import {
    receivePage as receivePageTaskLocationByCategory
} from 'actions/queryData/taskLocationByCategory';
import {
    receivePage as receivePageGetOverviewStats
} from 'actions/queryData/getOverviewStats';
import {
    receivePage as receivePageGetCategoryStatistics
} from 'actions/queryData/getCategoryStatistics';
import Tasks from 'components/Tasks';
import {
    pChildren,
    pName,
    valueType
} from 'utils';

class TasksContainer extends Component {
    shouldComponentUpdate(nextProps) {
        return (!(this.props.hamburger !== nextProps.hamburger));
    }
    render() {
        return (
            <Tasks
                commonCategories={this.props.commonCategories}
                getDashboardSettings={this.props.getDashboardSettings}
                tasksCategoryBreakdown={this.props.tasksCategoryBreakdown}
                tasksHighlights={this.props.tasksHighlights}
                listCategories={this.props.listCategories}
                getOverviewStats={this.props.getOverviewStats}
                dateRangePicker={this.props.dateRangePicker}
                onRangeDate={compose(
                    this.props.receivePageGetCategoryStatistics,
                    this.props.receivePageGetOverviewStats,
                    this.props.receivePageTaskLocationByStatus,
                    this.props.receivePageCompletedTasksHistogram,
                    this.props.setRangeDate)}
                completedTasksHistogram={this.props.completedTasksHistogram}
                tasksLocationStatus={this.props.tasksLocationStatus}
                tasks={this.props.tasks}
                onChangeTaskStatusHandler={compose(
                    this.props.receivePageTaskLocationByStatus,
                    this.props.showGoogleMapTasks)}
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

TasksContainer.propTypes = {
    router: routerShape.isRequired,
    location: locationShape.isRequired,

    completedTasksHistogram: PropTypes.object.isRequired,
    tasksLocationStatus: PropTypes.object.isRequired,

    dateRangePicker: PropTypes.object.isRequired,
    getOverviewStats: PropTypes.object.isRequired,
    commonCategories: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    tasks: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
    listCategories: PropTypes.object.isRequired,
    tasksHighlights: PropTypes.object.isRequired,
    tasksCategoryBreakdown: PropTypes.object.isRequired,
    getDashboardSettings: PropTypes.object.isRequired,
    hamburger: PropTypes.object.isRequired,

    showGoogleMapUser: PropTypes.func.isRequired,
    showGoogleMapTasks: PropTypes.func.isRequired,
    showGoogleMapCategory: PropTypes.func.isRequired,
    setGoogleMapCategory: PropTypes.func.isRequired,
    setRangeDate: PropTypes.func.isRequired,
    receivePageCompletedTasksHistogram: PropTypes.func.isRequired,
    receivePageTaskLocationByStatus: PropTypes.func.isRequired,
    receivePageTaskLocationByCategory: PropTypes.func.isRequired,
    receivePageGetOverviewStats: PropTypes.func.isRequired,
    receivePageGetCategoryStatistics: PropTypes.func.isRequired
};

function select({ ui, queryData }) {

    return {
        hamburger: ui.hamburger,
        commonCategories: queryData.getCategoryStatistics,
        getDashboardSettings: queryData.getDashboardSettings,
        tasksCategoryBreakdown: queryData.taskCategoryBreakdown,
        tasksHighlights: queryData.getTasksHighlights,
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
        getOverviewStats: queryData.getOverviewStats,
        dateRangePicker: ui.dateRangePicker,
        completedTasksHistogram: queryData.completedTasksHistogram,
        users: ui.googlemap.users,
        tasksLocationStatus: queryData.taskLocationByStatus,
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
    receivePageCompletedTasksHistogram,
    receivePageTaskLocationByStatus,
    receivePageTaskLocationByCategory,
    receivePageGetOverviewStats,
    receivePageGetCategoryStatistics
};

export default compose(
    connect(select, bindActions),
    withRouter
)(TasksContainer);
