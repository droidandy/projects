import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import SweetAlert from "react-swal"
import axios from "axios"
import Modal from "react-modal"
import CustomSelect from "../../Common/CustomSelect"
import history from "../../../history"

import ScreensConfiguredItem from "./ScreensConfiguredItem"
import ScreensBuilder from "./ScreensBuilder"
import ResultModal from "../../Common/ResultModal"
import RulesConfirmsModal from "../Rules/RulesConfirmsModal"

import imageWaiting from "../../../assets/images/rules-empty.jpg"
import imageSearching from "../../../assets/images/image-searching.jpg"
import {track} from "../../../libs/helpers";

const screensTypes = [
  { label: "All screens", value: "all" },
  // {label: 'Initial purchase', value: 'purchase'},
  { label: "Promo offer", value: "promo" },
  { label: "Survey", value: "survey" },
  { label: "Feedback", value: "feedback" },
  { label: "Billing issue", value: "billing_issue" },
  { label: "Archive", value: "archive" }
]

class Screens extends Component {
  state = {
    screens: [],
    appScreensLoading: true,
    alertOpen: false,
    unarchiveAlertOpen: false,
    screensBuilder: false,
    screenId: "new",
    confirmModal: {
      title: "",
      description: "",
      onConfirm: () => { },
      confirmButtonText: "",
      open: false
    },
    resultModal: {
      title: "",
      description: "",
      open: false
    }
  };

  allScreens = [];

  componentDidMount() {
    document.title = "Apphud | Purchase screens"
    this.getAppScreens()
  }

  filterScreens = (screensType) => {
    if (screensType.indexOf("all") > -1) { return this.allScreens.filter((screen) => screen.status !== "archived") } else if (screensType === "archive") { return this.allScreens.filter((screen) => screen.status === "archived") } else {
      return this.allScreens.filter(
        (screen) => screen.kind === screensType && screen.status !== "archived"
      )
    }
  };

  getAppScreens = () => {
    const { appId, screensType } = this.props.match.params
    this.setState({ appScreensLoading: true })

    axios.get(`/apps/${appId}/screens`).then((response) => {
      const screens = response.data.data.results
      this.allScreens = screens
      this.setState({
        screens: this.filterScreens(screensType),
        appScreensLoading: false
      })
    })
  };

  duplicate = (screen) => {
    const { screens } = this.state;
    const { appId, screensType } = this.props.match.params

    const copyScreenName = screen.name.replace(/\(\d+\)$/, '').trim();

    const db_id = screen.db_id

    const copyCount = screens.reduce((sum, screen) => screen.name.includes(copyScreenName) ? ++sum : sum, 0)

    screen = JSON.parse(JSON.stringify(screen))
    screen.name = copyCount === 0 ? copyScreenName : `${copyScreenName} (${copyCount})`
    delete screen.id
    delete screen.db_id

    this.setState({
      confirmModal: {
        type: "duplicate",
        title: "Duplicate screen?",
        description: "",
        confirmButtonText: "Duplicate",
        onConfirm: () => {
          axios
            .post(`/apps/${appId}/screens`, { ...screen, template_id: db_id })
            .then((response) => {
              const screen = response.data.data.results
              axios.get(`/apps/${appId}/screens`).then((response) => {
                this.allScreens = response.data.data.results
                this.setState(
                  {
                    screens: this.filterScreens(screensType),
                    appScreensLoading: false
                  },
                  this.closeConfirmModal
                )
              })
            })
        },
        show: true
      }
    })
  };

  getScreen = (screenId, cb) => {
    axios.get(`/screens/${screenId}`).then((response) => {
      const screen = response.data.data.results
      cb(screen)
    })
  };

