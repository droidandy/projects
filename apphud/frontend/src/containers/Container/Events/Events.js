import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import history from "../../../history"
import Aux from "../../../hoc/Aux"
import { fetchEventsRequest } from "../../../actions/events"
import Moment from "react-moment"
import NumberFormat from "react-number-format"
import { throttle, uniq } from "lodash"
import Tip from "../../Common/Tip"
import $ from "jquery"
import {generatePeriod, getDateFromURI, setDateToURI, track} from "../../../libs/helpers"
import DateRangePicker from "../../Common/DateRangePicker"
import axios from "axios"
import titleize from "titleize"
import Tooltip from "rc-tooltip"
import UserFeedItemsIntegrationsStatus from "../Users/UsersShow/UserFeedItemsIntegrationsStatus"
import imageWaiting from "../../../assets/images/image-desert.jpg"
import Filters from "../../Common/Filters/Filters2"
import DefaultInput from "components/DefaultInput"

const DEFAULT_ACTIVE_FIELDS = [
  { id: "event_name", original_id: "kind", active: true, label: "Event" },
  { id: "time", original_id: "created_at", active: true, label: "Time" },
  { id: "paywall", original_id: "paywall", active: true, label: "Paywall" },
  { id: "product", original_id: "product", active: true, label: "Product ID" },
  {
    id: "product_group",
    original_id: "product_group",
    active: false,
    label: "Group ID"
  },
  {
    id: "transaction_id",
    original_id: "transaction_id",
    active: false,
    label: "Transaction ID"
  },
  {
    id: "revenue",
    original_id: "price_usd",
    active: true,
    label: "Gross Revenue"
  },
  { id: "country", original_id: "country", active: false, label: "Country" },
  {
    id: "integrations_sent",
    original_id: "integrations_sent",
    active: true,
    label: "Integrations"
  },
  { id: "user_id", original_id: "user_id", active: true, label: "User ID" }
]

const moment = require("moment-timezone")

class Events extends Component {
  state = {
    loading: true,
    events: [],
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
    currentPeriod: getDateFromURI("events"),
    activeCols: []
  };

  fetchOptionsRequest = (cb) => {
    const { appId } = this.props.match.params

    axios.get(`/apps/${appId}/events/options`).then((result) => {
      cb(result.data.data)
    })
  };

  setDefaultActiveFields = (force = false) => {
    const { activeCols } = this.state
    const savedActiveFields = JSON.parse(
      localStorage.getItem("events.activeFields")
    )

    if (activeCols.length === 0 && !force) {
      this.setState({
        activeCols: JSON.parse(
          JSON.stringify(savedActiveFields || DEFAULT_ACTIVE_FIELDS)
        )
      })
    }
    const hasPaywall = savedActiveFields && savedActiveFields.findIndex((e) => e.id === "paywall") !== -1;

    if (force || !hasPaywall) {
      this.setState({
        activeCols: JSON.parse(JSON.stringify(DEFAULT_ACTIVE_FIELDS))
      })
      localStorage.setItem(
        "events.activeFields",
        JSON.stringify(DEFAULT_ACTIVE_FIELDS)
      )
    }
  };

  componentDidMount() {
    const sandbox =
      localStorage.getItem("events.sandbox") === null
        ? 0
        : parseInt(localStorage.getItem("events.sandbox"), 10)
    const sortBy =
      localStorage.getItem("events.sortBy") === null
        ? "created_at"
        : localStorage.getItem("events.sortBy")
    const order =
      localStorage.getItem("events.order") === null
        ? false
        : JSON.parse(localStorage.getItem("events.order"))
    const filters =
      localStorage.getItem("events.filters") === null
        ? []
        : JSON.parse(localStorage.getItem("events.filters"))

    this.setDefaultActiveFields()

    this.setState(
      {
        loading: true,
        events: [],
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
        this.getEvents(this.props, 0, true)
      }
    )

    this.attachScrollListener()
    document.title = "Apphud | App events"
  }

  componentWillUnmount() {
    this.detachScrollListener()
  }

  fetchEventsRequest = ({ paramsString, appId }, cb) => {
    axios.get(`/apps/${appId}/events?${paramsString}`).then((result) => {
      cb(result.data.data)
    })
  };

