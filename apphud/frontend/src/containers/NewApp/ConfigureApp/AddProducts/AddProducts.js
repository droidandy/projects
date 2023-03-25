import React, { Component } from "react"
import { connect } from "react-redux"
import Modal from "react-modal"
import Group from "./Group"
import { fetchProductGroupsRequest } from "../../../../actions/productGroups"
import classNames from "classnames"
import axios from "axios"

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
    borderRadius: 8,
    width: 410
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
}

class AddProducts extends Component {
  state = {
    groupAddOpen: false,
    productAddOpen: false,
    optionsOpen: false,
    createProductGroupSubmitted: false,
    groupName: "",
    loading: false
  };

  from = "settings";

  handleAddGroup = (withoutCheck) => {
    if (withoutCheck || this.props.productGroups.length !== 1) {
      this.setState({
        groupAddOpen: true,
        groupAddAlert: false
      })
    } else if (this.props.productGroups.length === 1) {
      this.setState({ groupAddAlert: true })
    }
  };

  handleAddProduct = () => {
    this.setState({ productAddOpen: true })
  };

  closeModal = () => {
    this.setState({ groupAddOpen: false, productAddOpen: false })
  };

  setWidth = () => {
    var widths = []
    document
      .querySelectorAll(".add-products__groups-item__products")
      .forEach(function(node) {
        node.style.width = "auto"
      })
    document
      .querySelectorAll(".add-products__groups-item__products")
      .forEach(function(node) {
        widths.push(node.getBoundingClientRect().width)
      })
    const maxWidth = Math.max.apply(Math, widths)

    document
      .querySelectorAll(".add-products__groups-item__products")
      .forEach(function(node) {
        node.style.width = `${maxWidth}px`
      })
  };

  getGroups = (props = this.props) => {
    this.setState({ loading: true })
    this.props.fetchProductGroupsRequest(props.appId, () => {
      this.setState({ loading: false }, () => {
        setTimeout(300, this.setWidth)
      })
    })
  };

  componentDidMount() {
    this.getGroups()
    if (this.props.from === "onboarding") this.from = "onboarding"
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.appId !== nextProps.appId) {
      this.getGroups(nextProps.appId)
    }
  }

  createProductGroup = () => {
    this.setState({ createProductGroupSubmitted: true })
    var newProductGroup = {
      name: this.state.groupName
    }

    if (this.validation(this.state.groupName)) {
      axios
        .post(`/apps/${this.props.appId}/product_groups`, newProductGroup)
        .then((response) => {
          this.props.fetchProductGroupsRequest(this.props.appId)
          this.closeModal()
          this.setState({
            createProductGroupSubmitted: false,
            groupName: ""
          })
        })
    }
  };

  validation = (value) => {
    return /^[A-z0-9\[\] -]+$/.test(value)
  };

  inputClasses = (field) => {
    return classNames("input input_stretch input_blue", {
      input_error:
        (this.state.createProductGroupSubmitted && !this.state[field]) ||
        (this.state.createProductGroupSubmitted &&
          !this.validation(this.state[field]))
    })
  };

  handleChangeValue = (field, e) => {
    this.setState({ [field]: e.target.value.trim() })
  };

  closeGroupAddAlert = () => {
    this.setState({ groupAddAlert: false })
  };

  render() {
    return (
      <div className="add-products" style={this.props.styles || {}}>
        <div className="add-products__groups container-content__integrations-table">
          {this.state.loading && (
            <div>
              <div className="animated-background timeline-item" />
              <div className="animated-background timeline-item__row" />
              <div className="animated-background timeline-item__row" />
              <div className="animated-background timeline-item__row" />
              <p>&nbsp;</p>
            </div>
          )}
          {!this.state.loading && (
            <div className="add-products__groups-item add-products__groups-item_title">
              <div className="add-products__groups-item__info">
                <span className="add-products__title">Groups</span>
              </div>
              <div
                className="add-products__groups-item__products"
                style={{ width: "343.312px" }}
              >
                <div className="add-products__groups-item__products-item">
                  <span className="add-products__title">Products</span>
                </div>
              </div>
            </div>
          )}
          {!this.state.loading &&
            this.props.productGroups.map((group, index) => (
              <Group
                setWidth={this.setWidth}
                application={this.props.application}
                appId={this.props.appId}
                from={this.from}
                group={group}
                key={group.id}
              />
            ))}
          <Modal
            isOpen={this.state.groupAddAlert}
            onRequestClose={this.closeGroupAddAlert}
            ariaHideApp={false}
            style={customStyles}
            contentLabel="Add products group"
          >
            <div style={{ padding: "20px 30px" }}>
              <div className="newapp-header__title">
                Do you really need this?
              </div>
              <div className="input-wrapper">
                Do you really have more than one subscription group? Developers
                usually have only one subscription group.
              </div>
              <div className="input-wrapper">
                <button
                  className="button button_blue popup-button fl"
                  onClick={this.closeGroupAddAlert}
                >
                  <span>Cancel</span>
                </button>
                <button
                  onClick={this.handleAddGroup.bind(null, true)}
                  className="button button_green popup-button fr"
                >
                  <span>Add product group</span>
                </button>
              </div>
            </div>
          </Modal>
          <Modal
            isOpen={this.state.groupAddOpen}
            onRequestClose={this.closeModal}
            ariaHideApp={false}
            style={customStyles}
            contentLabel="Add products group"
          >
            <div style={{ padding: "20px 30px" }}>
              <div className="newapp-header__title">Add new products group</div>
              <div className="input-wrapper">
                <label className={"l-p__label"} htmlFor="login">
                  Name
                </label>
                <div className="input-wrapper__required">
                  <input
                    onChange={this.handleChangeValue.bind(this, "groupName")}
                    value={this.state.groupName}
                    autoFocus={true}
                    className={this.inputClasses("groupName")}
                    placeholder="Products group's name"
                  />
                  <span className="required-label">Required</span>
                </div>
              </div>
              <div className="input-wrapper">
                <button
                  className="button button_blue popup-button fl"
                  onClick={this.closeModal}
                >
                  <span>Cancel</span>
                </button>
                <button
                  onClick={this.createProductGroup}
                  className="button button_green popup-button fr"
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
                  <span>Create</span>
                </button>
              </div>
            </div>
          </Modal>
          {!this.state.loading && (
            <div
              className="add-products__groups-add add-products__groups-add_small"
              onClick={this.handleAddGroup.bind(null, false)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM9 7H12V9H9V12H7V9H4V7H7V4H9V7Z"
                  fill="#20BF55"
                />
              </svg>
              <span>Add products group</span>
            </div>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    productGroups: state.productGroups,
    user: state.sessions,
    application: state.application
  }
}

const mapDispatchToProps = {
  fetchProductGroupsRequest,
}

export default connect(mapStateToProps, mapDispatchToProps)(AddProducts)