  archiveScreen = ({ id }) => {
    const { appId } = this.props.match.params
    this.getScreen(id, (screen) => {
      const activeRules = screen.rules.filter((e) => e.state !== "archived");
      if (activeRules.length > 0) {
        const description = (
          <div>
            This screen is currently being used in rules ({screen.rules.length}
            ):{" "}
            {screen.rules.map((rule, index) => (
              <span key={index}>
                {screen.rules.length === 1 ? "" : ", "}
                <NavLink
                  target="_blank"
                  className="link link_normal"
                  to={`/apps/${appId}/newrules/all/${rule.id}/configure/3`}
                >
                  {rule.name}
                </NavLink>
              </span>
            ))}
            . Remove screen from these rules before.
          </div>
        )

        this.showResultModal({
          title: "Can not archive screen",
          description
        })
      } else {
        this.screenIdToRemove = id
        this.setState({ alertOpen: true })
      }
    })
  };

  unarchiveScreen = ({ id }) => {
    this.screenIdToRemove = id
    this.setState({
      confirmModal: {
        type: "unarchive",
        title: "Unarchive screen?",
        description: "",
        confirmButtonText: "Unarchive",
        onConfirm: () => {
          this.handleCallbackConfirmArchive(true, () => {
            this.closeConfirmModal()
          })
        },
        show: true
      }
    })
  };

  handleCallbackConfirmArchive = (value, cb = () => { }) => {
    this.setState({ alertOpen: false })
    const { screensType } = this.props.match.params

    if (value) {
      axios
        .put(`/screens/${this.screenIdToRemove}/archive`)
        .then((response) => {
          const screen = this.allScreens.find(
            (s) => s.id === this.screenIdToRemove
          )
          Object.assign(screen, response.data.data.results)
          this.setState({ screens: this.filterScreens(screensType) })
          cb()
        })
        .catch((_error) => {
          cb()
        })
    }
  };

  closeConfirmModal = () => {
    this.setState({
      confirmModal: {
        type: "",
        title: "",
        description: "",
        confirmButtonText: "",
        onConfirm: () => { },
        show: false
      }
    })
  };

  showResultModal = ({ title, description }) => {
    this.setState({ resultModal: { title, description, show: true } })
  };

  closeResultModal = () => {
    this.setState({ resultModal: { title: "", description: "", show: false } })
  };

  handleChangeScreenType = (item) => {
    const { appId } = this.props.match.params

    history.push(`/apps/${appId}/screens/${item.value}`)
    this.setState({ screens: this.filterScreens(item.value) })
  };

  handleOpenScreensBuilder = (screenId) => {
    this.setState({ screensBuilder: true, screenId })
  };

  handleCloseScreensBuilder = () => {
    this.setState({ screensBuilder: false }, this.getAppScreens)
    track("screen_create_exited");
  };

  getScreensType = () => {
    const currentScreensType = screensTypes.find(
      (item) => this.props.match.params.screensType.indexOf(item.value) > -1
    )

    if (currentScreensType) return currentScreensType
    else return {}
  };

