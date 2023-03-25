import React, {useState, useEffect} from "react";
import styles from "../../Charts/Charts/styles.module.scss";
import ChartInfo from "../../Charts/Charts/ChartInfo";
import Tip from "../../../Common/Tip";
import DateRangePicker from "../../../Common/DateRangePicker";
import {formatMoney, generatePeriod, getDateFromURI, setDateToURI, track} from "../../../../libs/helpers";
import Filter from "../../Charts/Charts/Filter";
import moment from "moment";
import axios from "axios";
import {connect} from "react-redux";
import {useRouteMatch} from "react-router";
import {Line} from "react-chartjs-2";
import colors from "../../Charts/Charts/utils/colors";
import ChartDataTransformerWithNestedRows from "../../Charts/Charts/transformers/ChartDataTransformerWithNestedRows";
import cn from "classnames";
import Table from "./Table";
import ExportCSV from "../../../../components/modals/ExportCSV/ExportCSV";
import ExportCSVSuccessModal from "../../../../components/modals/ExportCSVSuccess/ExportCSVSuccess";
import { useFilter, usePeriod, filtersType } from "../../Charts/hooks";

const periods = {
    "time_week": [
        { name: "Last 4 weeks", value: "weeks_4" },
        { name: "Last 8 weeks", value: "weeks_8" },
        { name: "Last 12 weeks", value: "weeks_12"},
        { name: "Last 24 weeks", value: "weeks_24" },
        { name: "Last 48 weeks", value: "weeks_48" }
    ],
    "time_month": [
        { name: "Last 3 months", value: "months_3" },
        { name: "Last 6 months", value: "months_6" },
        { name: "Last 12 months", value: "months_12" },
        { name: "Last 18 months", value: "months_18" },
        { name: "Last 24 months", value: "months_24" }
    ],
    "time_quarter": [
        { name: "Last 4 quarters", value: "quarters_4" },
        { name: "Last 8 quarters", value: "quarters_8" },
        { name: "Last 12 quarters", value: "quarters_12" },
        { name: "Last 18 quarters", value: "quarters_18" },
        { name: "Last 24 quarters", value: "quarters_24" }
    ],
    "time_year": [
        { name: "Last year", value: "years_1" },
        { name: "Last 2 years", value: "years_2"},
        { name: "Last 3 years", value: "years_3" },
        { name: "Last 4 years", value: "years_4" },
        { name: "Last 5 years", value: "years_5" }
    ]
};

