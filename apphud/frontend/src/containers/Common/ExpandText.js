import React from "react"

class ExpandText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showFull: false
    }
  }

  render() {
    let visibleText = null
    if (this.state.showFull || this.props.text.length <= this.props.maxLength) {
      visibleText = this.props.text
    } else {
      const firstHalf = this.props.text.substring(0, this.props.maxLength / 2)
      const secondHalf = this.props.text.substring(
        this.props.text.length - this.props.maxLength / 2,
        this.props.text.length
      )
      visibleText = `${firstHalf}...${secondHalf}`
    }
    const self = this
    const clickHandler = () => {
      self.setState({ showFull: !self.state.showFull })
    }
    const { showFull } = self.state

    if (this.props.pre) {
      visibleText = <pre style={{whiteSpace: "pre-wrap"}}>{visibleText}</pre>
    }

    return (
      <span className={this.props.className}>
        {visibleText}{" "}
        {showFull
          ? ""
          : this.props.text.length > this.props.maxLength
            ? "..."
            : ""}
        <span
          className="link link_normal cp"
          style={{ verticalAlign: "text-bottom" }}
          onClick={clickHandler}
        >
          {showFull
            ? `${this.props.collapseText}`
            : `${
                this.props.text.length > this.props.maxLength
                  ? this.props.expandText
                  : ""
              }`}
        </span>
      </span>
    )
  }
}

export default ExpandText
