import React, { useState } from "react";
import NumberFormat from "react-number-format";
import Tooltip from "rc-tooltip";
import Checkbox from "./Checkbox";
import { countries } from "../settings";
import "./styles.scss";
import { getValue } from "../utils/renderValue";
import Toggle from "../DatasetsFilter/Toggle";
import SortableButton from "../DatasetsFilter/SortableButton";
import useSort from "../DatasetsFilter/hooks/useSort";
import {formatMoney, track} from "../../../../../libs/helpers";

const DataTable = ({ data: _data, onDisabled, onAllSelector, segment, withoutOverallSum, isOverallWithoutPrefix, chartId }) => {

  const { data, setOrder, order, setField, setGetValue, field } = useSort(_data, "total", 1);
  const [index, setIndex] = useState(null);
  const sumValues = (values) => {
    return values?.reduce((a, b) => Math.round(a) + Math.round(b), 0);
  };

  const getRowSum = (index) => {
    return sumValues(data?.datasets[index]?.data);
  };

  const overlay = (name) => {
    return (
      <div>
        <div className="tip-content tip-content_center tip-content_autowidth">
          {name}
        </div>
      </div>
    );
  };
  const checked = data?.datasets?.filter((e) => !e?.disabled).length > 0;
  const excludedTotal = ["mrr","churn_subscriptions","churn_revenue"].indexOf(chartId) !== -1;
  return (
    <div className="">
      <div className="table-sticky">
        <div>
          <table className="block-table">
            <tr className="tr">
              <th className="th">
                <Toggle
                    onClick={() => onAllSelector(!checked)}
                    half={data?.datasets?.filter((e) => !e?.disabled).length < data?.datasets?.length}
                    checked={checked}>
                    { segment
                        && <SortableButton value={field === "label" ? order : 0} onChange={(v) => {
                            setField("label");
                            setOrder(v);
                            setIndex(null);
                            setGetValue({
                              func: (val) => {
                                const v = countries[val] || val;
                                return v?.toLowerCase();
                              }
                            });
                            track("charts_table_column_sorted", {
                              column: "label",
                              order: v
                            });
                        }}>
                            <b className="uppercase">{segment}</b>
                        </SortableButton>
                    }
                </Toggle>
              </th>
              { !excludedTotal
                && <th className="th">
                  <SortableButton value={field === "total" ? order : 0} onChange={(v) => {
                    track("charts_table_column_sorted", {
                      column: "total",
                      order: v
                    });
                    setField("total");
                    setOrder(v);
                    setIndex(null);
                    setGetValue({
                      func: (val) => {
                        return val;
                      }
                    });
                  }}>
                    <b className="uppercase">Total</b>
                  </SortableButton>
                </th>
              }
              {data?.labels?.map((e, i) => (
                <th className="th" key={e}>
                  {e}
                </th>
              ))}
            </tr>

            {data?.datasets?.map((e, i) => (
              <tr className="tr" key={e?.label || i}>
                <td className="td">
                  <Checkbox
                    color={e.borderColor}
                    id={`checkbox-${e?.label}-${i}`}
                    onChange={() => onDisabled(e?.label)}
                    checked={!e.disabled}
                    title={countries[e?.label] || e?.label}
                  >
                    <div className="chart-table__container-right__info">
                      <Tooltip
                        mouseEnterDelay={0.1}
                        placement="top"
                        trigger={["hover"]}
                        overlay={overlay(countries[e?.label] || e?.label)}
                      >
                        <b
                          title={countries[e?.label] || e?.label}
                          className="chart-text__maxwidth noselect"
                        >
                          {countries[e?.label] || e?.label}
                        </b>
                      </Tooltip>
                    </div>
                  </Checkbox>
                </td>
                { !excludedTotal
                  && <td className="td">
                    {getValue(e?.total, e?.typeValue)}
                  </td>
                }
                {e?.values?.map((el, index) => (
                  <td className="td" key={index}>
                    {getValue(el.value, e.typeValue)}
                  </td>
                ))}
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
