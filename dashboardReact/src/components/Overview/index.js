import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import {
    REVENUE_LINE,
    COMPLETED_TASKS_LINE
} from 'models/highchartConfig';
import CompletedTasksHightChart from 'components/CompletedTasksHightChart';
import OverviewTaskStatistics from 'components/Overview/TaskStatistics';
import OverviewTaskLiveStatistics from 'components/Overview/TaskStatistics/Live';
import OverviewPaymentStatistics from 'components/Overview/PaymentStatistics';
import OverviewUsersStatistics from 'components/Overview/UsersStatistics';
import OverviewCategoryStatistics from 'components/Overview/CategoryStatistics';
import TasksHistogram from 'components/Overview/PaymentStatistics/Histogram';
import TasksStatusMap from 'components/Tasks/StatusMap';
import CategoriesMap from 'components/CategoriesMap';
import UsersMap from 'components/UsersMap';
import Substrate from 'components/Substrate';
import SubPanel from 'components/SubPanel';

function Overview(props) {

    return (
        <div>
            <SubPanel
                title="OVERVIEW"
                listCategories={props.listCategories}
                commonCategories={props.commonCategories}
                onCheckBox={props.onChangeCategory}
                categories={props.categories}
                onChangeCategory={props.onChangeCategoryHandler}
                dateRangePicker={props.dateRangePicker}
                onRangeDate={props.onRangeDate}
            />
            <div styleName='root'>
                <div>
                    <div styleName='category_panel_title'>Task statistics</div>
                    <div styleName="returning_subscribers" style={{flexWrap: 'wrap'}}>
                        <CompletedTasksHightChart data={props.getOverviewStats} />
                        <OverviewTaskStatistics data={props.getOverviewStats}/>
                        <div styleName='block-label'>
                            <div styleName='label-property'>{'COMPLETED TASKS'}</div>
                            <TasksHistogram
                                data={props.completedTasksHistogram}
                                model={COMPLETED_TASKS_LINE}
                            />
                        </div>
                    </div>
                </div>
                <div style={{margin: '15px'}}>
                    <div styleName='wrapper-label'>
                        LIVE STATUS
                        <div styleName='live-dot' />
                    </div>
                    <OverviewTaskLiveStatistics data={props.getLiveStats}/>
                </div>
                <Substrate title={'TASK STATUS'}>
                    <TasksStatusMap
                        mapSettings={props.getDashboardSettings}
                        data={props.tasksLocationStatus}
                        value={props.tasks}
                        onChange={props.onChangeTaskStatusHandler}/>
                </Substrate>

                <div>
                    <div styleName='category_panel_title'>User statistics</div>
                    <div styleName="returning_subscribers" style={{flexWrap: 'wrap', justifyContent: 'space-between'}}>
                        <OverviewUsersStatistics data={props.getUserStats}/>
                    </div>
                </div>
                <Substrate title={'USERS'}>
                    <UsersMap
                        mapSettings={props.getDashboardSettings}
                        data={props.userLocation}
                        value={props.users}
                        onChange={props.onUserLocationHandler}/>
                </Substrate>

                <div>
                    <div styleName='category_panel_title'>Category statistics</div>
                    <div styleName="returning_subscribers" style={{flexWrap: 'wrap'}}>
                    </div>
                </div>
                <Substrate>
                    <OverviewCategoryStatistics data={props.commonCategories} />
                </Substrate>
                <Substrate title={'CATEGORIES'}>
                    <CategoriesMap
                        mapSettings={props.getDashboardSettings}
                        commonCategories={props.commonCategories}
                        options={props.listCategories}
                        data={props.tasksLocationByCategory}
                        value={props.categories}
                        onCheckBox={props.onChangeCategory}
                        onChange={props.onChangeCategoryHandler}/>
                </Substrate>

                <div>
                    <div styleName='category_panel_title'>Payment statistics</div>
                    <div styleName="returning_subscribers" style={{flexWrap: 'wrap', justifyContent: 'space-between'}}>
                        <OverviewPaymentStatistics data={props.getPaymentStatistics}/>
                    </div>
                    <Substrate title={'REVENUE'}>
                        <TasksHistogram
                            data={props.getRevenueHistogram}
                            model={REVENUE_LINE}
                        />
                    </Substrate>
                </div>
            </div>
        </div>
    );
}

Overview.propTypes = {
    getDashboardSettings: PropTypes.object.isRequired,
    getPaymentStatistics: PropTypes.object.isRequired,
    getLiveStats: PropTypes.object.isRequired,
    getUserStats: PropTypes.object.isRequired,
    getRevenueHistogram: PropTypes.object.isRequired,
    listCategories: PropTypes.object.isRequired,
    commonCategories: PropTypes.object.isRequired,
    getOverviewStats: PropTypes.object.isRequired,
    dateRangePicker: PropTypes.object.isRequired,
    completedTasksHistogram: PropTypes.object.isRequired,
    userLocation: PropTypes.object.isRequired,
    tasksLocationByCategory: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
    onChangeCategoryHandler: PropTypes.func.isRequired,
    onChangeCategory: PropTypes.func.isRequired,
    tasksLocationStatus: PropTypes.object.isRequired,
    tasks: PropTypes.object.isRequired,
    onChangeTaskStatusHandler: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
    onUserLocationHandler: PropTypes.func.isRequired,
    onRangeDate: PropTypes.func.isRequired

};

export default CSSModules(Overview, styles);