  getEvents = (
    props = this.props,
    offset = 0,
    refresh = false,
    cb = () => { }
  ) => {
    const {
      events,
      meta,
      limit,
      sortBy,
      order,
      query,
      filters,
      currentPeriod,
      activeCols
    } = this.state
    let { start_time, end_time } = currentPeriod
    const sandbox =
      localStorage.getItem("events.sandbox") === null
        ? 0
        : parseInt(localStorage.getItem("events.sandbox"), 10)


    if (offset === 0) this.setState({ loading: true, reachedBottom: false })
    else this.setState({ lazyLoad: true })

    if (query) {
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
      end_time,
      fields: activeCols.filter((col) => col.active).map((col) => col.id)
    }

    if (!sandbox) {
      for (const filter of filters) {
        params[filter.value] = filter.equal
      }
    }

    if (query) params = { q: query, start_time, end_time, sandbox }

    const paramsString = $.param(params)

    this.fetchEventsRequest(
      { paramsString, appId: props.match.params.appId },
      (result) => {
        const newEvents = result.results

        if (offset === 0) {
          this.setState({
            loading: false,
            meta: result.meta,
            events: newEvents
          })
        } else {
          this.setState((state) => {
            const oldevents = state.events
            const unionCustomers = [...oldevents, ...newEvents]

            return {
              lazyLoad: false,
              meta: result.meta,
              events: unionCustomers,
              reachedBottom: newEvents.length === 0
            }
          })
        }
        cb()
      }
    )
  };

  atPageBottom = () => {
    this.setState(
      {
        offset: this.state.offset + 20
      },
      () => {
        if (!this.state.reachedBottom) this.getEvents(this.props, this.state.offset)
      }
    )
  };

