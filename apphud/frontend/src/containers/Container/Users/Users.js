import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import history from "../../../history"
import Aux from "../../../hoc/Aux"
import { fetchCustomersRequest } from "../../../actions/customers"
import Moment from "react-moment"
import NumberFormat from "react-number-format"
import { throttle, uniq } from "lodash"
import Tip from "../../Common/Tip"
import $ from "jquery"
import ExportModal from "./ExportModal/ExportModal"
import ExportErrorModal from "./ExportModal/ExportErrorModal"
import {generatePeriod, getDateFromURI, setDateToURI, track} from "../../../libs/helpers"
import DateRangePicker from "../../Common/DateRangePicker"

import imageWaiting from "../../../assets/images/image-desert.jpg"

import Filters from "../../Common/Filters/Filters2"
import DefaultInput from "components/DefaultInput"

const moment = require("moment-timezone")

class Users extends Component {
  state = {
    loading: true,
    customers: [],
    offset: 0,
    allLoaded: false,
    sortBy: "created_at",
    order: false,
    meta: {
      total_count: 0
    },
    sandbox: 0,
    limit: 20,
    query: "",
    filters: [],
    openExport: false,
    currentPeriod: getDateFromURI("users")
  }

  componentDidMount() {
    const sandbox =
      localStorage.getItem("users.sandbox") === null
        ? 0
        : parseInt(localStorage.getItem("users.sandbox"), 10)
    const sortBy =
      localStorage.getItem("users.sortBy") === null
        ? "created_at"
        : localStorage.getItem("users.sortBy")
    const order =
      localStorage.getItem("users.order") === null
        ? false
        : JSON.parse(localStorage.getItem("users.order"))
    const filters =
      localStorage.getItem("users.filters") === null
        ? []
        : JSON.parse(localStorage.getItem("users.filters"))

    this.setState(
      {
        loading: true,
        customers: [],
        offset: 0,
        allLoaded: false,
        sortBy,
        order,
        meta: {
          total_count: 0
        },
        sandbox,
        filters
      },
      () => {
        this.getUsers(this.props, 0, true)
      }
    )

    this.attachScrollListener()
    document.title = "Apphud | App users"
  }

  componentWillUnmount() {
    this.detachScrollListener()
  }

  getUsers = (
    props = this.props,
    offset = 0,
    refresh = false,
    cb = () => { }
  ) => {
    const {
      customers,
      meta,
      limit,
      sortBy,
      order,
      query,
      filters,
      currentPeriod
    } = this.state
    const sandbox =
      localStorage.getItem("users.sandbox") === null
        ? 0
        : parseInt(localStorage.getItem("users.sandbox"), 10)
    let { start_time, end_time } = currentPeriod

    if (customers.length === meta.total_count && !refresh && limit === 20) {
      this.setState({ loading: false, lazyLoad: false })
      return
    }

    if (offset === 0) this.setState({ loading: true })
    else this.setState({ lazyLoad: true })

    if (sandbox || query) {
      const period = generatePeriod("all")
      start_time = period.start_time
      end_time = period.end_time
    }

    let params = {
      order: order ? "asc" : "desc",
      sort_by: sortBy,
      q: query,
      limit,
      sandbox,
      offset,
      start_time,
      end_time
    }

    if (!sandbox) {
      for (const filter of filters) params[filter.value] = filter.equal
    }

    if (query) params = { q: query, start_time, end_time }

    const paramsString = $.param(params)

    this.props.fetchCustomersRequest(
      { paramsString, appId: props.match.params.appId },
      (result) => {
        const newCustomers = result.results

        if (offset === 0) {
          this.setState({
            loading: false,
            meta: result.meta,
            customers: newCustomers
          })
        } else {
          this.setState((state) => {
            const oldcustomers = state.customers
            const unionCustomers = [...oldcustomers, ...newCustomers]

            if (newCustomers.length === 0) {
              result.meta.total_count = unionCustomers.length
            }

            return {
              lazyLoad: false,
              meta: result.meta,
              customers: unionCustomers
            }
          })
        }
        cb()
      }
    )
  }

