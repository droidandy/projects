import React, { Component } from "react"
import { connect } from "react-redux"
import classNames from "classnames"
import { NavLink } from "react-router-dom"
import Aux from "../../hoc/Aux"
import SimpleBar from "simplebar-react"
import "simplebar/dist/simplebar.min.css"

class CustomSelect extends Component {
  state = {
    open: false
  };

  setPosition = () => {
    var rect = this.refs.customselect.getBoundingClientRect()
    var rectmenu = this.refs.menu.getBoundingClientRect()
    this.setState({
      left: rect.x - rectmenu.width / 2 + rect.width / 2,
      top: rect.y + rect.height
    })
  };

  getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth
  };

  toggleOpen = () => {
    this.setState({ open: !this.state.open }, () => {
      if (this.state.open) {
        this.setPosition()
        document.body.style.paddingRight = this.getScrollbarWidth() + "px"
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.paddingRight = "0px"
        document.body.style.overflow = ""
      }
    })
  };

  getValue = (value) => {
    return value
  };

  onIconError = (e) => {
    e.target.style.display = "none"
  };

  itemClasses = (option) => {
    if (this.props.subscriptions) {
      return classNames("custom-select__outer-menu__item", {
        "custom-select__outer-menu__item_active":
          option.id === this.props.value.id
      })
    }
    return classNames("custom-select__outer-menu__item", {
      "custom-select__outer-menu__item_active":
        option[this.props.valueKey] === this.props.value[this.props.valueKey]
    })
  };

  selectClassNames = () => {
    const { open } = this.state
    const { className } = this.props

    return classNames(`custom-select ${className || ""}`, {
      "custom-select_open": open
    })
  };

  render() {
    const { value, options, valueKey, labelKey, onChange, id } = this.props
    const { open } = this.state
    return (
      <div ref="customselect" className={this.selectClassNames()} id={id}>
        <div className="custom-select__inner" onClick={this.toggleOpen}>
          {this.props.subscriptions ? (
            <div className="custom-select__value">
              {value.product_group_name}
            </div>
          ) : (
            <div className="custom-select__value">
              {this.getValue(value[labelKey])}
            </div>
          )}
          <div className="custom-select__arrow">
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.41 0.59L6 5.17L10.59 0.59L12 2L6 8L0 2L1.41 0.59Z"
                fill="#0085FF"
              />
            </svg>
          </div>
        </div>
        {open && (
          <Aux>
            <div className="custom-select__overlay" onClick={this.toggleOpen} />
            <div
              ref="menu"
              className="custom-select__outer"
              style={{ left: this.state.left, top: this.state.top }}
            >
              <div className="custom-select__outer-menu">
                <SimpleBar
                  style={{ maxHeight: 260 }}
                  forceVisible="y"
                  autoHide={false}
                >
                  {this.props.title && (
                    <div className="custom-select__outer-title">
                      {this.props.title}
                    </div>
                  )}
                  {options.map((option, index) => (
                    <div
                      className={this.itemClasses(option)}
                      key={index}
                      onClick={() => {
                        onChange(option)
                        this.toggleOpen()
                      }}
                    >
                      {this.props.withIcons && (
                        <span className="custom-select__outer-menu__item-icon">
                          <img
                            src={option.icon_url}
                            onError={this.onIconError}
                          />
                        </span>
                      )}
                      {this.props.subscriptions ? (
                        <span className="custom-select__outer-menu__item-label">
                          {option.product_group_name}
                        </span>
                      ) : (
                        <span className="custom-select__outer-menu__item-label">
                          {this.getValue(option[labelKey])}
                        </span>
                      )}
                    </div>
                  ))}
                </SimpleBar>
              </div>
            </div>
          </Aux>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(CustomSelect)
