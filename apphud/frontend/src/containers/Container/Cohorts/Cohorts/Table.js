import React, { useState, useEffect } from "react";
import {ArrowIcon} from "../../../../components/Icons";
import Checkbox from "../../Charts/Charts/Tables/Checkbox";
import CustomSelect from "../../../Common/CustomSelect";
import SortableButton from "../../Charts/Charts/DatasetsFilter/SortableButton";
import Toggle from "../../Charts/Charts/DatasetsFilter/Toggle";
import Tip from "../../../Common/Tip";
import ChartDataTransformerWithNestedRows from "../../Charts/Charts/transformers/ChartDataTransformerWithNestedRows";
import {getValue} from "../../Charts/Charts/utils/renderValue";
import {formatMoney, track} from "../../../../libs/helpers";

const CellRender = ({ rootValue, rootIndex, value, index, type,  name, id }) => {
    const formattedValue = () => {
        switch (name?.toLowerCase()) {
            case "total":
            case "arppu":
                return `${getValue(value, "money")}`;
            case "renewal 0":
            case "renewal 1":
            case "renewal 2":
            case "renewal 3":
            case "renewal 4":
            case "renewal 5":
            case "renewal 6":
            case "renewal 7":
            case "renewal 8":
            case "renewal 9":
            case "renewal 10":
            case "renewal 11":
            case "renewal 12":
                return id === "revenue_retention" ? `${getValue(value, "money")}` : formatMoney(Math.abs(value));
            default:
                return formatMoney(Math.abs(value));
        }
    }

    return <td className='td'
               style={{ backgroundColor: rootValue && rootIndex <= index ? `rgba(77,169, 255, ${value / rootValue})` : "none"}}>
        { type === "percent"
            ? `${ChartDataTransformerWithNestedRows.formatValue(value / rootValue * 100)}%`
            : formattedValue()
        }
    </td>
}

