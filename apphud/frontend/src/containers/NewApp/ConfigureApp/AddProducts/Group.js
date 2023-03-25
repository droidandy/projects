import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import Modal from "react-modal"
import Aux from "../../../../hoc/Aux"
import Product from "./Product"
import axios from "axios"
import classNames from "classnames"
import { fetchProductGroupsRequest } from "../../../../actions/productGroups"
import SweetAlert from "react-swal"
import InputRadio from "../../../Common/InputRadio"

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

class Group extends Component {
  state = {
    optionsOpen: false,
    groupEditOpen: false,
    groupName: "",
    updateProductGroupSubmitted: false,
    createProductSubmitted: false,
    alertOpen: false,
    productAddOpen: false,
    productName: "",
    productId: "",
    store: '',
    warningPopupIsOpen: false
  };

  setPosition = () => {
    var rect = this.refs.customselect.getBoundingClientRect()
    var rectmenu = this.refs.menu.getBoundingClientRect()
    this.setState({
      left: rect.x - rectmenu.width / 2 + 10,
      top: rect.y + rect.height
    })
  };

  getScrollbarWidth = () => {
    return window.innerWidth - document.documentElement.clientWidth
  };

  toggleOpen = () => {
    this.setState({ optionsOpen: !this.state.optionsOpen }, () => {
      if (this.state.optionsOpen) {
        this.setPosition()
        document.body.style.paddingRight = this.getScrollbarWidth() + "px"
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.paddingRight = "0px"
        document.body.style.overflow = ""
      }
    })
  };

  setWarningPopupOpen = (value) => {
    this.setState({ warningPopupIsOpen: value });
  }

  handleCloseWarningPopup = () => {
    this.setWarningPopupOpen(false);
  }

  handleClickRenameOnWarningModal = () => {
    this.setWarningPopupOpen(false);
    this.setState({ groupEditOpen: true })
  }

  closeUpdateGroupModal = () => {
    this.setState({ groupEditOpen: false })
  };

  closeProductCreateModal = () => {
    this.setState({ productAddOpen: false })
  };

  handleEditGroup = () => {
    this.setWarningPopupOpen(true)
    this.toggleOpen()
  };

  handleChangeValue = (field, e) => {
    this.setState({ [field]: e.target.value.trim() })
  };

  componentDidMount() {
    this.setState({
      groupName: this.props.group.name,
      store: this.props.application.bundle_id ? 'app_store' : 'play_store'
    })
  }

  validation = (value) => {
    return /^[A-z0-9\[\] -]+$/.test(value)
  };

  productGroupInputClasses = (field) => {
    return classNames("input input_stretch input_blue", {
      input_error:
        (this.state.updateProductGroupSubmitted && !this.state[field]) ||
        (this.state.updateProductGroupSubmitted &&
          !this.validation(this.state[field]))
    })
  };

  productInputClasses = (field) => {
    return classNames("input input_stretch input_blue", {
      input_error: this.state.createProductSubmitted && !this.state[field]
    })
  };

  updateProductGroup = () => {
    this.setState({ updateProductGroupSubmitted: true })
    var productGroup = {
      name: this.state.groupName
    }
    if (this.validation(this.state.groupName)) {
      axios
        .put(`/product_groups/${this.props.group.id}`, productGroup)
        .then((response) => {
          this.props.fetchProductGroupsRequest(this.props.appId)
          this.closeUpdateGroupModal()
          this.setState({ updateProductGroupSubmitted: false })
        })
    }
  };

  handleAddProduct = () => {
    this.setState({ productAddOpen: true })
  };

  createProduct = () => {
    this.setState({ createProductSubmitted: true })
    var newProduct = {
      product_id: this.state.productId,
      store: this.state.store
    }

    axios
      .post(`/product_groups/${this.props.group.id}/products`, newProduct)
      .then((response) => {
        this.props.fetchProductGroupsRequest(this.props.appId, () => {
          setTimeout(this.props.setWidth)
        })
        this.closeProductCreateModal()
        this.setState({
          createProductSubmitted: false,
          productName: "",
          productId: ""
        })
      })
  };

  removeProductGroup = () => {
    this.setState({ alertOpen: true })
    this.toggleOpen()
  };

  handleCallbackAlert = (value) => {
    this.setState({ alertOpen: false })

    if (value) {
      axios
        .delete(`/product_groups/${this.props.group.id}`)
        .then((response) => {
          this.props.fetchProductGroupsRequest(this.props.appId, () => {
            setTimeout(this.props.setWidth)
          })
        })
    }
  };

  onPlatformChange = (e) => {
    this.setState({
      store: e.target.value
    });
  }