  atPageBottom = () => {
    this.setState(
      {
        offset: this.state.offset + 20
      },
      () => {
        this.getUsers(this.props, this.state.offset)
      }
    )
  }

  listener = throttle(this.scrollListener, 200).bind(this)

  scrollListener() {
    const height = Math.max(
      document.body.scrollHeight,
      document.body.clientHeight,
      document.body.offsetHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    )

    const scrollHeight = document.documentElement.clientHeight + window.scrollY;

    if (height <= scrollHeight + 50) {
      if (
        !this.state.loading &&
        this.state.customers.length !== this.state.meta.total_count
      ) {
        this.atPageBottom()
      }
    }
  }

  attachScrollListener() {
    window.addEventListener("scroll", this.listener)
    this.listener()
  }

  detachScrollListener() {
    window.removeEventListener("scroll", this.listener)
    window.removeEventListener("resize", this.listener)
  }

  refresh = (e) => {
    window.scrollTo(0, 0)
    this.setState(
      {
        lazyLoad: false,
        offset: 0
      },
      () => {
        this.getUsers(this.props, 0, true)
      }
    )
  }

  goToUser = (userId, e) => {
    const url = `/apps/${this.props.match.params.appId}/users/` + userId
    e.preventDefault()

    if (e.metaKey || e.ctrlKey) window.open(url, "_blank")
    else history.push(url)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.appId !== nextProps.match.params.appId) {
      this.setState(
        {
          loading: true,
          customers: [],
          offset: 0,
          allLoaded: false,
          sortBy: "created_at",
          order: false,
          meta: {
            total_count: 0
          }
        },
        () => {
          this.getUsers(nextProps)
        }
      )
    }
  }

  handleChangeSortBy = (column) => {
    let order = !this.state.order

    if (column !== this.state.sortBy) order = false

    localStorage.setItem("users.sortBy", column)
    localStorage.setItem("users.order", order)

    this.setState({ sortBy: column, order }, this.refresh)

    track("users_table_column_sorted", { column, order });
  }

  currentSubscriptionTagClass = (status) => {
    return classNames("tag capitalize", {
      tag_red: ["refunded", "expired"].indexOf(status) > -1,
      tag_green: ["active", "intro", "promo", "regular", "promotional"].indexOf(status) > -1,
      tag_orange: ["trial", "grace"].indexOf(status) > -1,
      tag_silver: status === "none"
    })
  }

  filterSubscriptions = (subscriptions) => {
    const autorenewable = subscriptions.filter(
      ({ kind }) => kind === "autorenewable"
    )
    const nonrenewable = subscriptions.filter(
      ({ kind }) => kind === "nonrenewable"
    )
    const productIds = nonrenewable.map(({ product_id }) => product_id)

    if (nonrenewable.length > 0) {
      nonrenewable.splice(1)
      nonrenewable[0].productIds = productIds.reduce((map, val) => {
        map[val] = (map[val] || 0) + 1

        return map
      }, {})
    }

    const result = autorenewable.concat(nonrenewable)

    return result.filter((subscription) => {
      const sandboxOn =
        subscription.environment === "sandbox" && this.state.sandbox
      const sandboxOff =
        subscription.environment === "production" && !this.state.sandbox

      return sandboxOn || sandboxOff
    })
  }

  handleChangeSandbox = ({ target }) => {
    const sandbox = target.checked ? 1 : 0
    localStorage.setItem("users.sandbox", sandbox)
    this.setState({ sandbox }, this.refresh)
    track("users_sandbox_switch_changed", {value: sandbox})
  }

  handleChangeQuery = ({ target }) => {
    this.setState({ query: target.value }, () => {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.getUsers(this.props, 0, true)
      }, 1000)
    });
    track("users_searched", { query:  target.value });
  }

  handleChangeFilters = (filters) => {
    localStorage.setItem("users.filters", JSON.stringify(filters))
    this.setState({ filters }, this.refresh);
    track("users_filter_selected", filters);
  }

  handleToggleExportUsers = () => {
    this.setState({ openExport: !this.state.openExport });
    track("users_export_link_clicked")
  }

  handleChangePeriod = ({ startDate, endDate }) => {
    if (startDate) {
      this.setState({
        currentPeriod: Object.assign(this.state.currentPeriod, {
          start_time: startDate.format("YYYY-MM-DD HH:mm:ss"),
          end_time: null
        })
      })
    }
    if (endDate) {
      this.setState(
        {
          currentPeriod: Object.assign(this.state.currentPeriod, {
            end_time: endDate.format("YYYY-MM-DD HH:mm:ss")
          })
        },
        () => {
          this.refresh()
          setDateToURI(startDate, endDate, "users");
        }
      )
    }
    track("users_date_range_changed", {
      start_time: startDate?.format("YYYY-MM-DD HH:mm:ss"),
      end_time: endDate?.format("YYYY-MM-DD HH:mm:ss")
    })
  }

  render() {
    const {
      meta,
      sandbox,
      loading,
      customers,
      sortBy,
      order,
      lazyLoad,
      filters,
      openExport,
      currentPeriod,
      query
    } = this.state
    const { user_collaboration, user } = this.props.application

    return (
      <div className="container-content container-content__white" id="container">
        <div className="container-top">
          <div className="fl">
            <div className="container-title container-title_withdescription">
              Users
              <NumberFormat
                className="users-count"
                value={meta.total_count}
                displayType={"text"}
                thousandSeparator={true}
              />
            </div>
            {!sandbox && (
              <div className="container-description">
                <span className="container-description__users-label">
                  Created in
                </span>
                <div className="users-date__select">
                  <DateRangePicker
                    startTime={currentPeriod.start_time}
                    endTime={currentPeriod.end_time}
                    handleChangePeriod={this.handleChangePeriod}
                    name={this.constructor.displayName}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="fr">
            <label className="switcher switcher_orange">
              <input
                id="viewSandbox"
                onChange={this.handleChangeSandbox}
                checked={!!sandbox}
                type="checkbox"
                className="ios-switch green"
              />
              <div>
                <div></div>
              </div>
            </label>
            <label
              htmlFor="viewSandbox"
              className={
                "switcher-title users-sandbox__switcher-label " +
                (sandbox ? " switcher-title_active" : "")
              }
            >
              View Sandbox users
            </label>
            <Tip
              title="View Sandbox users"
              description="If enabled, only users with active or expired Sandbox subscription will be listed here. If disabled, these users will be hidden from this list."
            />
            <DefaultInput
              trimValue
              value={query}
              onChange={this.handleChangeQuery}
              className="input input_search input_255 input_blue users-search__input"
              placeholder="Search user by ID"
            />
          </div>
          <div className="clear" />
        </div>
        <div className="container-table container-table_users">
          <div className="oh">
            {!sandbox && (
              <Filters
                appId={this.props.match.params.appId}
                filters={filters}
                handleChangeFilters={this.handleChangeFilters}
                endpoint="customers"
              />
            )}
            <span
              className="users-export__label fr"
              onClick={this.handleToggleExportUsers}
            >
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
              <span className="va-middle">Export CSV</span>
            </span>
          </div>
          {openExport &&
            user_collaboration &&
            user_collaboration.role !== "member" && (
              <ExportModal
                appId={this.props.match.params.appId}
                handleToggleExportUsers={this.handleToggleExportUsers}
                parentState={this.state}
              />
            )}
          {openExport &&
            user_collaboration &&
            user_collaboration.role === "member" && (
              <ExportErrorModal
                handleToggleExportUsers={this.handleToggleExportUsers}
              />
            )}
          <table className="table users-table mt20">
            <thead>
              {!loading && customers.length > 0 && (
                <tr className="table100-head">
                  <th
                    className={
                      "column1 container-table__clickable " +
                      (sortBy === "user_id" &&
                        " container-table__clickable_active")
                    }
                    onClick={this.handleChangeSortBy.bind(null, "user_id")}
                  >
                    <span>USER ID</span>
                    {sortBy !== "user_id" ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M4 7L8 3L12 7H4Z" fill="#97ADC6" />
                        <path d="M4 9L8 13L12 9H4Z" fill="#97ADC6" />
                      </svg>
                    ) : (
                      <Aux>
                        {order ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M4 10L8 6L12 10H4Z" fill="#0085FF" />
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 7L8 11L4 7L12 7Z" fill="#0085FF" />
                          </svg>
                        )}
                      </Aux>
                    )}
                  </th>
                  <th className="column2">PURCHASES</th>
                  <th className={"column4 container-table__clickable " + (sortBy === "total_spent" && " container-table__clickable_active")}
                      onClick={this.handleChangeSortBy.bind(null, "total_spent")}>
                    <span>TOTAL SPENT</span>
                    {sortBy !== "total_spent" ? (
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 7L8 3L12 7H4Z" fill="#97ADC6" />
                          <path d="M4 9L8 13L12 9H4Z" fill="#97ADC6" />
                        </svg>
                    ) : (
                        <Aux>
                          {order ? (
                              <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 10L8 6L12 10H4Z" fill="#0085FF" />
                              </svg>
                          ) : (
                              <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 7L8 11L4 7L12 7Z" fill="#0085FF" />
                              </svg>
                          )}
                        </Aux>
                    )}
                  </th>
                  <th
                    className={
                      "column4 container-table__clickable " +
                      (sortBy === "created_at" &&
                        " container-table__clickable_active")
                    }
                    onClick={this.handleChangeSortBy.bind(null, "created_at")}
                  >
                    <span>CREATED AT</span>
                    {sortBy !== "created_at" ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M4 7L8 3L12 7H4Z" fill="#97ADC6" />
                        <path d="M4 9L8 13L12 9H4Z" fill="#97ADC6" />
                      </svg>
                    ) : (
                      <Aux>
                        {order ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M4 10L8 6L12 10H4Z" fill="#0085FF" />
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 7L8 11L4 7L12 7Z" fill="#0085FF" />
                          </svg>
                        )}
                      </Aux>
                    )}
                  </th>
                  <th
                    className={
                      "column4 container-table__clickable " +
                      (sortBy === "last_seen_at" &&
                        " container-table__clickable_active")
                    }
                    onClick={this.handleChangeSortBy.bind(null, "last_seen_at")}
                  >
                    <span>LAST SEEN</span>
                    {sortBy !== "last_seen_at" ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M4 7L8 3L12 7H4Z" fill="#97ADC6" />
                        <path d="M4 9L8 13L12 9H4Z" fill="#97ADC6" />
                      </svg>
                    ) : (
                      <Aux>
                        {order ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M4 10L8 6L12 10H4Z" fill="#0085FF" />
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 7L8 11L4 7L12 7Z" fill="#0085FF" />
                          </svg>
                        )}
                      </Aux>
                    )}
                  </th>
                </tr>
              )}
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td>
                    <div className="animated-background timeline-item" />
                  </td>
                  <td>
                    <div className="animated-background timeline-item" />
                  </td>
                  <td>
                    <div className="animated-background timeline-item" />
                  </td>
                  <td>
                    <div className="animated-background timeline-item" />
                  </td>
                  <td>
                    <div className="animated-background timeline-item" />
                  </td>
                </tr>
              )}

              {!loading &&

                customers.map((customer, index) => (
                  <tr
                    onClick={this.goToUser.bind(null, customer.id)}
                    key={customer.id}
                  >
                    <td className="column1">
                      <NavLink
                        className="link link_normal"
                        to={
                          `/apps/${this.props.match.params.appId}/users/` +
                          customer.id
                        }
                      >
                        <span className="column-value column-value_100">
                          {customer.user_id}
                        </span>
                      </NavLink>
                    </td>
                    <td className="column2">
                      {this.filterSubscriptions(customer.subscriptions)
                        .length === 0 && (
                          <span className="tag tag_silver">None</span>
                        )}
                      {this.filterSubscriptions(customer.subscriptions).map(
                        (subscription) => {
                          console.log('subscription:: ', subscription);
                          return (
                            <div
                              className="container-table__column-item"
                              key={subscription.id}
                            >
                            <span className="container-table__column-item__group-name">
                              {subscription.kind === "nonrenewable"
                                ? "Non renewing purchases :"
                                : subscription.product_group_name ? `${subscription.product_group_name} :` : null}
                            </span>
                              <div className="container-table__column-info">
                                {subscription.kind === "nonrenewable" ? (
                                  Object.keys(subscription.productIds).map(
                                    (key) => (
                                      <span
                                        key={key}
                                        className={
                                          "tag tag_black tag_integration " +
                                          (parseInt(
                                            subscription.productIds[key],
                                            10
                                          ) > 1 && " tag_count")
                                        }
                                      >
                                      {parseInt(
                                        subscription.productIds[key],
                                        10
                                      ) > 1 && (
                                        <span className="tag-count">
                                            {subscription.productIds[key]}x
                                          </span>
                                      )}
                                        {key}
                                    </span>
                                    )
                                  )
                                ) : (
                                  <Aux>
                                  <span
                                    className={this.currentSubscriptionTagClass(
                                      subscription.status
                                    )}
                                  >
                                    {subscription.status}
                                  </span>
                                    {subscription.autorenew_enabled ? (
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
                                    ) : (
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
                                          x="6.37866"
                                          y="6.99332"
                                          width="1"
                                          height="5"
                                          transform="rotate(-45 6.37866 6.99332)"
                                          fill="#FF0C46"
                                        />
                                        <rect
                                          x="6.37866"
                                          y="9.82175"
                                          width="5"
                                          height="1"
                                          transform="rotate(-45 6.37866 9.82175)"
                                          fill="#FF0C46"
                                        />
                                      </svg>
                                    )}
                                  </Aux>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </td>
                    <td className="column4">
                      {parseFloat(customer.total_spent).toFixed(2)} USD
                    </td>
                    <td className="column4">
                      <Aux>
                        <Moment
                          className="uppercase"
                          format="MMM DD, HH:mm"
                          date={moment(customer.created_at, "YYYY-MM-DD HH:mm")}
                        />{" "}
                        UTC
                        <br />
                        <span className="small-text">
                          <Moment
                            className="uppercase"
                            format="MMM DD, HH:mm"
                            date={customer.created_at}
                          />{" "}
                          {moment.tz(moment.tz.guess()).format("z")}
                        </span>
                      </Aux>
                    </td>
                    <td className="column4">
                      <Aux>
                        <Moment
                          className="uppercase"
                          format="MMM DD, HH:mm"
                          date={moment(
                            customer.last_seen_at,
                            "YYYY-MM-DD HH:mm"
                          )}
                        />{" "}
                        UTC
                        <br />
                        <span className="small-text">
                          <Moment
                            className="uppercase"
                            format="MMM DD, HH:mm"
                            date={customer.last_seen_at}
                          />{" "}
                          {moment.tz(moment.tz.guess()).format("z")}
                        </span>
                      </Aux>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!loading && customers.length === 0 && (
            <div className="ta-center empty-label">
              <img
                src={imageWaiting}
                className="empty-label__image"
                alt="No users"
                width="540px"
              />
              <div className="empty-label__title">No users found</div>
              {/* <div className="empty-label__description">Please, integrate and configure Apphud SDK</div>
              <a className="empty-label__link" href="https://icons8.com/" target="_blank">Illustration by Icons8</a> */}
            </div>
          )}
          {lazyLoad && (
            <div>
              <div className="animated-background timeline-item" />
              <div className="animated-background timeline-item__row" />
            </div>
          )}
        </div>
      </div>
    )
  }
}

Users.displayName = "users"

const mapStateToProps = (state) => {
  return {
    customers: state.customers,
    application: state.application
  }
}

const mapDispatchToProps = {
  fetchCustomersRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(Users)
