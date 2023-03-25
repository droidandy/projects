import React, { useMemo } from "react";
import NumberFormat from "react-number-format";
import cn from "classnames";
import Tooltip from "rc-tooltip";
import Checkbox from "./Checkbox";
import { countries } from "../settings";
import "./styles.scss";

const DataTable = ({ data, onDisabled, disabledColumns, toFixedValue = 1 }) => {
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

      return {
        segments: segmentsValues,
        data: row?.values
      };
    });
  }, [data]);

  return (
    <div className="">
      <div className="table-sticky columns">
        <div>
          <table className="block-table">
            <tbody>
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
                    _checked: !disabledColumns?.includes(i)
                  })}
                  key={i}
                >
                  {e?.segments?.map((el, index, arr) => {
                    let hasChild = false;

                    if (el.parent && index === 0) {
                      const parentSegment = data[i]?.segments[0]?.value;
                      const findIdsParentSegments = data?.reduce(
                        (acc, curr, index1) => {
                          if (curr?.segments[0]?.value === parentSegment) {
                            return [...acc, index1];
                          }

                          return acc;
                        },
                        []
                      );
                      const filtredParents = findIdsParentSegments?.filter(
                        (idx) => !disabledColumns?.includes(idx)
                      );

                      hasChild =
                        filtredParents?.length !==
                        findIdsParentSegments?.length &&
                        filtredParents?.length > 0;
                    }

                    if (!el.value) {
                      return <td className="td" />;
                    }

                    return (
                      <td className="td segment-column" key={index}>
                        <Checkbox
                          id={`checkbox-${i}`}
                          onChange={() =>
                            onDisabled(i, index === 0 && el.parent)
                          }
                          checked={!disabledColumns?.includes(i)}
                          title={el.value}
                          hasChild={hasChild}
                        >
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
                        </Checkbox>
                      </td>
                    );
                  })}

                  {e?.data?.map((el, index) => (
                    <td className="td" key={index}>
                      {el.type === "money" ? (
                        <NumberFormat
                          className={el.value < 0 ? "text-red" : ""}
                          value={parseFloat(el.value).toFixed(toFixedValue)}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        />
                      ) : (
                          el.value
                        )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