  render() {
    const { group, application } = this.props

    return (
      <div className="add-products__groups-item">
        <SweetAlert
          isOpen={this.state.alertOpen}
          type="warning"
          title={"Confirm removal"}
          text="Do you really want to remove this group? This can not be undone"
          confirmButtonText="Remove"
          cancelButtonText="Cancel"
          callback={this.handleCallbackAlert}
        />

        {this.state.optionsOpen && (
          <div className="custom-select__overlay" onClick={this.toggleOpen} />
        )}

        <div className="add-products__groups-item__info">
          <div className="add-products__groups-item__info-name">
            {group.name}
          </div>
          <div className="add-products__groups-item__info-settings fr">
            <svg
              ref="customselect"
              onClick={this.toggleOpen}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z"
                fill="#0085FF"
              />
              <path
                d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                fill="#0085FF"
              />
              <path
                d="M19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14Z"
                fill="#0085FF"
              />
            </svg>
            {this.state.optionsOpen && (
              <Aux>
                <div
                  ref="menu"
                  className="custom-select__outer"
                  style={{ top: this.state.top, left: this.state.left }}
                >
                  <div className="custom-select__outer-menu">
                    <div
                      className="custom-select__outer-menu__item"
                      onClick={this.handleEditGroup}
                    >
                      <svg
                        className="va-middle integrations-customselect__icon"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.33698 3.53932L13.0491 9.25302L9.25377 13.0473L3.54168 7.33355L7.33698 3.53932Z"
                          fill="#1A344B"
                        />
                        <path
                          d="M2.59864 6.39333L2.11864 5.914C1.07264 4.868 1.07264 3.16533 2.11864 2.11867C3.16464 1.07267 4.86798 1.07267 5.91398 2.11867L6.39331 2.59867L2.59864 6.39333Z"
                          fill="#1A344B"
                        />
                        <path
                          d="M10.4013 13.7867L13.8387 14.6453C14.066 14.7013 14.3067 14.6353 14.472 14.47C14.6373 14.3047 14.704 14.064 14.6473 13.8373L13.788 10.4L10.4013 13.7867Z"
                          fill="#1A344B"
                        />
                      </svg>
                      <span className="custom-select__outer-menu__item-label">
                        Edit
                      </span>
                    </div>
                    <div
                      className="custom-select__outer-menu__item"
                      onClick={this.removeProductGroup}
                    >
                      <svg
                        className="va-middle integrations-customselect__icon"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 3.33267V2H6V3H2V5H14V3.33267H10Z"
                          fill="#FF0C46"
                        />
                        <path
                          d="M3 6V13.7143C3 14.4227 3.64071 15 4.42857 15H11.5714C12.3593 15 13 14.4227 13 13.7143V6H3ZM7.5 12.5H6V8.5H7.5V12.5ZM10 12.5H8.5V8.5H10V12.5Z"
                          fill="#FF0C46"
                        />
                      </svg>
                      <span className="custom-select__outer-menu__item-label text-red">
                        Remove
                      </span>
                    </div>
                  </div>
                </div>
              </Aux>
            )}
          </div>
        </div>
        <div className="add-products__groups-item__products">
          {group.products.map((product, index) => (
            <Product
              setWidth={this.props.setWidth}
              key={product.id}
              product={product}
              appId={this.props.appId}
            />
          ))}
          <div
            className="add-products__groups-add add-products__groups-add_product"
            onClick={this.handleAddProduct}
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
            <span>Add product</span>
          </div>
        </div>

        <Modal
          isOpen={this.state.groupEditOpen}
          onRequestClose={this.closeUpdateGroupModal}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Add products group"
        >
          <div style={{ padding: "20px 30px" }}>
            <div className="newapp-header__title">Edit group</div>
            <div className="input-wrapper">
              <label className={"l-p__label"} htmlFor="login">
                Name
              </label>
              <input
                onChange={this.handleChangeValue.bind(this, "groupName")}
                value={this.state.groupName}
                autoFocus={true}
                className={this.productGroupInputClasses("groupName")}
                placeholder="Products group's name"
              />
            </div>
            <div className="input-wrapper">
              <button
                className="button button_blue popup-button fl"
                onClick={this.closeUpdateGroupModal}
              >
                <span>Cancel</span>
              </button>
              <button
                onClick={this.updateProductGroup}
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
                <span>Save</span>
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.productAddOpen}
          onRequestClose={this.closeProductCreateModal}
          ariaHideApp={false}
          style={customStyles}
          contentLabel="Add new product"
        >
          <div style={{ padding: "20px 30px" }}>
            <div className="newapp-header__title">Add new product</div>
            {(application.package_name && application.bundle_id) && (<div className="input-wrapper ta-left" style={{ paddingLeft: 4 }}>
              <InputRadio
                checked={this.state.store === 'app_store'}
                label="iOS"
                onChange={this.onPlatformChange}
                value="app_store"
              />
              <InputRadio
                checked={this.state.store === 'play_store'}
                label="Android"
                onChange={this.onPlatformChange}
                value="play_store"
              />
            </div>)}
            <div className="input-wrapper">
              <label className="l-p__label" htmlFor="login">
                Product ID
              </label>
              <div className="input-wrapper__required">
                <input
                  autoFocus={true}
                  value={this.state.productId}
                  onChange={this.handleChangeValue.bind(this, "productId")}
                  className={this.productInputClasses("productId")}
                  placeholder="Product id"
                />
                <span className="required-label">Required</span>
              </div>
            </div>
            <div className="input-wrapper">
              <button
                className="button button_blue popup-button fl"
                onClick={this.closeProductCreateModal}
              >
                <span>Cancel</span>
              </button>
              <button
                onClick={this.createProduct}
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
        <Modal
          isOpen={this.state.warningPopupIsOpen}
          onRequestClose={this.handleCloseWarningPopup}
          ariaHideApp={false}
          style={customStyles}
          contentLabel="Add new product"
        >
          <div style={{ padding: "20px 30px" }}>
            <div className="input-wrapper">
              Renaming product group name will also update "Product Group" filter in Charts and Users page to a new value.  You will not be able to filter Users and Charts with old product group name. Do you wish to continue?
            </div>
            <div className="input-wrapper">
              <button
                className="button button_blue popup-button fl"
                onClick={this.handleCloseWarningPopup}
              >
                <span>Cancel</span>
              </button>
              <button
                onClick={this.handleClickRenameOnWarningModal}
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
                <span>Rename</span>
              </button>
            </div>
          </div>
        </Modal>
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
  fetchProductGroupsRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(Group)
