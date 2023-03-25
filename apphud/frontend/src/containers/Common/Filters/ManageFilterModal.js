import React, { Component } from "react"
import { connect } from "react-redux"
import Modal from "react-modal"
import InputSelect from "../InputSelect"
import InputGroupSelect from "../InputGroupSelect"
import classNames from "classnames"
import { fetchProductGroupsRequest } from "../../../actions/productGroups"

const customStylesPopUp = {
  content: {
    position: "relative",
    margin: "auto",
    padding: 0,
    borderRadius: 8,
    width: 410,
    overlfow: "visible"
  },
  overlay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
}

class ManageFilterModal extends Component {
  state = {
    filter: {
      productGroup: "",
      value: "product",
      label: "Product",
      equal: [""]
    }
  };

  handleChangeFilter = (item) => {
    const filter = Object.assign(this.state.filter, {
      label: item.name,
      value: item.value,
      equal: [""]
    })

    if (item.groups) {
      filter.productGroups = item.groups
      filter.productGroup = item.groups[0].value
    } else {
      delete filter.productGroup
      delete filter.productGroups
    }

    this.setState({
      filter
    })
  };

  componentDidMount() {
    const {
      currentFilter,
      fetchProductGroupsRequest,
      appId,
      filters,
      dictionaryFilters
    } = this.props

    if (currentFilter > -1) {
      this.setState(
        { filter: JSON.parse(JSON.stringify(filters[currentFilter])) },
        this.generateEqualItem
      )
    } else if (dictionaryFilters[0]) {
      const filter = {
        value: dictionaryFilters[0].value,
        label: dictionaryFilters[0].name,
        equal: [""]
      }

      if (dictionaryFilters[0].groups) {
        filter.productGroups = dictionaryFilters[0].groups

        if (dictionaryFilters[0].groups[0]) { filter.productGroup = dictionaryFilters[0].groups[0].value }
      }

      this.setState({
        filter
      })
    }
  }

  generateEqualItem = () => {
    const { filter } = this.state

    if (
      this.getFilterValue(filter.value) &&
      this.filterOptions(this.getFilterValue(filter.value).items).length > 0
    ) {
      if (filter.equal[filter.equal.length - 1] !== "") filter.equal.push("")
    }

    this.setState({ filter })
  };

  handleChangeEqualItem = (value, index) => {
    const equal = this.state.filter.equal
    equal[index] = value
    this.setState(
      { filter: Object.assign(this.state.filter, { equal }) },
      this.generateEqualItem
    )
  };

  applyFilter = (update = false) => {
    const newFilter = JSON.parse(JSON.stringify(this.state.filter))
    const filters = this.props.filters.slice(0)

    if (newFilter.equal[newFilter.equal.length - 1] === "") { newFilter.equal.pop() }

    if (update) Object.assign(filters[this.props.currentFilter], newFilter)
    else {
      const findOldFilter = filters.find((f) => f.value === newFilter.value)

      if (findOldFilter && !findOldFilter.destroy) {
        const index = filters.indexOf(findOldFilter)
        filters[index].equal = filters[index].equal.concat(newFilter.equal)
      } else filters.push(newFilter)
    }

    this.props.handleChangeFilters(filters)
    this.props.handleCloseManageFilterModal()
  };

  submit = () => {
    this.applyFilter(this.props.currentFilter > -1)
  };

  filterValid = () => {
    const { filter } = this.state

    return filter.equal.filter((e) => e !== "").length > 0
  };

  removeEqual = (index) => {
    const filter = this.state.filter
    filter.equal.splice(index, 1)
    this.setState({ filter }, this.generateEqualItem)
    this.forceUpdate()
  };

  getFilterValue = (value) => {
    const { dictionaryFilters } = this.props

    return dictionaryFilters.find((filter) => filter.value === value)
  };

  filterOptions = (items) => {
    const { equal } = this.state.filter

    for (const equalItem of equal) { items = items.filter((option) => option.value !== equalItem) }

    return items
  };

  handleChangeProductGroup = (item) => {
    const filter = this.state.filter
    filter.productGroup = item.value
    this.setState({ filter })
  };

