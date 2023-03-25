import React, { Component } from "react"
import { connect } from "react-redux"
import Modal from "react-modal"
import InputSelect from "../InputSelect"
import InputGroupSelect from "../InputGroupSelect"
import classNames from "classnames"
import { fetchProductGroupsRequest } from "../../../actions/productGroups"
import Input from 'components/Input';

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

const equalHelper = (equal) => {
  const _equal = JSON.parse(JSON.stringify(equal))

  return Array.isArray(_equal) ? _equal : [_equal]
}

class AddFilterModal extends Component {
  state = {
    filter: {
      value: "product",
      label: "Product",
      equal: [""]
    },
    productGroups: []
  };

  handleChangeFilter = (item) => {
    this.setState({
      filter: Object.assign(this.state.filter, {
        label: item.name,
        value: item.id,
        equal: [""]
      })
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
    } else if (dictionaryFilters[0] && dictionaryFilters[0].options[0]) {
      this.setState({
        filter: {
          value: dictionaryFilters[0].options[0].id,
          label: dictionaryFilters[0].options[0].name,
          equal: [""]
        }
      })
    }
  }

  generateEqualItem = () => {
    const { dictionaryFilters } = this.props
    const { filter } = this.state

    if (Array.isArray(filter.equal)) {
      if (filter.equal[filter.equal.length - 1] !== "") filter.equal.push("")

      this.setState({ filter })
    }
  };

  handleChangeEqualItem = (item, index) => {
    const isBool =
      item.name && ["true", "false", "enabled", "disabled"].indexOf(item.name.toLowerCase()) > -1
    let equal = this.state.filter.equal

    if (isBool) equal = item.id
    else equal[index] = item.id

    this.setState(
      { filter: Object.assign(this.state.filter, { equal }) },
      () => {
        if (!isBool) this.generateEqualItem()
      }
    )
  };

  applyFilter = (update = false) => {
    const newFilter = JSON.parse(JSON.stringify(this.state.filter))
    const filters = this.props.filters.slice(0)

    if (newFilter.equal[newFilter.equal.length - 1] === "") { newFilter.equal.pop() }

    if (update) Object.assign(filters[this.props.currentFilter], newFilter)
    else {
      const findOldFilter = filters.find((f) => f.value === newFilter.value)

      if (findOldFilter) {
        const index = filters.indexOf(findOldFilter)
        filters[index].equal = filters[index].equal.concat(newFilter.equal)
      } else filters.push(newFilter)
    }

    this.props.handleChangeFilters(filters)
    this.props.handleCloseAddFilterModal()
  };

  submit = () => {
    this.applyFilter(this.props.currentFilter > -1)
  };

  filterValid = () => {
    const { filter } = this.state

    return equalHelper(filter.equal).filter((e) => e !== "").length > 0
  };

  removeEqual = (index) => {
    const filter = this.state.filter
    filter.equal.splice(index, 1)
    this.setState({ filter }, this.generateEqualItem)
    this.forceUpdate()
  };

  getSegmentValue = (value) => {
    const dictionaryFilters = this.props.dictionaryFilters.slice(0)
    let filter
    dictionaryFilters.forEach((group) => {
      const find = group.options.find((option) => option.id === value)

      if (find) filter = find
    })

    return filter
  };

  filterOptions = (options) => {
    const { equal } = this.state.filter

    for (const equalItem of equalHelper(equal)) { options = options.filter((option) => option.id !== equalItem) }

    return options
  };

  getModalMarginTop = () => {
    if (this.refs.modal && this.refs.modal.node) {
      if (this.refs.modal.node.querySelector(".ReactModal__Content")) {
        return (
          -this.refs.modal.node.querySelector(".ReactModal__Content")
            .offsetHeight /
          2 +
          "px"
        )
      }
    }
    return -141 + "px"
  };

  handleOnChangeInput = (index) => (e) => {
    let equal = this.state.filter.equal

    equal[index] = e.value;

    this.setState(
      { filter: Object.assign(this.state.filter, { equal }) },
      () => {
        if (!equal[index + 1]) this.generateEqualItem()
      }
    )
  }

  handleOnFocus = (e) => {
    this.focusInput = e.target;
  }

  render() {
    const { handleCloseAddFilterModal, dictionaryFilters } = this.props
    const { filter, productGroups, productGroupsLoad } = this.state
    const { value, label, equal } = filter

    const segmentValue = this.getSegmentValue(value);

    const segmentValueHasOptions = segmentValue?.options && segmentValue?.options?.length > 0

    return (
      <Modal
        ref="modal"
        isOpen={true}
        className="ReactModal__Content ReactModal__Content-visible"
        onRequestClose={handleCloseAddFilterModal}
        ariaHideApp={false}
        style={customStylesPopUp}
        contentLabel="Add filter"
      >
        <div
          style={{ padding: "20px 30px" }}
          className="purchase-screen__edit-insert__macros-modal"
        >
          <div className="newapp-header__title">Add filter</div>
          <div className="input-wrapper ta-left">
            <label className="l-p__label">Select filter:</label>
            <InputGroupSelect
              name="segment"
              value={segmentValue}
              onChange={this.handleChangeFilter}
              isSearchable={false}
              getOptionLabel={({ name }) => name}
              getOptionValue={({ id }) => id}
              autoFocus={false}
              clearable={false}
              classNamePrefix="input-select"
              className="input-select input-select_blue"
              options={dictionaryFilters}
            />
          </div>
          <div className="input-wrapper">
            <label className="l-p__label">Is equal to:</label>
            {segmentValueHasOptions ?
              equalHelper(equal).map((item, index) => (
                <div key={item}>
                  <div key={item}>
                    <div
                      className={
                        "chart-equal__wrapper " +
                        ((item === "" || !Array.isArray(equal)) &&
                          " chart-equal__wrapper_100")
                      }
                    >
                      <InputSelect
                        name="product_id"
                        maxMenuHeight={190}
                        value={
                          this.getSegmentValue(value).options &&
                          this.getSegmentValue(value).options.find(
                            (filter) => filter.id === item
                          )
                        }
                        onChange={(item) => {
                          this.handleChangeEqualItem(item, index)
                        }}
                        isSearchable={
                          this.getSegmentValue(value).options
                            ? this.filterOptions(
                              this.getSegmentValue(value).options
                            ).length > 10
                            : false
                        }
                        autoFocus={false}
                        clearable={false}
                        getOptionLabel={({ name }) => name}
                        getOptionValue={({ id }) => id}
                        classNamePrefix="input-select"
                        className="input-select_blue"
                        placeholder={`Select ${this.getSegmentValue(value) &&
                          this.getSegmentValue(value).name.toLowerCase()
                          }`}
                        options={
                          this.getSegmentValue(value).options
                            ? this.filterOptions(
                              this.getSegmentValue(value).options
                            )
                            : []
                        }
                      />
                    </div>
                    {Array.isArray(equal) && item !== "" && (
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
                    {equalHelper(equal).length - 1 === index ? (
                      ""
                    ) : (
                        <div className="chart-addfilter__separator">or:</div>
                      )}
                  </div>
                </div>
              ))
              : equal.map((item, index) => (
                <div key={index}>
                  <div
                    className={
                      "chart-equal__wrapper " +
                      ((item === "" || !Array.isArray(equal)) &&
                        " chart-equal__wrapper_100")
                    }
                  >
                    <Input
                      onChange={this.handleOnChangeInput(index)}
                      value={item}
                      autoFocus={true}
                      className="chart-equal__input"
                      onFocus={this.handleOnFocus}
                    >
                    </Input>
                  </div>
                  {Array.isArray(equal) && item !== "" && (
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
                  {equalHelper(equal).length - 1 === index ? (
                    ""
                  ) : (
                      <div className="chart-addfilter__separator">or:</div>
                    )}
                </div>
              ))}
          </div>
          <div className="input-wrapper oh">
            <button
              className="button button_blue button_160 fl"
              onClick={handleCloseAddFilterModal}
            >
              <span>Cancel</span>
            </button>
            <button
              onClick={this.submit}
              disabled={!this.filterValid()}
              className="button button_green button_icon button_160 fr"
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

export default connect(mapStateToProps, mapDispatchToProps)(AddFilterModal)
