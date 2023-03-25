import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Substrate from 'components/Substrate';
import SubPanel from 'components/SubPanel';
import GoFundisMap from 'components/GoFundis/Map';
import GoFundisHightChart from 'components/GoFundis/HightChart';
import GoFundisStatuses from 'components/GoFundis/Statuses';
import GoFundisHighlights from 'components/GoFundis/Highlights';
import GoFundisChartsRight from 'components/GoFundis/Charts/ContentRight';
import GoFundisChartsLeft from 'components/GoFundis/Charts/ContentLeft';

function GoFundis(props) {
    return (
        <div>
            <SubPanel
                title="GOFUNDIS"
                listCategories={props.listCategories}
                commonCategories={props.commonCategories}
                onCheckBox={props.onChangeCategory}
                categories={props.categories}
                onChangeCategory={props.onChangeCategoryHandler}
                dateRangePicker={props.dateRangePicker}
                onRangeDate={props.onRangeDate}
            />
            <div styleName='root'>
                <Substrate title={'HIGHLIGHTS'}>
                    <div styleName="returning_subscribers" style={{flexWrap: 'wrap'}}>
                        <GoFundisHightChart data={props.getOverviewStats} />
                        <GoFundisStatuses data={props.goFundisStatuses} />
                        <GoFundisHighlights data={props.goFundisStatuses} />
                    </div>
                </Substrate>
                <div styleName='users_container_empty'>
                    <div styleName="returning_subscribers">
                        <GoFundisChartsLeft data={props.goFundisCharts} />
                        <GoFundisChartsRight data={props.goFundisCharts} />
                    </div>
                </div>
                <Substrate title={'ACTIVE GO FUNDIS'}>
                    <GoFundisMap
                        mapSettings={props.getDashboardSettings}
                        data={props.activeGoFundis}
                        value={props.goFundis}
                        onChangeStatus={props.onChangeStatus}
                    />
                </Substrate>
            </div>
        </div>
    );
}

GoFundis.propTypes = {
    commonCategories: PropTypes.object.isRequired,
    getDashboardSettings: PropTypes.object.isRequired,
    goFundisCharts: PropTypes.object.isRequired,
    goFundisStatuses: PropTypes.object.isRequired,
    listCategories: PropTypes.object.isRequired,
    getOverviewStats: PropTypes.object.isRequired,
    dateRangePicker: PropTypes.object.isRequired,
    onRangeDate: PropTypes.func.isRequired,
    goFundis: PropTypes.object.isRequired,
    activeGoFundis: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,

    onChangeCategoryHandler: PropTypes.func.isRequired,
    onChangeCategory: PropTypes.func.isRequired,
    onChangeStatus: PropTypes.func.isRequired
};

export default CSSModules(GoFundis, styles);
