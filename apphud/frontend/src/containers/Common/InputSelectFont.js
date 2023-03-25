import React, { Component } from "react"
import { connect } from "react-redux"
import InputSelect from "./InputSelect"
import axios from "axios"

const LIMIT = 30

class InputSelectFont extends Component {
  state = {
    fonts: [],
    loading: false,
    offset: 0,
    meta: {
      total_count: 99999
    },
    block: false,
    fontSearchQuery: ""
  };

  getFonts = (add = false) => {
    const { offset, fontSearchQuery, fonts } = this.state
    axios
      .get(`/fonts?offset=${offset}&limit=${LIMIT}&q=${fontSearchQuery}`)
      .then((response) => {
        const { results, meta } = response.data.data
        if (add) {
          this.setState({
            fonts: [...fonts, ...results],
            loading: false,
            block: false,
            meta
          })
        } else {
          this.setState({
            fonts: results,
            block: false,
            loading: false,
            meta
          })
        }
      })
  };

  handleFontsSelectInputChange = (fontSearchQuery) => {
    if (fontSearchQuery.length === 0) {
      this.resetFonts()
    }
    if (fontSearchQuery.length > 0) {
      this.setState({
        loading: true,
        offset: 0,
        fontSearchQuery
      })
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.getFonts()
      }, 1000)
    }
  };

  onMenuScrollToBottom = () => {
    const { meta, fonts, offset, block } = this.state

    if (!block) {
      if (fonts.length < meta.total_count) {
        this.setState(
          {
            offset: offset + LIMIT,
            block: true
          },
          () => {
            this.getFonts(true)
          }
        )
      }
    }
  };

  resetFonts = () => {
    const { fonts } = this.props
    this.setState({
      fonts,
      loading: false,
      offset: 0,
      meta: {
        total_count: 99999
      },
      block: false,
      fontSearchQuery: ""
    })
  };

  componentDidMount() {
    this.resetFonts()
  }

  onChange = (item) => {
    this.props.onChange(item)
  };

  render() {
    const { fonts, loading } = this.state
    const { onChange, value, disabled } = this.props

    return (
      <div ref="select">
        <InputSelect
          name="font"
          ref="select"
          value={{ family: value }}
          onChange={this.onChange}
          getOptionLabel={({ family }) => family}
          getOptionValue={({ family }) => family}
          isSearchable={true}
          autoFocus={false}
          clearable={false}
          classNamePrefix="input-select"
          className="input-select input-select_blue"
          onMenuScrollToBottom={this.onMenuScrollToBottom}
          isLoading={loading}
          onInputChange={this.handleFontsSelectInputChange}
          onMenuClose={this.resetFonts}
          options={fonts}
          isDisabled={disabled}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fonts: state.fonts,
    user: state.user
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(InputSelectFont)
