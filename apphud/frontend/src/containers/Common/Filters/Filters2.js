import React, { Component } from "react"
import { connect } from "react-redux"
import InputSelect from "../InputSelect"
import InputGroupSelect from "../InputGroupSelect"
import AddFilterModal from "./AddFilterModal"
import axios from "axios"

const equalHelper = (equal) => {
  const _equal = JSON.parse(JSON.stringify(equal))

  return Array.isArray(_equal) ? _equal : [_equal]
}

class ChartFilters extends Component {
  state = {
    addFilter: false,
    currentFilter: undefined,
    dictionaryFilters: []
  };

  handleCloseAddFilterModal = () => {
    this.setState({ addFilter: false, currentFilter: undefined })
  };

  handleOpenAddFilterModal = () => {
    this.setState({ addFilter: true })
  };

  handleRemoveFilter = (index) => {
    const filters = this.props.filters.slice(0)
    filters.splice(index, 1)
    this.props.handleChangeFilters(filters)
  };

  handleUpdateFilter = (index, e) => {
    if (["path", "svg", "g", "clip"].indexOf(e.target.tagName) === -1) { this.setState({ currentFilter: index }, this.handleOpenAddFilterModal) }
  };

  getOptions = (cb) => {
    const { appId } = this.props
    this.getRequest(`/apps/${appId}/${this.props.endpoint}/options`, cb)
  };

  getRequest = (url, cb) => {
    const { user } = this.props

    axios.get(url).then((response) => {
      const data = response.data.data.results
      cb(data)
    })
  };

  componentWillMount() {
    this.getOptions((dictionaryFilters) => {
      dictionaryFilters = Object.keys(dictionaryFilters).map((key) => ({
        name: key,
        id: key,
        options: dictionaryFilters[key]
      }))

      this.setState({
        dictionaryFilters
      })
    })
  }

  getFilterValue = (filter) => {
    const { dictionaryFilters } = this.state

    return equalHelper(filter.equal).map((equalItem, index) => {
      for (const dictionaryFilter of dictionaryFilters) {
        const option = dictionaryFilter.options.find(
          (o) => o.id === filter.value
        )

        if (option && Array.isArray(option.options)) {
          const suboption = option.options.find((o) => o.id === equalItem)

          if (suboption) equalItem = suboption.name
        }
      }

      return (
        equalItem +
        (equalHelper(filter.equal).length - 1 === index ? "" : " OR ")
      )
    })
  };

  render() {
    const { appId, filters, handleChangeFilters } = this.props

    const { addFilter, currentFilter, dictionaryFilters } = this.state

    return (
      <div className="users-filters">
        <div>
          <div
            className="cf__c-tag cf__c-tag_add"
            onClick={this.handleOpenAddFilterModal}
          >
            <svg
              className="va-middle"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 4H7V7H4V9H7V12H9V9H12V7H9V4Z"
                fill="white"
              />
            </svg>
            <span className="va-middle">Where</span>
          </div>
          {filters.map((filter, index) => (
            <div
              className="cf__c-tag cp"
              onClick={this.handleUpdateFilter.bind(null, index)}
              key={index}
            >
              <svg
                onClick={this.handleRemoveFilter.bind(null, index)}
                className="va-middle cp"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.9497 3.05025C15.6834 5.78392 15.6834 10.2161 12.9497 12.9497C10.2161 15.6834 5.78391 15.6834 3.05024 12.9497C0.316572 10.2161 0.316572 5.78392 3.05024 3.05025C5.78391 0.316582 10.2161 0.316583 12.9497 3.05025ZM7.99999 6.58579L10.1213 4.46447L11.5355 5.87868L9.4142 8L11.5355 10.1213L10.1213 11.5355L7.99999 9.41421L5.87867 11.5355L4.46446 10.1213L6.58578 8L4.46446 5.87868L5.87867 4.46447L7.99999 6.58579Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span className="va-middle">
                {filter.label} = {this.getFilterValue(filter)}
              </span>
            </div>
          ))}
        </div>
        {addFilter && (
          <AddFilterModal
            dictionaryFilters={dictionaryFilters}
            currentFilter={currentFilter}
            appId={appId}
            filters={filters}
            handleChangeFilters={handleChangeFilters}
            handleCloseAddFilterModal={this.handleCloseAddFilterModal}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ChartFilters)
