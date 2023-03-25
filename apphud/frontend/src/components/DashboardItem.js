import React from "react";
import cn from "classnames";
import { NavLink } from "react-router-dom";
import Tip from "../containers/Common/Tip";
import NumberFormat from "react-number-format";
import Aux from "../hoc/Aux";
import {track} from "../libs/helpers";

const DashboardItem = (props) => {
  const {
    title,
    value,
    autorenewsOnCount,
    autorenewsOffCount,
    tipTitle,
    tipDescription,
    tipButtonUrl,
    autorenews,
    loading,
    prefix,
    chartUrl,
    valueOld,
    showOldValue
  } = props;

  return (
    <div className="dashboard-group__content-item">
      {chartUrl && (
        <NavLink
          to={chartUrl}
          className="dashboard-group__content-item__chart-link"
          onClick={() => track("dashboard_chart_icon_clicked", { link_url: chartUrl})}
        >
          <svg
            className="dashboard-group__content-item__chart-link__icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1 1H3V13H15V15H3H1V13V1ZM11.2071 9.20711L14.7071 5.70711L13.2929 4.29289L10.5 7.08579L8.70711 5.29289L8 4.58579L7.29289 5.29289L3.79289 8.79289L5.20711 10.2071L8 7.41421L9.79289 9.20711L10.5 9.91421L11.2071 9.20711Z"
              fill="#0085FF"
            />
          </svg>
        </NavLink>
      )}
      <span className="dashboard-group__content-item__title">
        <span>{title}</span>
        <Tip
          title={tipTitle}
          description={tipDescription}
          buttonUrl={tipButtonUrl}
          trackId={"dashboard_learn_more_button_clicked"}
        />
      </span>
      {loading ? (
        <div
          className="animated-background timeline-item"
          style={{ height: 32, marginTop: 3 }}
        />
      ) : (
        <div
          className={cn("dashboard-group__content-item__value", {
            flex_center: valueOld !== null
          })}
        >
          <NumberFormat
            value={value}
            displayType={"text"}
            thousandSeparator={true}
            prefix={prefix}
          />

          {showOldValue && (
            <div style={{ color: "red", marginLeft: "10px" }}>
              {" "}
              {"->"} {valueOld}
            </div>
          )}
        </div>
      )}
      {autorenews && (
        <Aux>
          {loading ? (
            <Aux>
              <div
                className="animated-background timeline-item"
                style={{
                  width: 50,
                  height: 16,
                  marginRight: 10,
                  display: "inline-block",
                  marginTop: 5
                }}
              />
              <div
                className="animated-background timeline-item"
                style={{
                  width: 50,
                  height: 16,
                  display: "inline-block",
                  marginTop: 5
                }}
              />
            </Aux>
          ) : (
            <div className="dashboard-group__content-item__footer">
              <span className="dashboard-group__content-item__footer-item">
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
                    d="M9.86563 1.13451C8.50777 0.86441 7.1003 1.00303 5.82122 1.53285C4.54213 2.06266 3.44888 2.95987 2.67971 4.11101C1.91054 5.26215 1.5 6.61553 1.5 8L0.25 8L2.25 10.5L4.25 8L3 8C3 6.9122 3.32257 5.84884 3.92692 4.94437C4.53127 4.0399 5.39025 3.33495 6.39524 2.91867C7.40024 2.50238 8.5061 2.39347 9.573 2.60568C10.6399 2.8179 11.6199 3.34173 12.3891 4.11092C13.1583 4.88011 13.6821 5.86011 13.8943 6.92701C14.1065 7.9939 13.9976 9.09977 13.5813 10.1048C13.1651 11.1098 12.4601 11.9687 11.5556 12.5731C10.6512 13.1774 9.5878 13.5 8.5 13.5V15C9.88447 15 11.2378 14.5895 12.389 13.8203C13.5401 13.0511 14.4373 11.9579 14.9672 10.6788C15.497 9.3997 15.6356 7.99224 15.3655 6.63437C15.0954 5.2765 14.4287 4.02922 13.4497 3.05026C12.4708 2.07129 11.2235 1.4046 9.86563 1.13451Z"
                    fill="#20BF55"
                  />
                  <path
                    d="M6.5 7.90753L8 9.40753L11 6.40753"
                    stroke="#20BF55"
                  />
                </svg>
                <span className="dashboard-group__content-item__footer-item__value text-green">
                  <NumberFormat
                    value={autorenewsOnCount}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </span>
              </span>
              <span className="dashboard-group__content-item__footer-item">
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
                    d="M9.86563 1.13451C8.50777 0.86441 7.1003 1.00303 5.82122 1.53285C4.54213 2.06266 3.44888 2.95987 2.67971 4.11101C1.91054 5.26215 1.5 6.61553 1.5 8L0.25 8L2.25 10.5L4.25 8L3 8C3 6.9122 3.32257 5.84884 3.92692 4.94437C4.53127 4.0399 5.39025 3.33495 6.39524 2.91867C7.40024 2.50238 8.5061 2.39347 9.573 2.60568C10.6399 2.8179 11.6199 3.34173 12.3891 4.11092C13.1583 4.88011 13.6821 5.86011 13.8943 6.92701C14.1065 7.9939 13.9976 9.09977 13.5813 10.1048C13.1651 11.1098 12.4601 11.9687 11.5556 12.5731C10.6512 13.1774 9.5878 13.5 8.5 13.5V15C9.88447 15 11.2378 14.5895 12.389 13.8203C13.5401 13.0511 14.4373 11.9579 14.9672 10.6788C15.497 9.3997 15.6356 7.99224 15.3655 6.63437C15.0954 5.2765 14.4287 4.02922 13.4497 3.05026C12.4708 2.07129 11.2235 1.4046 9.86563 1.13451Z"
                    fill="#FF0C46"
                  />
                  <rect
                    x="6.37869"
                    y="6.99332"
                    width="1"
                    height="5"
                    transform="rotate(-45 6.37869 6.99332)"
                    fill="#FF0C46"
                  />
                  <rect
                    x="6.37869"
                    y="9.82175"
                    width="5"
                    height="1"
                    transform="rotate(-45 6.37869 9.82175)"
                    fill="#FF0C46"
                  />
                </svg>
                <span className="dashboard-group__content-item__footer-item__value text-red">
                  <NumberFormat
                    value={autorenewsOffCount}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </span>
              </span>
            </div>
          )}
        </Aux>
      )}
    </div>
  );
};

DashboardItem.defaultProps = {
  title: "",
  value: 0,
  autorenewsOnCount: 0,
  autorenewsOffCount: 0,
  tipTitle: "",
  tipDescription: "",
  tipButtonUrl: "#",
  autorenews: false,
  loading: false,
  prefix: ""
};

export default DashboardItem;