  render() {
    const {
      screens,
      appScreensLoading,
      screensBuilder,
      screenId,
      resultModal,
      alertOpen,
      confirmModal
    } = this.state

    const { screensType, appId } = this.props.match.params

    return (
      <div className="container-content container-content__white">
        <SweetAlert
          isOpen={alertOpen}
          type="warning"
          title={"Archive screen?"}
          text="You can unarchive this screen later."
          confirmButtonText="Archive"
          cancelButtonText="Cancel"
          callback={this.handleCallbackConfirmArchive}
        />
        {confirmModal.show && (
          <RulesConfirmsModal
            type={confirmModal.type}
            title={confirmModal.title}
            description={confirmModal.description}
            confirmButtonText={confirmModal.confirmButtonText}
            onConfirm={confirmModal.onConfirm}
            onCancel={() => { }}
            cancelButtonText="Cancel"
            close={this.closeConfirmModal}
          />
        )}
        {resultModal.show && (
          <ResultModal
            title={resultModal.title}
            description={resultModal.description}
            close={this.closeResultModal}
            onConfirm={this.closeResultModal}
          />
        )}
        <div className="container-top">
          <div className="fl">
            <div className="container-title container-title_withdescription">
              <CustomSelect
                value={this.getScreensType()}
                onChange={this.handleChangeScreenType}
                labelKey="label"
                valueKey="value"
                options={screensTypes}
              />
            </div>
            <div className="container-description">
              Create screens in the editor without coding to use them in
              rules.&nbsp;
              <a
                className="link link_normal"
                href="https://docs.apphud.com/rules-and-screens/screens"
                target="blank"
                onClick={() => track("screens_learn_more_link_clicked")}
              >
                Learn more
              </a>
              <div className="container-tutorial__link">
                <a
                  className="container-tutorial__link-item"
                  href={`/apps/${appId}/screens/all?product_tour_id=99307`}
                >
                  <svg
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.58579 2.5H1.5C1.22386 2.5 1 2.72386 1 3V10C1 10.2761 1.22386 10.5 1.5 10.5H4.58579C4.851 10.5 5.10536 10.6054 5.29289 10.7929L6 11.5L6.70711 10.7929C6.89464 10.6054 7.149 10.5 7.41421 10.5H10.5C10.7761 10.5 11 10.2761 11 10V3C11 2.72386 10.7761 2.5 10.5 2.5H7.41421C7.149 2.5 6.89464 2.60536 6.70711 2.79289L6 3.5L5.29289 2.79289C5.10536 2.60536 4.851 2.5 4.58579 2.5ZM3 5H5V5.5H3V5ZM9 5H7V5.5H9V5ZM7 6.5H10V7H7V6.5ZM10 8H7V8.5H10V8ZM2 8H5V8.5H2V8ZM5 6.5H2V7H5V6.5Z"
                      fill="#F6921D"
                    />
                  </svg>
                  <span>View interactive tutorial</span>
                </a>
              </div>
            </div>
          </div>
          <button
            className="fr button button_green button_160"
            onClick={this.handleOpenScreensBuilder.bind(null, "new")}
          >
            <span>Build new screen</span>
          </button>
          <div className="clear" />
        </div>
        <div className="container-table container-table_ps">
          {screensBuilder && (
            <ScreensBuilder
              appId={appId}
              screenId={screenId}
              availableKinds={[]}
              handleCloseScreensBuilder={this.handleCloseScreensBuilder}
            />
          )}
          {(appScreensLoading || screens.length > 0) && (
            <div className="purchase-screens__configured">
              {appScreensLoading && (
                <div
                  className="animated-background timeline-item"
                  style={{ width: 320, height: 570, marginBottom: 30 }}
                />
              )}
              {!appScreensLoading &&
                screens.map((screen, index) => (
                  <ScreensConfiguredItem
                    screensType={screensType}
                    options={true}
                    key={index}
                    screen={screen}
                    screenStatus={screen.status}
                    archive={this.archiveScreen}
                    unarchive={this.unarchiveScreen}
                    duplicate={this.duplicate}
                    appId={this.props.match.params.appId}
                    handleOpenScreensBuilder={this.handleOpenScreensBuilder}
                  />
                ))}
            </div>
          )}
          {!appScreensLoading && screens.length === 0 && (
            <div className="ta-center empty-label">
              {screensType.indexOf("all") > -1 && (
                <div>
                  <img
                    src={imageWaiting}
                    className="empty-label__image"
                    alt="No rules"
                    width="540px"
                    height="350px"
                  />
                  <div className="empty-label__title">No screens created</div>
                  <div className="empty-label__description">
                    <button
                      className="button button_green button_255"
                      onClick={this.handleOpenScreensBuilder.bind(null, "new")}
                    >
                      Build new screen
                    </button>
                  </div>
                </div>
              )}
              {screensType === "archive" && (
                <div>
                  <img
                    src={imageSearching}
                    className="empty-label__image"
                    alt="No rules"
                    width="540px"
                    height="350px"
                  />
                  <div className="empty-label__title">Archive is empty</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Screens)
