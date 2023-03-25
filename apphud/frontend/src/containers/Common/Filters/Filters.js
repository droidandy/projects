import React, { Component } from "react"
import { connect } from "react-redux"
import InputSelect from "../InputSelect"
import InputGroupSelect from "../InputGroupSelect"
import ManageFilterModal from "./ManageFilterModal"
import Aux from "../../../hoc/Aux"

class Filters extends Component {
  state = {
    addFilter: false,
    currentFilter: undefined
  };

  handleCloseManageFilterModal = () => {
    this.setState({ addFilter: false, currentFilter: undefined })
  };

  handleOpenManageFilterModal = () => {
    this.setState({ addFilter: true })
  };

  handleRemoveFilter = (index) => {
    const filters = this.props.filters.slice(0)

    if (filters[index].hasOwnProperty("id") && this.props.destroyable) { filters[index].destroy = true } else filters.splice(index, 1)

    this.props.handleChangeFilters(filters)
  };

  handleUpdateFilter = (index, e) => {
    if (
      ["path", "svg", "g", "clip"].indexOf(e.target.tagName) === -1 &&
      !this.props.readOnly
    ) { this.setState({ currentFilter: index }, this.handleOpenManageFilterModal) }
  };

  getEqualLabel = (filter, equal) => {
    if (this.props.dictionaryFilters) {
      const findFilter = this.props.dictionaryFilters.find(
        (f) => f.value === filter.value
      )
      let findItem

      if (findFilter) { findItem = findFilter.items.find((o) => o.value === equal) }

      if (findItem) return findItem.name
      else return equal
    }

    return equal
  };

  getGroupLabel = (filter, group) => {
    if (filter.productGroups) {
      const findGroup = filter.productGroups.find((p) => p.value === group)

      return findGroup ? findGroup.name : group
    }

    return group
  };

  render() {
    const {
      appId,
      filters,
      handleChangeFilters,
      dictionaryFilters,
      modalTitle,
      addButtonTitle,
      separator,
      filterTitle,
      readOnly,
      noMargin
    } = this.props

    const { addFilter, currentFilter } = this.state

    return (
      <div>
        <div className={noMargin ? "" : "charts-filters__custom"}>
          {!readOnly && (
            <div
              className="cf__c-tag cf__c-tag_add"
              onClick={this.handleOpenManageFilterModal}
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
              <span className="va-middle">{addButtonTitle || "Filter"}</span>
            </div>
          )}
          {filters.map(
            (filter, index) =>
              !filter.destroy && (
                <Aux key={index}>
                  <div
                    className="cf__c-tag cf__c-tag_nomargin cp"
                    onClick={this.handleUpdateFilter.bind(null, index)}
                    key={index}
                  >
                    {!readOnly && (
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
                    )}
                    <span className="va-middle">
                      {filter.label}{" "}
                      {filter.productGroup
                        ? ` of ${this.getGroupLabel(
                            filter,
                            filter.productGroup
                          )}`
                        : ""}{" "}
                      ={" "}
                      {filter.equal.map(
                        (equalItem, index) =>
                          this.getEqualLabel(filter, equalItem) +
                          (filter.equal.length - 1 === index ? "" : " OR ")
                      )}
                    </span>
                  </div>
                  {index !== filters.length - 1 && (
                    <span
                      className="cf__c-tag__separator"
                      style={!separator ? { margin: "0 4px" } : {}}
                    >
                      {separator}
                    </span>
                  )}
                </Aux>
              )
          )}
        </div>
        {addFilter && (
          <ManageFilterModal
            filterTitle={filterTitle}
            dictionaryFilters={dictionaryFilters}
            currentFilter={currentFilter}
            modalTitle={modalTitle}
            appId={appId}
            filters={filters}
            handleChangeFilters={handleChangeFilters}
            handleCloseManageFilterModal={this.handleCloseManageFilterModal}
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

export default connect(mapStateToProps, mapDispatchToProps)(Filters)
