import React, { Fragment } from "react";
import DateRangePicker from "../../Common/DateRangePicker";

export default function KeyMetrics(props) {
    const { dashboards, currentPeriod, renderDashboardItem, handleChangePeriod } = props;
    return (
        <div className="dashboard container-content__blue-content">
            <div className="dashboard-group">
                <div className="dashboard-group__title">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M11.9513 7.99933L9.81467 3.726L7.93267 9.37267L4.65467 0.849335L1.97333 7.99933H0V9.99933H3.36L4.67867 6.48334L8.06733 15.2927L10.1853 8.93933L10.7153 9.99933H16V7.99933H11.9513Z"
                            fill="#97ADC6"
                        />
                    </svg>
                    <span>Now</span>
                </div>
                <div className="dashboard-group__content">
                    {dashboards?.now && dashboards?.now.groups.map((group, index) => (
                        <Fragment key={index}>
                            <div className="dashboard-group__subtitle">{group.name}</div>
                            <div className="dashboard-row">
                                {group.items.map((item, i) => (
                                    <div className="col dashboard_3_of_12" key={i}>
                                        {renderDashboardItem(item, group.name)}
                                    </div>
                                ))}
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
            <div className="dashboard-group">
                <div className="dashboard-group__title">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM6.75 3.5V8.08579C6.75 8.54992 6.93437 8.99504 7.26256 9.32322L9.46967 11.5303L10.5303 10.4697L8.32322 8.26256C8.27634 8.21568 8.25 8.15209 8.25 8.08579V3.5H6.75Z"
                            fill="#97ADC6"
                        />
                    </svg>
                    <span>For selected range</span>
                </div>
                <div className="dashboard-group__select">
                    <DateRangePicker
                        startTime={currentPeriod.start_time}
                        endTime={currentPeriod.end_time}
                        handleChangePeriod={handleChangePeriod}
                        name={"key_metrics"}
                    />
                </div>
                <div className="dashboard-group__content">
                    {dashboards?.range && dashboards?.range.groups.map((group, index) => (
                        <Fragment key={index}>
                            <div className="dashboard-group__subtitle">{group.name}</div>
                            <div className="dashboard-row">
                                {group.items.map((item, i) => (
                                    <div className="col dashboard_3_of_12" key={i}>
                                        {renderDashboardItem(item, group.name)}
                                    </div>
                                ))}
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}