const Table = ({ id = "", data, isPercentValues, disabledData, onDisableHandler, onAllDisableHandler, onOpenExport, segment, sortable, defaultSort = false, tooltips = {}, isPercentValuesHandler }) => {
    const views = [
        {name: "Absolute values", value: 0},
        {name: "Percent values", value: 1}
    ]
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState(defaultSort);
    const [isNodesShown, setNodesShown] = useState([]);
    const [view, setView] = useState(views[0]);
    const filter = ({label}) => label.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    const onSwitchNodes = (i) => {
        const index = isNodesShown.indexOf(i);
        if (index !== -1) {
            const newArr = [...isNodesShown]
            newArr.splice(index, 1);
            setNodesShown(newArr)
        }else{
            setNodesShown([ ...isNodesShown, i])
        }
    }
    const getSortedData = (data) => {
        const arr = [...data];
        arr.sort((a, b) => {
            if (sort?.order && !(a.label === "Overall" || b.label === "Overall")) {
                switch (sort?.name) {
                    case "segment":
                        if (a.label < b.label) {
                            return sort?.order;
                        } else {
                            return sort?.order * -1;
                        }
                    default:
                        if (a.values.find((e) => e.name === sort?.name)?.value < b.values.find((e) => e.name === sort?.name)?.value) {
                            return sort?.order;
                        } else {
                            return sort?.order * -1;
                        }
                }
            }
            return 0;
        })
        return arr;
    }
    useEffect(() => {
        isPercentValuesHandler(view);
    }, [view]);
    const items = (segment ? getSortedData(data) : data).filter(filter);
    return (
        <div className='table-sticky columns'>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: "1rem"}}>
                <div>
                    <input
                        placeholder="Search"
                        className="input input_blue input_search"
                        style={{marginRight: 20}}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <CustomSelect
                        value={view}
                        onChange={(e) => {
                            setView(e);
                            track("charts_cohorts_values_switched", {
                                value: e
                            });
                        }}
                        options={views}
                        className="custom-select_apps"
                        labelKey="name"
                        valueKey="value"
                    />
                </div>
                <div className="chart-exportcsv-button" onClick={onOpenExport}>
                    <svg
                        className="va-middle"
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 6.78V8.97L16 5.23L12 1.5V3.63C8.11 4.17 6.56 6.83 6 9.5C7.39 7.63 9.22 6.78 12 6.78ZM3 3.5C1.89543 3.5 1 4.39543 1 5.5V13.5C1 14.6046 1.89543 15.5 3 15.5H13C14.1046 15.5 15 14.6046 15 13.5V10.5H13V13.5H3L3 5.5H6V3.5H3Z"
                            fill="#0085FF"
                        />
                    </svg>
                    <span className="va-middle ml4">Export CSV</span>
                </div>
            </div>
            <div>
                <table className='block-table'>
                    <tbody>
                        <tr className='tr'>
                            <th className='th'>
                                { segment
                                    && <Toggle
                                        onClick={() => onAllDisableHandler(data)}
                                        half={disabledData?.length > 0}
                                        checked={disabledData?.length !== data?.length}>
                                        <SortableButton
                                          value={Number(sort?.name === "segment")}
                                          onChange={(v) => setSort({order: v, name: "segment"})}
                                        >
                                            <b className="uppercase">{segment}</b>
                                        </SortableButton>
                                    </Toggle>
                                }

                            </th>
                            { data[0].values.map((e, i) => {
                              if (id === "revenue_retention" && e.name.toLowerCase() === "average") {
                                return null
                              }

                              return (
                                <th className='th' key={i}>
                                  {sortable.indexOf(e.name) !== -1
                                    ? (
                                      <SortableButton value={Number(sort?.name === e.name)} onChange={(v) => setSort({order: v, name: e.name })}>
                                        <b className="uppercase">{e.name}</b>
                                      </SortableButton>
                                    )
                                    : <b className="uppercase">{e.name}</b>
                                  }
                                  {tooltips[e.name.toLowerCase()]
                                  && <>
                                    &nbsp;
                                    <Tip width={164} description={tooltips[e.name.toLowerCase()]} />
                                  </>
                                  }
                                </th>
                              );
                            })}
                        </tr>
                        { items.map((item, i) => {
                            const isNodes = isNodesShown.indexOf(i) !== -1;
                            const rootIndex = item.values.findIndex(e => e.root);
                            const rootValue = item.values[rootIndex]?.value;
                            const hasProgress = item.nodes.findIndex((e) => e.in_progress === true) !== -1
                                || item.in_progress
                                || (!segment && items.findIndex((e) => e.in_progress === true) !== -1);
                            const disabled = disabledData.findIndex((v) => {
                                return v?.label === item?.label
                            }) !== -1;
                            return (
                                <>
                                    <tr className="tr" key={i}>
                                        <td className="td">
                                            { segment || i === 0
                                                ? <Checkbox
                                                    color={item.color}
                                                    checked={!disabled}
                                                    onChange={() => onDisableHandler(item)}
                                                    id={`checkbox-${i}`}
                                                    title={item.label}>
                                                    <div className="chart-table__container-right__info">
                                                        <b className="chart-text__maxwidth noselect">
                                                            {item.label}
                                                            { /* hasProgress
                                                                && <Tip width={278} description={"Incomplete cohort due to selected period."}>
                                                                    <img src={WarningIcon} style={{paddingLeft: 8,marginTop: -5}}/>
                                                                </Tip>
                                                           */ }
                                                        </b>
                                                    </div>
                                                </Checkbox>
                                                : <span style={{paddingLeft: 28 /* marginLeft: item.in_progress === true ? -20 : 0 */}}>
                                                     {/* item.in_progress === true
                                                        && <Tip width={278} description={"Incomplete cohort due to selected period."}>
                                                             <img src={WarningIcon} style={{paddingRight: 8, marginTop: -5}}/>
                                                         </Tip>
                                                     */}
                                                    {item.label}
                                                </span>
                                            }
                                            <div
                                                className={`table-sticky__arrow ${isNodes && "table-sticky__arrow_active"}`}
                                                onClick={() => onSwitchNodes(i)}>
                                                { item.nodes.length >= 1
                                                    && <ArrowIcon />
                                                }
                                            </div>
                                        </td>
                                        { item.values.map((e, b) => {
                                          if (id === "revenue_retention" && e.name.toLowerCase() === "average") {
                                            return null
                                          }
                                          return (
                                            <CellRender
                                              id={id}
                                              rootValue={rootValue}
                                              rootIndex={rootIndex}
                                              value={e.value}
                                              name={e.name}
                                              key={`${i}${b}`}
                                              index={b}
                                              childValues={item.nodes.map(o => o.values[b].value)}
                                              type={rootIndex <= b && view?.value === 1 && "percent"}
                                            />
                                          );
                                        })}
                                    </tr>
                                    { isNodes
                                        && <>
                                            {item.nodes.map((item, i) => {
                                                const rootIndex = item.values.findIndex(e => e.root);
                                                const rootValue = item.values[rootIndex]?.value;
                                                return (
                                                    <tr className="tr" key={i}>
                                                        <td className="td">
                                                            <span style={{paddingLeft: 28}}>
                                                                {/* item.in_progress === true
                                                                    && <img src={WarningIcon} style={{marginLeft: -20, paddingRight: 8, marginTop: -5}}/>
                                                                */}
                                                                {item.segment || item.label}
                                                            </span>
                                                        </td>
                                                        { item.values.map((e, b) => (
                                                            <CellRender
                                                                id={id}
                                                                name={e.name}
                                                                rootValue={rootValue}
                                                                rootIndex={rootIndex}
                                                                value={e.value}
                                                                key={`${i}${b}`}
                                                                index={b}
                                                                type={rootIndex <= b && view?.value === 1 && "percent"}
                                                            />
                                                        ))}
                                                    </tr>
                                                )
                                            })}
                                        </>
                                    }
                                </>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table