function CohortsContainer(props) {
    const { chart, list, settings: { timezone } } = props;
    const {period, onSetPeriod} = usePeriod("cohorts");
    const {filter, onSetFilter} = useFilter(`cohorts.${chart.storageKey}`, filtersType.cohorts);
    const { params } = useRouteMatch();
    const [data, setData] = useState(null);
    const [disabledData, setDisabledData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [countSegments, setCountSemgents] = useState(0);
    const [ExportCSVModalIsOpen, setExportCSVModalIsOpen] = useState(false);
    const [ExportCSVSuccessModalIsOpen, setExportCSVSuccessModalIsOpen] = useState(false);
    const [isPercentValues, setIsPercentValues] = useState(false);
    const onSetFilters = (key, val) => {
        onSetFilter(key, val);
        if (val[1]?.id && filter?.segments[1]?.id !== val[1]?.id) {
            let period;
            switch (val[1]?.id) {
                case "time_week":
                    period = generatePeriod("weeks_12");
                    break;
                case "time_month":
                    period = generatePeriod("months_12");
                    break;
                case "time_quarter":
                    period = generatePeriod("quarters_12");
                    break;
                case "time_year":
                    period = generatePeriod("years_3");
                    break;
            }
            if (period) {
              onSetPeriod({
                    startDate: period.start_time,
                    endDate: period.end_time
                });
            }
        }
    };

    const time_range = {
        from: moment(period.from)
            .startOf("day")
            .utcOffset(timezone, true)
            .format("YYYY-MM-DD[T]HH:mm:ss.SSSZ"),
        to: moment(period.to)
            .endOf("day")
            .utcOffset(timezone, true)
            .format("YYYY-MM-DD[T]HH:mm:ss.SSSZ")
    };
    const reqParams = {
        app: params?.appId,
        chart: chart.id,
        calc_method: "include_current",
        pagination: {
            offset: 0,
            limit: 2000
        },
        filters: [...filter.filters],
        segments: filter?.segments.filter((e) => e?.id !== null),
        time_range: { ...time_range, step: filter?.time_range?.step }
    };
    useEffect(() => {
        setLoading(true);
        axios.post("/api/v1/chart/query/column", reqParams)
            .then((res) => setData(res.data))
            .finally(() => setLoading(false))
        ;
    }, [filter, period]);
    const segmentByName = data?.rows[0]?.segments.length === 2 && data?.rows[0]?.segments[0]?.name;
    const withoutSelectedSegment = filter?.segments[0]?.id === null;
    let plaintData = data;

    if (chart.id === "revenue_retention") {
      plaintData = {...data, rows: (data?.rows|| []).map(v => ({...v, values: v.values.filter(e => e.name.toLowerCase() !== "average")}))}
    }

    const rows = ChartDataTransformerWithNestedRows.getTableData(plaintData, withoutSelectedSegment);
    const lines = plaintData
        ? ChartDataTransformerWithNestedRows.transform(
            rows,
            colors,
            segmentByName ? disabledData : [ ...disabledData, ...rows.slice(1)],
            chart.id  === "revenue_retention" ? 1 : 2,
            isPercentValues
        )
        : null;
    return <>
        <div className={styles["container-content"]}>
            <div className={styles.header}>
                <div className={styles["header-title"]}>
                    <div>
                        <h2>{ChartInfo[chart?.id]?.label || chart?.name}</h2>
                        {(ChartInfo[chart?.id]?.description || chart?.description) && (
                            <Tip
                                title={ChartInfo[chart?.id]?.label || chart?.name}
                                description={ChartInfo[chart?.id]?.description || chart?.description}
                                buttonUrl={ChartInfo[chart?.id]?.url || `https://docs.apphud.com/analyze/charts#${chart?.id}`}
                            />
                        )}
                    </div>
                    <DateRangePicker
                        anchorDirection="right"
                        startTime={period.from}
                        endTime={period.to}
                        handleChangePeriod={onSetPeriod}
                        periods={periods[filter?.segments[1]?.id]}
                    />
                </div>
                <Filter
                    chartId={chart.id}
                    type={chart.type}
                    filter={filter}
                    onSetFilters={onSetFilters}
                    list={list}
                    setCountSemgents={setCountSemgents}
                    setConversion={(v) => onSetFilter("conversion", v)}
                    conversion={filter?.conversion}
                    refunds={filter?.refunds || false}
                />
                <div className={cn("chart-container_custom", styles.chart)}>
                    <div className={styles["chart-container"]}>
                        { lines
                            && <Line
                                data={lines}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    legend: {
                                        display: false
                                    },
                                    hover: {
                                      mode: "nearest",
                                      animationDuration: 0
                                    },
                                    plugins: {
                                      datalabels: {
                                        display: false
                                      }
                                    },
                                    elements: {
                                      arc: {},
                                      point: {
                                        radius: 0,
                                        borderWidth: 1,
                                        hitRadius: 500,
                                        hoverRadius: 6,
                                        hoverBorderWidth: 0
                                      },
                                      line: {
                                        tension: 0.4,
                                        borderWidth: 2
                                      },
                                      rectangle: {}
                                    },
                                    scales: {
                                        xAxes: [
                                            {
                                                scaleLabel: {
                                                    display: true
                                                },
                                                gridLines: {
                                                    color: "#edf3f8",
                                                    borderDash: [],
                                                    zeroLineColor: "#edf3f8"
                                                },
                                                ticks: {
                                                    autoSkip: true,
                                                    autoSkipPadding: 30,
                                                    maxRotation: 0,
                                                    fontFamily: "Ubuntu",
                                                    fontColor: "#1A344B"
                                                }
                                            }
                                        ],
                                        yAxes: [
                                            {
                                                ticks: {
                                                    beginAtZero: true,
                                                    fontFamily: "Ubuntu",
                                                    fontColor: "#1A344B",
                                                    callback: function(label, ...rest) {
                                                        if(isPercentValues) {
                                                          return `${Math.abs(label)}%`;
                                                        }
                                                        return formatMoney(Math.abs(label))
                                                    }
                                                },
                                                gridLines: {
                                                    color: "#edf3f8",
                                                    borderDash: [],
                                                    zeroLineColor: "#edf3f8"
                                                }
                                            }
                                        ]
                                    },
                                    tooltips: {
                                        displayColors: false,
                                        backgroundColor: "#1a344b",
                                        titleFontFamily: "Ubuntu",
                                        titleFontStyle: "normal",
                                        titleFontWeight: "400",
                                        bodyFontWeight: "400",
                                        bodyFontFamily: "Ubuntu",
                                        bodyFontSize: 13,
                                        xPadding: 10,
                                        yPadding: 10,
                                        cornerRadius: 8,
                                        callbacks: {
                                            title: (arr, data) => {
                                                return arr.map((obj) => data.segments[obj?.datasetIndex]?.label)
                                            },
                                            label: (obj, data) => {
                                                const val = formatMoney(Math.abs(obj.value));
                                                let postfix = "";
                                                if (chart.id === "subscribers_retention") {
                                                  postfix = " subscribers"
                                                }
                                                if (isPercentValues) {
                                                  postfix = "% of total";
                                                }
                                                return `${obj.label} : ${val}${postfix}`;
                                            },
                                            footer: (obj, data) => {
                                                return obj.map((el) => {
                                                    const datasetIndex = el.datasetIndex;
                                                    const index = el.index;
                                                    const value = data.datasets[datasetIndex].data[index];
                                                    const rootValue = rows[datasetIndex].values[3]?.value;
                                                    // const previousValue = data.datasets[datasetIndex].data[index - 1];
                                                    // const arr = [];
                                                    // if (isPercentValues) {
                                                    //   arr.push(`Percent of total: ${formatMoney((value / rootValue) * 100)}%`)
                                                    // }
                                                    // if (previousValue) {
                                                    //   arr.push(`Percent of previous: ${formatMoney((value / previousValue) * 100)}%`);
                                                    // }
                                                    return [];
                                                }).flat(1)
                                            }
                                        }
                                    }
                                }}
                            />
                        }

                        { loading && (
                            <div className="chart__preloader">
                                <div className="chart__preloader-spin">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        version="1.0"
                                        width="32px"
                                        height="32px"
                                        viewBox="0 0 128 128"
                                        xmlSpace="preserve"
                                    >
                                        <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
                                        <g>
                                            <path
                                                d="M64 9.75A54.25 54.25 0 0 0 9.75 64H0a64 64 0 0 1 128 0h-9.75A54.25 54.25 0 0 0 64 9.75z"
                                                fill="#0084ff"
                                                fillOpacity="1"
                                            />
                                            <animateTransform
                                                attributeName="transform"
                                                type="rotate"
                                                from="0 64 64"
                                                to="360 64 64"
                                                dur="1400ms"
                                                repeatCount="indefinite"
                                            />
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        )}
                        {(data?.rows?.length === 0 && !loading && (
                            <div style={{top:0}} className="chart-container__data-not-found">
                                <h1>No Enough Data</h1>
                                <p>
                                    No sufficient data to display chart. Select a different date
                                    range, segment or filter.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                { data && data?.rows.length > 0 &&
                    <Table
                        isPercentValues={isPercentValues}
                        isPercentValuesHandler={(v) => setIsPercentValues(v?.value === 1)}
                        tooltips={{
                            average: "Average renewals count",
                            median: "Median renewals count"
                        }}
                        defaultSort={{name:"Renewal 0", order: 1}}
                        onOpenExport={() => {
                            setExportCSVModalIsOpen(true);
                            track("charts_export_link_clicked");
                        }}
                        data={rows}
                        id={chart.id}
                        segment={segmentByName}
                        sortable={["Renewal 0"]}
                        disabledData={disabledData}
                        onAllDisableHandler={(e) => {
                            if(disabledData?.length === e?.length) {
                                setDisabledData([]);
                            }else{
                                setDisabledData(e);
                            }
                        }}
                        onDisableHandler={(e) => {
                            const found = disabledData.findIndex((v) => JSON.stringify(v) === JSON.stringify(e));
                            if (found === -1) {
                                setDisabledData([...disabledData, e]);
                            }else{
                                const arr = [...disabledData];
                                arr.splice(found, 1);
                                setDisabledData(arr);
                            }
                        }}
                    />
                }
                <ExportCSV
                    rowsToExport={data?.rows.length}
                    chartType={"column"}
                    paramsForRequest={reqParams}
                    onClose={() => setExportCSVModalIsOpen(false)}
                    onExport={() => setExportCSVSuccessModalIsOpen(true)}
                    isOpen={ExportCSVModalIsOpen}
                />
                <ExportCSVSuccessModal onClose={() => setExportCSVSuccessModalIsOpen(false)} isOpen={ExportCSVSuccessModalIsOpen} />
            </div>
        </div>
    </>
}


const select = (state) => ({ settings: state.settings });

export default connect(select)(CohortsContainer);
