import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import Modal from "react-modal"
import Aux from "../../../../hoc/Aux"
import classNames from "classnames"
import axios from "axios"
import { fetchProductGroupsRequest } from "../../../../actions/productGroups"
import SweetAlert from "react-swal"
import { AndroidIcon } from "components/Icons"
import { AppleIcon } from "components/Icons"
import DefaultInput from "components/DefaultInput"

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

class Product extends Component {
  state = {
    optionsOpen: false,
    productName: "",
    productId: "",
    productEditOpen: false,
    alertOpen: false
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

  remove = () => {
    this.setState({ alertOpen: true, optionsOpen: false })
  };

  handleCallbackAlert = (value) => {
    this.setState({ alertOpen: false })
    if (value) {
      alert("remove")
    }
  };

  productInputClasses = (field) => {
    return classNames("input input_stretch input_blue", {
      input_error: this.state.updateProductSubmitted && !this.state[field]
    })
  };

  closeUpdateProductModal = () => {
    this.setState({ productEditOpen: false })
  };

  openEditProductModal = () => {
    this.setState({ productEditOpen: true })
    this.toggleOpen()
  };

  componentDidMount() {
    this.setState({
      productId: this.props.product.product_id
    })
  }

  handleChangeValue = (field, e) => {
    this.setState({ [field]: e.target.value })
  };

  updateProduct = () => {
    this.setState({ updateProductSubmitted: true })
    var productGroup = {
      product_id: this.state.productId
    }

    axios
      .put(`/products/${this.props.product.id}`, productGroup)
      .then((response) => {
        this.props.fetchProductGroupsRequest(this.props.appId, () => {
          setTimeout(this.props.setWidth)
        })
        this.closeUpdateProductModal()
        this.setState({ updateProductSubmitted: false })
      })
  };

  removeProduct = () => {
    this.setState({ alertOpen: true })
    this.toggleOpen()
  };

  handleCallbackAlert = (value) => {
    this.setState({ alertOpen: false })

    if (value) {
      axios.delete(`/products/${this.props.product.id}`).then((response) => {
        this.props.fetchProductGroupsRequest(this.props.appId, () => {
          setTimeout(this.props.setWidth)
        })
      })
    }
  };

  renderProductIcon = () => {
    const { store } = this.props.product;

    return store == "app_store" ? <AppleIcon color="#97ADC6" /> : <AndroidIcon color="#97ADC6" />;
  }

  render() {
    const { product } = this.props

    return (
      <div className="add-products__groups-item__products-item">
        <SweetAlert
          isOpen={this.state.alertOpen}
          type="warning"
          title={"Confirm removal"}
          text="Do you really want to remove this product? This can not be undone"
          confirmButtonText="Remove"
          cancelButtonText="Cancel"
          callback={this.handleCallbackAlert}
        />
        <div className="add-products__groups-item__products-item__info">
          <div className="add-products__groups-item__products-item__name">
            {this.renderProductIcon()}
            {product.product_id}
          </div>
          <div className="add-products__groups-item__products-item__description">
            {product.description}
          </div>
        </div>
        <div className="add-products__groups-item__products-item__settings fr">
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
                className="custom-select__overlay"
                onClick={this.toggleOpen}
              />
              <div
                ref="menu"
                className="custom-select__outer"
                style={{ top: this.state.top, left: this.state.left }}
              >
                <div className="custom-select__outer-menu">
                  <div
                    className="custom-select__outer-menu__item"
                    onClick={this.openEditProductModal}
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
                    onClick={this.removeProduct}
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
        <Modal
          isOpen={this.state.productEditOpen}
          onRequestClose={this.closeUpdateGroupModal}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Add products product"
        >
          <div style={{ padding: "20px 30px" }}>
            <div className="newapp-header__title">Edit product</div>
            <div className="input-wrapper">
              <label className={"l-p__label"} htmlFor="login">
                Product ID
              </label>
              <DefaultInput
                trimValue
                onChange={this.handleChangeValue.bind(this, "productId")}
                value={this.state.productId}
                className={this.productInputClasses("productId")}
                placeholder="Product ID"
              />
            </div>
            <div className="input-wrapper">
              <button
                className="button button_blue popup-button fl"
                onClick={this.closeUpdateProductModal}
              >
                <span>Cancel</span>
              </button>
              <button
                onClick={this.updateProduct}
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
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions
  }
}

const mapDispatchToProps = {
  fetchProductGroupsRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(Product)
