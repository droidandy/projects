import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import CustomSelect from "../../Common/CustomSelect"
import { fetchApplicationsRequest } from "../../../actions/applications"
import { fetchApplicationRequest } from "../../../actions/application"
import { fetchRulesRequest } from "../../../actions/rules"
import history from "../../../history"
import {setAccountTimeZone} from "../../../actions/settings";
import TimeZoneSwitcher from "./TimeZoneSwitcher";
import LocalStorageService from "../../../libs/TokenService";
import axios from "axios";
import SearchAppInput from "./SearchAppInput";
import SwitchUserButton from "./SwitchUserButton";
import {track} from "../../../libs/helpers";

class TopPanel extends Component {
  state = {
    unseenCount: null
  };

  handleChangeProject = (item) => {
    var currentPath = history.location.pathname.replace(
      this.currentApplication().id,
      item.id
    )
    history.push(`/apps/${item.id}/dashboard`)
    this.props.fetchApplicationRequest(item.id)
    this.props.fetchRulesRequest({ appId: item.id })
    track("header_app_switched", item);
  };

  handleChangeTimeZone = (old_tz, tz) => {
    this.props.setAccountTimeZone(tz);
    track("header_timezone_changed", { tz });
  }

  componentDidMount() {
    if (window.Headway) {
      window.Headway.init({
        selector: "#headwayIcon",
        account: "x8Xqbx",
        position: {
          y: "bottom"
        },
        callbacks: {
          onWidgetReady: (widget) => {
            this.setState({ unseenCount: widget.getUnseenCount() })
          },
          onShowWidget: () => {
            track("header_notifications_clicked", this.state.unseenCount );
            this.setState({ unseenCount: 0 })
          }
        }
      })
    }
  }

  currentApplication = () => {
    var currentApp = this.props.applications.find(
      (app) => app.id === this.props.currentAppId
    )
    if (currentApp) return currentApp
    else return false
  };

  cacheIcon = (app) => {
    const image = new Image()
    image.src = app.icon_url
  };

  classes = () => {
    return classNames("container-top__panel", {
      "container-top__panel_overflow": this.props.disableMenu
    })
  };

  render() {
    const { user, settings, application } = this.props
    const { unseenCount } = this.state
    const switchUserToken = LocalStorageService.getSwitchUserToken();
    const currentApp = this.currentApplication();
    return (
      <div className={this.classes()}>
        {!this.props.disableMenu && (
          <div className="container-top__panel-left">
            { user?.status === "admin"
              && <SearchAppInput />
            }
            {this.props.applications.map(this.cacheIcon)}
            <CustomSelect
                value={currentApp}
                onChange={this.handleChangeProject}
                options={this.props.applications}
                withIcons={true}
                className="custom-select_apps"
                labelKey="name"
                valueKey="id"
            />
            <NavLink
              to="/newapp"
              className="link link_add container-top__panel-add__link"
            >
              <svg
                width="15"
                height="14"
                viewBox="0 0 15 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.0684 7C14.0684 10.866 10.9344 14 7.06842 14C3.20243 14 0.0684204 10.866 0.0684204 7C0.0684204 3.13401 3.20243 0 7.06842 0C10.9344 0 14.0684 3.13401 14.0684 7ZM8.06842 6H11.0684V8H8.06842V11H6.06842V8H3.06842V6H6.06842V3H8.06842V6Z"
                  fill="#20BF55"
                />
              </svg>
              <span>Add new app</span>
            </NavLink>
            <TimeZoneSwitcher
              value={settings.timezone}
              onChange={this.handleChangeTimeZone}
              options={application?.time_zone ? [application.time_zone] : []}
            />
          </div>
        )}
        <div className="fr">
          { !switchUserToken && user?.status === "admin"
            && <div
                className="link container-top__panel-link container-top__panel-link_alarm cp"
                id="headwayIcon">
              {unseenCount !== null && unseenCount > 0 ? (
                  <span
                      className={
                        "container-top__panel-link_alarm-badge " +
                        (unseenCount > 99 &&
                            " container-top__panel-link_alarm-badge_small")
                      }
                  >
                  {unseenCount}
                </span>
              ) : (
                  <svg
                      className="va-middle"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        d="M15 11V6C15 2.686 12.314 0 9 0C5.686 0 3 2.686 3 6V11C3 12.657 1.656 14 0 14V15H18V14C16.344 14 15 12.657 15 11Z"
                        fill="#0085FF"
                    />
                    <path
                        d="M6 16.5C6.60348 17.3925 7.71466 18 9 18C10.2853 18 11.3965 17.3925 12 16.5H6Z"
                        fill="#0085FF"
                    />
                  </svg>
              )}
            </div>
          }

          <a
            className="link container-top__panel-link"
            target="_blank"
            href="https://docs.apphud.com/"
            onClick={() => track("header_docs_link_clicked")}
          >
            Documentation
          </a>
          <a
            className="link container-top__panel-link"
            target="_blank"
            href="https://apphud.com/contact"
            onClick={() => track("header_help_link_clicked")}
          >
            Help
          </a>
          <a
            className="link container-top__panel-link"
            target="_blank"
            href="https://blog.apphud.com/"
            onClick={() => track("header_blog_link_clicked")}
          >
            Blog
          </a>
          <NavLink
            to="/profile/general"
            style={{ backgroundImage: `url(${user.avatar_url})` }}
            className="container-top__panel-avatar"
          ></NavLink>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions,
    applications: state.applications,
    application: state.application,
    settings: state.settings
  }
}

const mapDispatchToProps = {
  fetchApplicationsRequest,
  fetchApplicationRequest,
  fetchRulesRequest,
  setAccountTimeZone
}

export default connect(mapStateToProps, mapDispatchToProps)(TopPanel)