  listener = throttle(this.scrollListener, 200).bind(this);

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
        !this.state.reachedBottom
      ) { this.atPageBottom() }
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

  refresh = (cb) => {
    window.scrollTo(0, 0)
    this.setState(
      {
        lazyLoad: false,
        offset: 0
      },
      () => {
        this.getEvents(this.props, 0, true, cb)
      }
    )
  };

  goToUser = (userId, e) => {
    const url = `/apps/${this.props.match.params.appId}/events/` + userId
    e.preventDefault()

    if (e.metaKey || e.ctrlKey) window.open(url, "_blank")
    else history.push(url)
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.appId !== nextProps.match.params.appId) {
      this.setState(
        {
          loading: true,
          events: [],
          offset: 0,
          allLoaded: false,
          sortBy: "created_at",
          order: false,
          meta: {
            total_count: 0
          }
        },
        () => {
          this.getEvents(nextProps)
        }
      )
    }
  }

  handleChangeSortBy = (column) => {
    let order = !this.state.order

    if (column !== this.state.sortBy) order = false

    localStorage.setItem("events.sortBy", column)
    localStorage.setItem("events.order", order)

    this.setState({ sortBy: column, order }, this.refresh)

    track("events_table_column_sorted",{ column, order });
  };

  currentSubscriptionTagClass = (status) => {
    return classNames("tag capitalize", {
      tag_red: ["refunded", "expired"].indexOf(status) > -1,
      tag_green: ["active", "intro", "promo", "regular"].indexOf(status) > -1,
      tag_orange: ["trial", "grace"].indexOf(status) > -1,
      tag_silver: status === "none"
    })
  };

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
  };

  handleChangeSandbox = ({ target }) => {
    const sandbox = target.checked ? 1 : 0
    localStorage.setItem("events.sandbox", sandbox)
    this.setState({ sandbox }, this.refresh)
    track("events_sandbox_switch_changed", { value: sandbox});
  };

  handleChangeQuery = ({ target }) => {
    this.setState({ query: target.value }, () => {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.getEvents(this.props, 0, true)
      }, 1000)
    })
    track("events_searched", { query: target.value});
  };

  handleChangeFilters = (filters) => {
    localStorage.setItem("events.filters", JSON.stringify(filters))
    this.setState({ filters }, this.refresh)
    track("events_filter_selected", filters);
  };

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
          setDateToURI(startDate, endDate, "events")
        }
      )
    }
    track("events_date_range_changed", {
      start_time: startDate?.format("YYYY-MM-DD HH:mm:ss"),
      end_time: endDate?.format("YYYY-MM-DD HH:mm:ss")
    })
  };

  onChangeField = (index, e) => {
    const activeCols = JSON.parse(JSON.stringify(this.state.activeCols))

    activeCols[index].active = e.target.checked

    if (activeCols.filter((c) => c.active).length > 0) {
      localStorage.setItem("events.activeFields", JSON.stringify(activeCols))
      this.setState({ activeCols }, this.refresh)
    }

    track("events_table_columns_changed");
  };

  rowsPopup = () => {
    const { activeCols } = this.state

    return (
      <div
        className="tip-content tip-content_right tip-content_right2"
        ref="content"
      >
        <div className="container-content__events-popup__checkboxes">
          {activeCols.map((item, index) => (
            <div
              className="container-content__events-settings__content-inputs__checkbox ta-left"
              key={index}
            >
              <input
                id={item.id}
                onChange={this.onChangeField.bind(null, index)}
                checked={item.active}
                type="checkbox"
                className="checkbox"
              />
              <label
                htmlFor={item.id}
                title={item.label}
                className="checkbox-label-wrapper"
              >
                <div className="checkbox-label checkbox-label_small fl">
                  <svg
                    width="11px"
                    className="icon-check"
                    height="8px"
                    viewBox="0 0 11 8"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs></defs>
                    <g
                      id="Symbols"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <g
                        id="ui/check-on"
                        transform="translate(-3.000000, -4.000000)"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      >
                        <g id="Shape">
                          <polyline points="13 5 7 11 4 8"></polyline>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <span className="label-text">{item.label}</span>
              </label>
            </div>
          ))}
        </div>
        <div className="container-content__events-popup__footer">
          <span className="fl">
            {activeCols.filter((c) => c.active).length +
              "/" +
              activeCols.length}
          </span>
          <span
            className="cp fr link link_normal"
            onClick={() => {
              track("events_table_columns_reset");
              this.setDefaultActiveFields.call(null, true);
            }}
          >
            Reset
          </span>
        </div>
      </div>
    )
  };

  render() {
    const {
      meta,
      sandbox,
      loading,
      events,
      sortBy,
      order,
      lazyLoad,
      filters,
      currentPeriod,
      activeCols
    } = this.state
    const { match } = this.props
    const { appId } = match.params

    return (
      <div className="container-content container-content__white">
        <div className="container-top">
          <div className="fl">
            <div className="container-title container-title_withdescription">
              Events
            </div>
            <div className="container-description">
              <span className="container-description__users-label">
                Event occured in
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
              View Sandbox events only
            </label>
            <Tip
              title="View Sandbox events only"
              description="If enabled, only Sandbox subscriptions events will be listed here. If disabled, these events will be hidden from this list."
            />
            <DefaultInput
              trimValue
              onChange={this.handleChangeQuery}
              className="input input_search input_255 input_blue users-search__input"
              placeholder="Search by User or Transaction ID"
            />
          </div>
          <div className="clear" />
        </div>
        <div className="container-table container-table_events">
          <div className="oh">
            <Filters
              appId={this.props.match.params.appId}
              filters={filters}
              handleChangeFilters={this.handleChangeFilters}
              endpoint="events"
            />
          </div>
          <div className="container-table_events-table">
          {events.length > 0 &&
              <Tooltip
                className="events-tooltip"
                mouseEnterDelay={0.1}
                placement="left"
                align={{ points: ["tr", "tr"], offset: [17, 29] }}
                trigger={["click"]}
                overlay={this.rowsPopup()}
              >
                <svg
                  className="va-middle cp"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1 5H15V7H1V5ZM1 3V1H12V3H1ZM5 11H1V9H5V11ZM10.7071 14.7071L15.2071 10.2071L13.7929 8.79289L10 12.5858L7.70711 10.2929L6.29289 11.7071L9.29289 14.7071L10 15.4142L10.7071 14.7071Z"
                    fill="#0085FF"
                  />
                </svg>
              </Tooltip>
            }
            <table className="table users-table mt20 table_nopointer">
              <thead>
                {!loading && events.length > 0 && (
                  <tr className="table100-head">
                    {activeCols
                      .filter((col) => col.active)
                      .map((col) => (
                        <th
                          className={
                            " container-table__clickable " +
                            (sortBy === col.id &&
                              " container-table__clickable_active")
                          }
                          onClick={this.handleChangeSortBy.bind(null, col.id)}
                          key={col.id}
                        >
                          <span className="uppercase">{col.label}</span>
                          {sortBy !== col.id ? (
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
                                  <path
                                    d="M12 7L8 11L4 7L12 7Z"
                                    fill="#0085FF"
                                  />
                                </svg>
                              )}
                            </Aux>
                          )}
                        </th>
                      ))}
                    <th style={{ padding: 10, width: 20 }}>&nbsp;</th>
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
                  events.map((event, index) => (
                    <tr key={event.id}>
                      {activeCols
                        .filter((col) => col.active)
                        .map((col) => (
                          <td key={col.original_id}>
                            {col.original_id === "kind" ? (
                              <span className="column-value column-value_100">
                                {event.kind &&
                                  titleize(event.kind).replace(/_/g, " ")}
                              </span>
                            ) : col.original_id === "created_at" ? (
                              <Aux>
                                <Moment
                                  className="uppercase"
                                  format="MMM DD, HH:mm"
                                  date={moment(
                                    event.created_at,
                                    "YYYY-MM-DD HH:mm"
                                  )}
                                />{" "}
                                UTC
                                <br />
                                <span className="small-text">
                                  <Moment
                                    className="uppercase"
                                    format="MMM DD, HH:mm"
                                    date={event.created_at}
                                  />{" "}
                                  {moment.tz(moment.tz.guess()).format("z")}
                                </span>
                              </Aux>
                            ) : col.original_id === "product" ? (
                              event.properties?.product_id || event.product
                            ) : col.original_id === "price_usd" ? (
                              <Aux>
                                <span
                                  className={
                                    event.price_usd > 0
                                      ? "text-green"
                                      : event.price_usd < 0
                                        ? "text-red"
                                        : ""
                                  }
                                >
                                  {event.price_usd > 0 ? "+" : ""}
                                </span>
                                <NumberFormat
                                  className={
                                    event.price_usd > 0
                                      ? "text-green"
                                      : event.price_usd < 0
                                        ? "text-red"
                                        : ""
                                  }
                                  value={parseFloat(
                                    parseFloat(event.price_usd).toFixed(2)
                                  )}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  prefix={"$"}
                                />
                              </Aux>
                            ) : col.original_id === "integrations_sent" ? (
                              <Aux>
                                {event.integrations_sent &&
                                  Object.keys(event.integrations_sent).length >
                                  0 && (
                                    <UserFeedItemsIntegrationsStatus
                                      appId={appId}
                                      event={event}
                                      integrationsSent={event.integrations_sent}
                                    />
                                  )}
                              </Aux>
                            ) : col.original_id === "user_id" ? (
                              <NavLink
                                target="_blank"
                                to={`/apps/${appId}/users/${event.customer_uid}`}
                                className="link link_normal"
                              >
                                {event.user_id}
                              </NavLink>
                            ) : col.original_id === "product_group" ? (
                              event.product_group
                            ) : col.original_id === "country" ? (
                              event.country
                            ) : col.original_id === "transaction_id" ? (
                              event.transaction_id
                            ) : col.original_id === "paywall" ? (
                              event.paywall
                            ) : (
                              <div />
                            )}
                          </td>
                        ))}
                      <td />
                    </tr>
                  )
                  )}
              </tbody>
            </table>
          </div>
          {!loading && events.length === 0 && (
            <div className="ta-center empty-label">
              <img
                src={imageWaiting}
                className="empty-label__image"
                alt="No users"
                width="540px"
              />
              <div className="empty-label__title">No events found</div>
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

Events.displayName = "events"

const mapStateToProps = (state) => {
  return {
    events: state.events,
    application: state.application
  }
}

const mapDispatchToProps = {
  fetchEventsRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(Events)
