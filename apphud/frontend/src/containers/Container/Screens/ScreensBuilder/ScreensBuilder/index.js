import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink, Prompt } from "react-router-dom"
import Tip from "../../../../Common/Tip"
import Liquid from "liquidjs"
import axios from "axios"
import history from "../../../../../history"
import classNames from "classnames"
import { NotificationManager } from "../../../../../libs/Notifications"
import {connectFont, track, uuidv4} from "../../../../../libs/helpers"
import Collapsible from "react-collapsible"
import Aux from "../../../../../hoc/Aux"

import ScreenImageUploader from "./ScreensBuilderSchemaFields/Settings/ScreenImageUploader"
import ColorPicker from "../../../../Common/ColorPicker"
import LanguageCustomSelect from "../../../../Common/LanguageCustomSelect"
import InputSelect from "../../../../Common/InputSelect"
import ScreensBuilderSchemaFields from "./ScreensBuilderSchemaFields/ScreensBuilderSchemaFields"
import ScreenPreview from "../../../../../components/Container/PurchaseScreens/PurchaseScreensEdit/ScreenPreview"
import ScreenPreviewDeviceSwitcher from "../../../../../components/Container/PurchaseScreens/PurchaseScreensEdit/ScreenPreviewDeviceSwitcher"

import { fetchApplicationRequest } from "../../../../../actions/application"
import { fetchProductGroupsRequest } from "../../../../../actions/productGroups"
import { fetchFontsRequest } from "../../../../../actions/fonts"
import $ from "jquery"

const devices = [
  {
    id: "iphone_5",
    width: "320px",
    height: "568px",
    icon:
      '<svg width="14" height="24" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 2C0 0.89543 0.895431 0 2 0H12C13.1046 0 14 0.895431 14 2V22C14 23.1046 13.1046 24 12 24H2C0.89543 24 0 23.1046 0 22V2ZM1 3H13V18H1V3ZM7 22.5C7.82843 22.5 8.5 21.8284 8.5 21C8.5 20.1716 7.82843 19.5 7 19.5C6.17157 19.5 5.5 20.1716 5.5 21C5.5 21.8284 6.17157 22.5 7 22.5Z" fill="#0085FF"/></svg>'
  },
  {
    id: "iphone_x",
    width: "375px",
    height: "812px",
    icon:
      '<svg width="14" height="24" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 2C0 0.89543 0.895431 0 2 0H12C13.1046 0 14 0.895431 14 2V22C14 23.1046 13.1046 24 12 24H2C0.89543 24 0 23.1046 0 22V2ZM2 3C2 2.44772 2.44772 2 3 2H4C4 2.55228 4.44772 3 5 3H9C9.55228 3 10 2.55228 10 2H11C11.5523 2 12 2.44772 12 3V21C12 21.5523 11.5523 22 11 22H3C2.44772 22 2 21.5523 2 21V3Z" fill="#0085FF"/></svg>'
  },
  {
    id: "ipad",
    width: "768px",
    height: "1024px",
    icon:
      '<svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 2C0 0.89543 0.895431 0 2 0H16C17.1046 0 18 0.895431 18 2V22C18 23.1046 17.1046 24 16 24H2C0.89543 24 0 23.1046 0 22V2ZM2 2H16V18H2V2ZM9 22.5C9.82843 22.5 10.5 21.8284 10.5 21C10.5 20.1716 9.82843 19.5 9 19.5C8.17157 19.5 7.5 20.1716 7.5 21C7.5 21.8284 8.17157 22.5 9 22.5Z" fill="#0085FF"/></svg>'
  }
]

const barColors = [
  { label: "Black", value: "black" },
  { label: "White", value: "white" }
]

