import React, { useMemo } from "react";
import cn from "classnames";
import Tooltip from "rc-tooltip";
import { countries } from "../settings";
import "./styles.scss";

const TableConverions = ({ data, conversion, steps }) => {
  const labels = useMemo(() => {
    if (!data?.length) return [];

    const segments = data[0]?.segments.map((e) => e?.name);
    const values = data[0]?.values?.map((e) => e?.name);

    return [...segments, ...values];
  }, [data]);

  const values = useMemo(() => {
    if (!data?.length) return [];

    return data?.map((row, index, arr) => {
      const segmentsValues = row?.segments?.map((e, i) => {
        if (i === 0 && arr[index - 1]?.segments[0].value === e.value) {
          return {
            value: "",
            parent: false
          };
        }

        return {
          value: e.value,
          parent: true
        };
      });

      const otherValues = row?.values.map((e, i, array) => {
        if (conversion?.value === "% of total") {
          const value = e.value/ array[0].value;
          const correctValue = Number.isNaN(value) ? 0 : value;
          return i === 0
            ? "100.0%"
            : `${parseFloat(correctValue * 100).toFixed(1)}%`;
        }

        if (conversion?.value === "% of previous") {
          return i === 0
            ? "100.0%"
            : `${parseFloat(
                (e.value / (array[i - 1].value || 1)) * 100
              ).toFixed(1)}%`;
        }

        return e.value;
      });

      return {
        segments: segmentsValues,
        data: otherValues
      };
    });
  }, [data, conversion]);

  return (
    <div className="">
      <div className="table-sticky columns">
        <div>
          <table className="block-table">
            <tr className="tr">
              {labels?.map((e, i, arr) => {
                if (arr?.length >= 5 && (i === 0 || i === 1)) {
                  return (
                    <th className="th segment-column" key={e}>
                      {e}
                    </th>
                  );
                }

                return (
                  <th className="th" key={e}>
                    {e}
                  </th>
                );
              })}
            </tr>
            {values?.map((e, i, array) => (
              <tr
                className={cn("tr", {
                  _checked: i >= steps.start && i <= steps.end
                })}
                key={i}
              >
                {e?.segments?.map((el, index, arr) => {
                  if (!el.value) {
                    return <td className="td" />;
                  }

                  return (
                    <td className="td segment-column" key={index}>
                      <div className="chart-table__container-right__info">
                        <Tooltip
                          mouseEnterDelay={0.1}
                          placement="top"
                          trigger={["hover"]}
                          overlay={
                            <div>
                              <div className="tip-content tip-content_center tip-content_autowidth">
                                {countries[el.value] || el.value}
                              </div>
                            </div>
                          }
                        >
                          {!arr[index - 1] && index !== 0 ? (
                            <span
                              title={countries[el.value] || el.value}
                              className="chart-text__maxwidth noselect"
                            >
                              {countries[el.value] || el.value}
                            </span>
                          ) : (
                            <b
                              title={countries[el.value] || el.value}
                              className="chart-text__maxwidth noselect"
                            >
                              {countries[el.value] || el.value}
                            </b>
                          )}
                        </Tooltip>
                      </div>
                    </td>
                  );
                })}

                {e?.data?.map((el, index) => (
                  <td className="td" key={index}>
                    {el}
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

export default TableConverions;