  render() {
    const {
      handleCloseManageFilterModal,
      dictionaryFilters,
      modalTitle,
      filterTitle
    } = this.props
    const { filter } = this.state
    const { value, label, equal, productGroup, productGroups } = filter
    return (
      <Modal
        isOpen={true}
        className="ReactModal__Content ReactModal__Content-visible"
        onRequestClose={handleCloseManageFilterModal}
        ariaHideApp={false}
        style={customStylesPopUp}
        shouldFocusAfterRender={false}
        contentLabel="Add filter"
      >
        <div
          style={{ padding: "20px 30px" }}
          className="purchase-screen__edit-insert__macros-modal"
        >
          <div className="newapp-header__title">{modalTitle}</div>
          <div className="input-wrapper ta-left">
            <label className="l-p__label">{filterTitle}</label>
            <InputSelect
              name="filter"
              value={this.getFilterValue(value)}
              onChange={this.handleChangeFilter}
              isSearchable={false}
              getOptionLabel={({ name }) => name}
              getOptionValue={({ value }) => value}
              autoFocus={false}
              clearable={false}
              classNamePrefix="input-select"
              className="input-select input-select_blue"
              options={dictionaryFilters}
            />
          </div>
          {productGroups && productGroups[0] && (
            <div className="input-wrapper">
              <label className="l-p__label">...of product group</label>
              <InputSelect
                name="product_group"
                value={productGroups.find((p) => p.value === productGroup)}
                onChange={this.handleChangeProductGroup}
                isSearchable={false}
                getOptionLabel={({ name }) => name}
                getOptionValue={({ value }) => value}
                autoFocus={false}
                clearable={false}
                classNamePrefix="input-select"
                className="input-select input-select_blue"
                options={productGroups}
              />
            </div>
          )}
          <div className="input-wrapper">
            <label className="l-p__label">...is equal to</label>
            {equal.map((item, index) => (
              <div key={item}>
                <div>
                  <div
                    className={
                      "chart-equal__wrapper " +
                      (item === "" && " chart-equal__wrapper_100")
                    }
                  >
                    <InputSelect
                      name="equal"
                      value={
                        this.getFilterValue(value) &&
                        this.getFilterValue(value).items.find(
                          (filter) => filter.value === item
                        )
                      }
                      onChange={(item) => {
                        this.handleChangeEqualItem(item.value, index)
                      }}
                      isSearchable={false}
                      autoFocus={false}
                      clearable={false}
                      getOptionLabel={({ name }) => name}
                      getOptionValue={({ value }) => value}
                      classNamePrefix="input-select"
                      className="input-select_blue"
                      placeholder="Select"
                      options={
                        this.getFilterValue(value) &&
                        this.filterOptions(this.getFilterValue(value).items)
                      }
                    />
                  </div>
                  {item !== "" && (
                    <button
                      onClick={this.removeEqual.bind(null, index)}
                      className="button button_red pushrules-content__row-column-3__button"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10 3V2H6V3H2V5H14V3H10Z" fill="white" />
                        <path
                          d="M3 6V13.7143C3 14.4227 3.64071 15 4.42857 15H11.5714C12.3593 15 13 14.4227 13 13.7143V6H3ZM7.5 12.5H6V8.5H7.5V12.5ZM10 12.5H8.5V8.5H10V12.5Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  )}
                  {equal.length - 1 === index ? (
                    ""
                  ) : (
                    <div className="input-wrapper l-p__label">OR</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="input-wrapper">
            <button
              className="button button_blue popup-button fl"
              onClick={handleCloseManageFilterModal}
            >
              <span>Cancel</span>
            </button>
            <button
              onClick={this.submit}
              disabled={!this.filterValid()}
              className="button button_orange popup-button fr"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 0C3.1339 0 0 3.1339 0 7C0 10.8661 3.1339 14 7 14C10.8661 14 14 10.8661 14 7C14 3.1339 10.8654 0 7 0ZM6.475 11.025L2.975 8.4L4.025 7L6.125 8.575L9.8 3.675L11.2 4.725L6.475 11.025Z"
                  fill="white"
                />
              </svg>
              <span>Apply</span>
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = {
  fetchProductGroupsRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageFilterModal)