class ScreensBuilder extends Component {
  state = {
    productGroups: [],
    screens: [],
    compiledHTML: "",
    currentDevice: devices[0],
    currentTab: "generalTab",
    settingsEnable: true,
    isBlocking: false,
    submitted: false,
    language: "",
    childUpdate: true,
    screenLoading: true,
    productOnTap: false,
    screen: {
      html: "",
      data: {},
      schema: [],
      css: "",
      name: "",
      active: false,
      db_id: "",
      preview_url: "",
      status_bar_color: "",
      background_color: "",
      font: ""
    }
  };

  setLanguageObjects = (screen, language = this.state.language) => {
    for (const schemaItem of screen.schema) {
      if (schemaItem.collection) {
        for (const field of schemaItem.fields) {
          if (["text", "textarea"].indexOf(field.type) > -1) {
            for (const dataItem of screen.data[schemaItem.slug]) {
              if (dataItem[field.id].constructor === String) {
                dataItem[field.id] = {
                  [language]: dataItem[field.id]
                }
              } else {
                if (!dataItem[field.id].hasOwnProperty(language)) {
                  dataItem[field.id][language] =
                    dataItem[field.id][Object.keys(dataItem[field.id])[0]]
                }
              }
            }
          }
        }
      } else {
        for (const field of schemaItem.fields) {
          if (["text", "textarea"].indexOf(field.type) > -1) {
            if (screen.data[schemaItem.slug][field.id].constructor === String) {
              screen.data[schemaItem.slug][field.id] = {
                [language]: screen.data[schemaItem.slug][field.id]
              }
            } else {
              if (
                !screen.data[schemaItem.slug][field.id].hasOwnProperty(language)
              ) {
                screen.data[schemaItem.slug][field.id][language] =
                  screen.data[schemaItem.slug][field.id][
                  Object.keys(screen.data[schemaItem.slug][field.id])[0]
                  ]
              }
            }
          }
        }
      }
    }

    return screen
  };

  setIdsToCollections = (screen) => {
    for (const schemaItem of screen.schema) {
      if (schemaItem.collection) {
        for (const item of screen.data[schemaItem.slug]) {
          if (!item.id) item.id = uuidv4()
        }
      }
    }

    return screen
  };

  getScreen = () => {
    const { screenId, user } = this.props
    const { language } = this.state

    this.setState({ screenLoading: true })
    axios.get(`/screens/${screenId}`).then((response) => {
      const screen = response.data.data.results
      this.setLanguageObjects(screen)
      this.setIdsToCollections(screen)
      document.title = `Edit screen ${screen.name}`
      this.setState({ screen }, this.compileHTML)
      setTimeout(() => {
        this.setState({ screenLoading: false })
      }, 1000)
    })
  };

  getAppScreens = () => {
    const { user } = this.props
    axios.get(`/apps/${this.props.appId}/screens`).then((response) => {
      const screens = response.data.data.results
      this.setState({ screens })
    })
  };

  saveScreen = () => {
    const params = this.state.screen
    this.setState({ creating: true })

    axios.put(`/screens/${params.id}`, params).then((response) => {
      this.setState({ creating: false })
      this.navigationUnblock()
      NotificationManager.success("Screen successfully saved", "OK", 5000)
    })
  };

  trackCreate = (screen) => {
    if (window.analytics) {
      const { user, application } = this.props

      window.segmentHelper.identify(
        user.id,
        {
          screen_created: true
        },
        {
          integrations: {
            All: true,
            Webhooks: false
          }
        }
      )
      window.analytics.track("screen_created", {
        screen_type: screen.kind,
        email: user.email,
        app_id: application.id,
        app_name: application.name,
        app_appstore_id: application.appstore_app_id
      })
    }
  };

  createScreen = () => {
    const { appId, user } = this.props
    const screen = JSON.parse(JSON.stringify(this.state.screen))
    const params = Object.assign({ template_id: screen.db_id }, screen)
    this.setState({ creating: true })

    delete params.id
    delete params.db_id

    axios.post(`/apps/${appId}/screens`, params).then((response) => {
      const { db_id, id, is_template } = response.data.data.results
      this.setState({ creating: false })
      this.navigationUnblock()
      NotificationManager.success("Screen successfully saved", "OK", 5000)
      this.setState({
        screen: Object.assign(screen, { db_id, id, is_template })
      })
      this.trackCreate(response.data.data.results)
    })
  };

