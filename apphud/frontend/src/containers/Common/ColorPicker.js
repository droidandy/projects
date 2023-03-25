import React, { Component } from "react"
import { connect } from "react-redux"
import { SketchPicker } from "react-color"
import Aux from "../../hoc/Aux"

class ColorPicker extends Component {
  state = {
    open: false,
    hex: ""
  };

  rgba2hex = (rgba) => {
    if (rgba) {
      const rgbaStringArray = rgba.match(
        /[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s]?([\d.]+)[\s+]?/g
      )
      if (rgbaStringArray === null) {
        return rgba
      }
      const rgb = rgbaStringArray[0].split(", ")
      const hexResult =
        rgb && rgb.length === 4
          ? `#${`0${parseInt(rgb[0], 10).toString(16)}`.slice(
            -2
          )}${`0${parseInt(rgb[1], 10).toString(16)}`.slice(
            -2
          )}${`0${parseInt(rgb[2], 10).toString(16)}`.slice(-2)}`
          : ""
      return hexResult
    }
    return "#FFFFFF"
  };

  componentDidMount() {
    const { value } = this.props
    this.setState({ hex: this.rgba2hex(value) })
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.value !== this.props.value) {
      this.setState({ hex: this.rgba2hex(this.props.value) })
    }
  }

  handleChangeColor = (color) => {
    const { onChange } = this.props
    onChange(
      `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
    )
    this.setState({ hex: color.hex })
  };

  toggle = () => {
    this.setState({ open: !this.state.open })
  };

  handleClose = () => {
    this.setState({ open: false })
  };

  render() {
    const { value } = this.props
    const { open, hex } = this.state

    return (
      <div className="colorpicker">
        <div className="colorpicker-label" onClick={this.toggle}>
          <div
            className="colorpicker-label__swatch"
            style={{ backgroundColor: value || "#FFFFFF" }}
          />
          <div className="colorpicker-label__value">{hex.replace("#", "")}</div>
        </div>
        {open && (
          <Aux>
            <div className="colorpicker-overlay" onClick={this.handleClose} />
            <div className="colorpicker-popup">
              <SketchPicker
                color={value || "#FFFFFF"}
                onChange={this.handleChangeColor}
              />
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

ColorPicker.defaultProps = {
  value: "#FFFFFF"
}

export default connect(mapStateToProps, mapDispatchToProps)(ColorPicker)
