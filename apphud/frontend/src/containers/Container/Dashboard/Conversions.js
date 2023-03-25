import React from "react";
import DateRangePicker from "../../Common/DateRangePicker";
import styles from "./index.module.scss";
import Tip from "../../Common/Tip";
import ConversionsInfo from "./ConversionsInfo";

function DashboardItem(props) {
    const { title, tipTitle = false,value, description, buttonUrl, subValue = false, loading = false } = props;
    return <div className={styles.dashboardItem}>
        <div className={styles.title}>
            <span>{title}</span>
            { tipTitle &&
                <Tip
                    title={tipTitle}
                    description={description}
                    buttonUrl={buttonUrl}
                />
            }
        </div>
        <div className={styles.value}>
            { loading
                ? <div
                    className="animated-background timeline-item"
                    style={{ height: 32, marginTop: 3 }}
                />
                : value
            }
        </div>
        {subValue && (
          <>
            {loading ? (
              <div
                className="animated-background timeline-item"
                style={{ height: 21, marginTop: 3 }}
              />
            ) : (
              <div className={styles.footer}>
                {subValue}
              </div>
            )}
          </>
        )}
    </div>
}

export default function Conversions(props) {
    const { currentPeriod, handleChangePeriod, data, loading } = props;
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
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM6.75 3.5V8.08579C6.75 8.54992 6.93437 8.99504 7.26256 9.32322L9.46967 11.5303L10.5303 10.4697L8.32322 8.26256C8.27634 8.21568 8.25 8.15209 8.25 8.08579V3.5H6.75Z"
                            fill="#97ADC6"
                        />
                    </svg>
                    <span>Count users created in</span>
                </div>
                <div className="dashboard-group__select">
                    <DateRangePicker
                        startTime={currentPeriod.start_time}
                        endTime={currentPeriod.end_time}
                        handleChangePeriod={handleChangePeriod}
                        name={"key_conversions"}
                    />
                </div>
                { data.map((item, key) => (
                    <div className={styles.dashboardRow} key={key}>
                        <div className={styles.label}>{item.name}</div>
                        <div className={styles.item}>
                            <div className={`${styles.card}`}>
                                {item.values.map((value, _key) => {
                                    const info = ConversionsInfo[value.name.toLowerCase().replaceAll(" ", "_")];
                                    return (
                                        <div className={styles.arrowContainer} key={_key}>
                                            <DashboardItem
                                                title={value.name}
                                                tipTitle={info?.title}
                                                description={info?.description }
                                                buttonUrl={info?.url}
                                                subValue={`${value.value} users`}
                                                value={`${value.percent.toLocaleString("en-US", {
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 2
                                                })}%`}
                                                loading={loading}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className={styles.cardGroup}>
                            {item.additional?.map((value, _key) => {
                                const info = ConversionsInfo[value.name.toLowerCase().replaceAll(" ", "_")];
                                return (
                                    <div className={styles.card} key={_key}>
                                        <DashboardItem
                                            title={value.name}
                                            tipTitle={info?.title}
                                            description={info?.description }
                                            buttonUrl={info?.url}
                                            value={value.value}
                                            loading={loading}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