  compileHTML = () => {
    const engine = new Liquid()

    engine.registerFilter("price", () => {
      return "x.xx USD"
    })
    const { language } = this.state
    const {
      html,
      css,
      data,
      schema,
      id,
      background_color,
      font,
      background_image
    } = JSON.parse(JSON.stringify(this.state.screen))
    const cssCode = `<style>${css}; html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,hr,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{font-family: -apple-system,
      BlinkMacSystemFont,
      Roboto,
      Helvetica Neue,
      sans-serif !important;}</style>`

    for (const schemaItem of schema) {
      if (schemaItem.collection) {
        for (const field of schemaItem.fields) {
          if (["text", "textarea"].indexOf(field.type) > -1) {
            for (const dataItem of data[schemaItem.slug]) {
              if (dataItem[field.id].constructor === Object) { dataItem[field.id] = dataItem[field.id][language] }
            }
          }
        }
      } else {
        for (const field of schemaItem.fields) {
          if (["text", "textarea"].indexOf(field.type) > -1) {
            if (data[schemaItem.slug][field.id].constructor === Object) {
              data[schemaItem.slug][field.id] =
                data[schemaItem.slug][field.id][language]
            }
          }
        }
      }
    }

    clearTimeout(this.compileTimeout)
    this.compileTimeout = setTimeout(() => {
      engine
        .parseAndRender(
          html + cssCode,
          Object.assign({}, data, {
            screen: { id, background_color, font, background_image }
          })
        )
        .then((compiledHtml) => {
          engine.parseAndRender(compiledHtml).then((compiledHtml) => {
            this.setState({
              compiledHtml: compiledHtml
            })
          })
        })
    }, 100)
  };

  componentWillUnmount() {
    window.onbeforeunload = null
  }

  navigationBlock = () => {
    if (window.ENV !== "development") {
      window.onbeforeunload = function () {
        return "Do you want to leave this page?"
      }
      this.setState({ isBlocking: true })
    }
  };

  navigationUnblock = () => {
    this.setState({ isBlocking: false })
    window.onbeforeunload = null
  };

  componentDidMount() {
    const {
      fetchApplicationRequest,
      fetchFontsRequest,
      fetchProductGroupsRequest,
      appId,
      application
    } = this.props
    window.scrollTo(0, 0)
    this.getAppScreens()
    this.setState({ language: application.default_locale }, this.getScreen)
    fetchFontsRequest({ limit: 30, offset: 0 })
    fetchProductGroupsRequest(appId, (productGroups) => {
      productGroups = productGroups.map((group) => {
        group.label = group.name
        group.options = group.products ? group.products : group.product_bundles.map(pb => pb.products).flat()
        group.options = group.options.map((option) => {
          option.label = option.product_id
          return option
        })
        return group
      })

      this.setState({
        productGroups: productGroups
      })
    })
  }

  changeFontsInData = (font) => {
    const screen = this.state.screen
    const { schema, data } = screen

    for (const schemaItem of schema) {
      for (const field of schemaItem.fields) {
        if (field.type === "font") {
          if (schemaItem.collection) {
            for (const item of data[schemaItem.slug]) {
              item[field.id] = font
            }
          } else data[schemaItem.slug][field.id] = font
        }
      }
    }

    this.setState({ screen })
  };

  handleChangeScreenProp = (prop, e) => {
    if (prop === "font") {
      connectFont(e.target.value)
      this.changeFontsInData(e.target.value)
    }

    const { screen } = this.state
    if(prop === "background_image") {
      screen["background_color"] = 'transparent'
    }

    screen[prop] = e.target.value
    this.setState({ screen }, this.compileHTML)
    this.navigationBlock()
  };

  handleChangeProductOnType = (productOnType) => {
    const newProductOnType = productOnType === undefined ? !this.state.productOnTap : productOnType;
    this.setState({ productOnTap: newProductOnType })
  }

  handleChangeData = (data) => {
    this.setState({ data }, this.compileHTML)
    this.navigationBlock()
  };

  isValid = () => {
    let isValid = true
    const { schema, data, name } = this.state.screen
    const { productOnTap } = this.state;
    const invalidLanguages = []

    schema.forEach((schemaItem) => {
      if (schemaItem.collection) {
        for (const field of schemaItem.fields) {
          for (const optionItem of data[schemaItem.slug]) {
            if (field.required && optionItem[field.id].toString().length === 0) { isValid = false }

            if (["text", "textarea"].indexOf(field.type) > -1) {
              if (field.required) {
                for (const key of Object.keys(optionItem[field.id])) {
                  if (!optionItem[field.id][key]) {
                    isValid = false
                    break
                  }
                }
                for (const key of Object.keys(optionItem[field.id])) {
                  if (!optionItem[field.id][key]) {
                    invalidLanguages.push(key)
                  }
                }
              }
            }

            if (field.required && field.type === "promo_offer") {
              if (
                !optionItem[field.id].product_id ||
                !optionItem[field.id].offer_id
              ) { isValid = false }
            }
          }
        }
      } else {
        for (const field of schemaItem.fields) {
          if (["text", "textarea"].indexOf(field.type) > -1) {
            if (field.required) {
              for (const key of Object.keys(data[schemaItem.slug][field.id])) {
                if (!data[schemaItem.slug][field.id][key]) {
                  isValid = false
                  break
                }
              }
              for (const key of Object.keys(data[schemaItem.slug][field.id])) {
                if (!data[schemaItem.slug][field.id][key]) {
                  invalidLanguages.push(key)
                }
              }
            }
          } else if (
            field.required &&
            data[schemaItem.slug][field.id].toString().length === 0
          ) { isValid = false }

          if (field.required && field.type === "promo_offer") {
            if (productOnTap) {
              if (!data[schemaItem.slug][field.id].product_id) {
                isValid = false
              }
            }
            else {
              if (!data[schemaItem.slug][field.id].product_id ||
                !data[schemaItem.slug][field.id].offer_id) { isValid = false }
            }
          }
        }
      }
    })

    this.setState({ invalidLanguages })

    return name && isValid
  };

  handleSubmit = () => {
    const { is_template } = this.state.screen
    this.setState({ submitted: true })

    if (this.isValid()) {
      if (is_template) this.createScreen()
      else this.saveScreen()
      this.setState({ submitted: false })
    } else {
      NotificationManager.error(
        "Please, fix issues marked with «!» sign to save",
        "Validation",
        5000
      )
    }
  };

  fieldClasses = (field) => {
    return classNames("input input_stretch input_blue", {
      input_error: this.state.submitted && !this.state.screen[field]
    })
  };

  selectClasses = (field) => {
    return classNames("input-select_blue", {
      select_error: this.state.submitted && !this.state.screen[field]
    })
  };

  handleChangeDevice = (e) => {
    this.setState({
      currentDevice: devices.find((d) => d.id === e.target.value)
    })
  };

  handleOpenTab = (currentTab, e) => {
    if (e) {
      if (["svg", "path"].indexOf(e.target.tagName.toLowerCase()) > -1) return
    }

    if (currentTab === this.state.currentTab) { this.setState({ currentTab: "none" }) } else this.setState({ currentTab })
  };

  settingsEnable = () => {
    this.setState({ settingsEnable: !this.state.settingsEnable })
  };

  handleChangeFont = ({ family }) => {
    this.handleChangeScreenProp("font", { target: { value: family } })
  };

  handleChangeStatusBarColor = (colorItem) => {
    this.handleChangeScreenProp("status_bar_color", { target: colorItem })
  };

  generalTabTriggerClasses = () => {
    return classNames("", {
      "purchase-screen__edit-collapsible__trigger_error":
        this.state.submitted && !this.state.screen.name
    })
  };

  handleChangeLanguage = ({ code }) => {
    const { screen, childUpdate } = this.state
    const changedScreen = this.setLanguageObjects(screen, code)
    track("screen_create_push_locale_changed", { tz:code });
    this.setState(
      {
        screen: changedScreen,
        language: code,
        childUpdate: !childUpdate,
        settingsEnable: false
      },
      () => {
        this.setState({ settingsEnable: true }, this.compileHTML)
      }
    )
  };

  handleCloseScreensBuilder = () => {
    if (this.state.isBlocking) {
      const confirmation = window.confirm(
        "Unsaved changes will be lost. Continue?"
      )

      if (confirmation) this.props.handleCloseScreensBuilder()
    } else {
      this.props.handleCloseScreensBuilder()
    }
  };

  render() {
    const {
      name,
      html,
      css,
      data,
      schema,
      status_bar_color,
      background_color,
      background_image,
      font,
      id
    } = this.state.screen

    const {
      invalidLanguages,
      screenLoading,
      compiledHtml,
      submitted,
      currentDevice,
      currentTab,
      settingsEnable,
      productGroups,
      isBlocking,
      offerSignatureModal,
      screens,
      language,
      childUpdate,
      productOnTap
    } = this.state

    const { appId } = this.props

    return (
      <div className="container-content container-content__blue container-content__purchase-screen">
        <Prompt
          when={isBlocking}
          message={(location) => "Changes that you made may not saved."}
        />
        <div className="container-content__blue-header container-content__blue-header_screensbuilder">
          <div className="container-top container-top_relative">
            <div className="purchase-screen__edit-left">
              <div
                className="container-title container-title_withdescription ta-left"
                style={{ width: currentDevice.width }}
              >
                <svg
                  onClick={this.handleCloseScreensBuilder}
                  className="purchase-screen__edit-left__close-icon cp"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.0711 4.92893C22.9764 8.83417 22.9764 15.1658 19.0711 19.0711C15.1659 22.9763 8.83422 22.9763 4.92898 19.0711C1.02373 15.1658 1.02373 8.83418 4.92898 4.92893C8.83422 1.02369 15.1659 1.02369 19.0711 4.92893ZM10.5858 12L7.7574 9.17157L9.17162 7.75736L12 10.5858L14.8285 7.75736L16.2427 9.17157L13.4143 12L16.2427 14.8284L14.8285 16.2426L12 13.4142L9.17162 16.2426L7.7574 14.8284L10.5858 12Z"
                    fill="#97ADC6"
                  />
                </svg>
                <span className="newapp-header__title">Edit screen</span>
              </div>
            </div>
            <div className="fr">
              <div className="purchase-screen__language-select">
                <LanguageCustomSelect
                  appId={appId}
                  value={language}
                  onChange={this.handleChangeLanguage}
                  invalidLanguages={invalidLanguages}
                />
              </div>
              <button
                onClick={this.handleSubmit}
                className="fr button button_green l-p__button purchase-screen__save-button"
              >
                <span>Save</span>
              </button>
            </div>
            <div className="clear" />
          </div>
        </div>
        <div className="container-content__blue-content container-content__blue-content_ps">
          <div className="purchase-screen__edit-left">
            <ScreenPreviewDeviceSwitcher
              devices={devices}
              currentDeviceId={currentDevice.id}
              handleChangeDevice={this.handleChangeDevice}
            />
            <ScreenPreview
              id={id}
              width={currentDevice.width}
              height={currentDevice.height}
              deviceId={currentDevice.id}
              screenLoading={screenLoading}
              compiledHtml={compiledHtml}
              status_bar_color={status_bar_color}
            />
          </div>
          <div className="purchase-screen__edit-right">
            <div className="purchase-screen__edit-right__box">
              {screenLoading && (
                <div style={{ padding: 10 }}>
                  <div
                    className="animated-background timeline-item"
                    style={{ marginBottom: 20 }}
                  />
                  <div
                    className="animated-background timeline-item"
                    style={{ marginBottom: 20 }}
                  />
                  <div
                    className="animated-background timeline-item"
                    style={{ marginBottom: 20 }}
                  />
                  <div className="animated-background timeline-item" />
                </div>
              )}
              {!screenLoading && (
                <Aux>
                  <Collapsible
                    transitionTime={300}
                    transitionCloseTime={300}
                    handleTriggerClick={(e) => {
                      this.handleOpenTab("generalTab", false)
                    }}
                    open={currentTab === "generalTab"}
                    classParentString="purchase-screen__edit-collapsible"
                    openedClassName="collapsible-is-open"
                    overflowWhenOpen="visible"
                    triggerClassName={this.generalTabTriggerClasses()}
                    triggerOpenedClassName={this.generalTabTriggerClasses()}
                    trigger="General"
                  >
                    <div className="input-wrapper input-wrapper_first ta-left">
                      <label
                        className="l-p__label l-p__label_inline"
                        htmlFor="name"
                      >
                        Screen name
                      </label>
                      <div className="input-wrapper__required">
                        <input
                          value={name}
                          onChange={this.handleChangeScreenProp.bind(
                            this,
                            "name"
                          )}
                          id="name"
                          placeholder="Screen name"
                          type="text"
                          name="name"
                          required=""
                          className={this.fieldClasses("name")}
                        />
                        <span className="required-label">Required</span>
                      </div>
                    </div>
                    <div className="purchase-screen__separator" />
                    <div className="input-wrapper ta-left">
                      <label className="l-p__label l-p__label_inline">
                        Background image
                      </label>
                      <ScreenImageUploader
                        fieldNotValid={false}
                        value={background_image}
                        onChange={(value) =>
                          this.handleChangeScreenProp("background_image", {
                            target: { value }
                          })
                        }
                      />
                    </div>
                    <div className="input-wrapper ta-left">
                      <label className="l-p__label l-p__label_inline">
                        Background color
                      </label>
                      <ColorPicker
                        value={background_color}
                        onChange={(value) =>
                          this.handleChangeScreenProp("background_color", {
                            target: { value }
                          })
                        }
                      />
                    </div>
                    <div className="input-wrapper ta-left">
                      <label className="l-p__label l-p__label_inline">
                        Status bar style
                      </label>
                      <InputSelect
                        name="status_bar_color"
                        value={barColors.filter(
                          (c) => c.value === status_bar_color
                        )}
                        onChange={this.handleChangeStatusBarColor}
                        getOptionLabel={({ label }) => label}
                        getOptionValue={({ value }) => value}
                        isSearchable={false}
                        autoFocus={false}
                        clearable={false}
                        classNamePrefix="input-select"
                        className="input-select input-select_blue"
                        options={barColors}
                      />
                    </div>
                  </Collapsible>
                  {settingsEnable && (
                    <ScreensBuilderSchemaFields
                      language={language}
                      screens={screens}
                      productGroups={productGroups}
                      currentTab={currentTab}
                      schema={schema}
                      data={data}
                      handleOpenTab={this.handleOpenTab}
                      handleChangeProductOnType={this.handleChangeProductOnType}
                      productOnTap={productOnTap}
                      submitted={submitted}
                      onChange={this.handleChangeData}
                      childUpdate={childUpdate}
                    />
                  )}
                </Aux>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions,
    application: state.application
  }
}

const mapDispatchToProps = {
  fetchProductGroupsRequest,
  fetchFontsRequest,
  fetchApplicationRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(ScreensBuilder)
