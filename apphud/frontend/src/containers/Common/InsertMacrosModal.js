import React, { Component } from "react"
import { connect } from "react-redux"
import Modal from "react-modal"
import InputGroupSelect from "./InputGroupSelect"
import classNames from "classnames"
import Tip from "./Tip"
import DefaultInput from "components/DefaultInput"

const customStylesPopUp = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
    borderRadius: 8,
    width: 410,
    overlfow: "visible"
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100
  }
}

class InsertMacrosModal extends Component {
  state = {
    product_id: "",
    offer_id: "",
    submitted: false
  };

  componentDidMount() {
    if (this.props.macros) {
      const { productId, offerId } = this.props.macros.data

      this.setState({
        offer_id: offerId,
        product_id: productId
      })
    }
  }

  productIdValue = (value) => {
    const productGroups = this.props.productGroups.slice(0)
    let product
    productGroups.forEach((group) => {
      const find = group.options.find((option) => option.product_id === value)

      if (find) product = find
    })
    return product
  };

  handleChangeProductId = ({ product_id }) => {
    this.setState({ product_id: product_id })
  };

  productIdClasses = () => {
    const { submitted, product_id } = this.state

    return classNames("input-select_blue", {
      select_error: submitted && !product_id
    })
  };

  offerIdClasses = () => {
    const { submitted, offer_id } = this.state

    return classNames("input input_blue input_stretch", {
      input_error:
        submitted && this.props.currentMacros === "offer_price" && !offer_id
    })
  };

  handleChangeOfferId = (e) => {
    this.setState({ offer_id: e.target.value })
  };

  submit = () => {
    const { product_id, offer_id } = this.state

    this.setState({ submitted: true })

    if (
      (this.props.currentMacros === "regular_price" && product_id) ||
      (this.props.currentMacros === "offer_price" && offer_id && product_id)
    ) {
      this.props.handleInsertMacros(
        product_id,
        offer_id,
        this.props.currentMacros
      )
      this.props.handleClosePopupInsertMacros()
    }
  };

  render() {
    const {
      handleClosePopupInsertMacros,
      productGroups,
      macros,
      currentMacros
    } = this.props

    const { product_id, offer_id } = this.state

    return (
      <Modal
        isOpen={true}
        className="ReactModal__Content ReactModal__Content-visible"
        onRequestClose={handleClosePopupInsertMacros}
        ariaHideApp={false}
        style={customStylesPopUp}
        contentLabel="Insert price"
      >
        <div
          style={{ padding: "20px 30px" }}
          className="purchase-screen__edit-insert__macros-modal"
        >
          <div className="newapp-header__title">Insert price macros</div>
          <div className="purchase-screen__edit-popup__desc">
            {currentMacros === "regular_price"
              ? "Apphud will automatically substitute this macros with the product price."
              : "Apphud will automatically substitute this macros with the Subscription offer price."}
          </div>
          <div className="input-wrapper">
            <label className={"l-p__label l-p__label_inline"} htmlFor="login">
              Product ID
            </label>
            <Tip
              title="Product ID"
              description={
                currentMacros === "offer_price"
                  ? "Select a parent product of the promotional offer."
                  : "Select a product which price you want to display."
              }
              buttonUrl="https://docs.apphud.com/rules-and-screens/screens"
            />
            <InputGroupSelect
              name="product_id"
              value={this.productIdValue(product_id)}
              onChange={this.handleChangeProductId}
              isSearchable={false}
              autoFocus={false}
              clearable={false}
              getOptionLabel={({ label }) => label}
              getOptionValue={({ product_id }) => product_id}
              classNamePrefix="input-select"
              className={this.productIdClasses()}
              placeholder="Select product ID"
              options={productGroups}
            />
          </div>
          {currentMacros === "offer_price" && (
            <div className="input-wrapper">
              <label className="l-p__label l-p__label_inline" htmlFor="login">
                Offer ID
              </label>
              <Tip
                title="Promotional offer ID"
                description="Enter a promotional offer ID which price you want to display."
                buttonUrl="https://docs.apphud.com/rules-and-screens/screens"
              />
              <DefaultInput
                trimValue
                value={offer_id}
                onChange={this.handleChangeOfferId}
                id="name"
                placeholder="Promo offer ID"
                type="text"
                name="offer_id"
                required=""
                className={this.offerIdClasses()}
              />
            </div>
          )}
          <div className="input-wrapper">
            <button
              className="button button_blue popup-button fl"
              onClick={handleClosePopupInsertMacros}
            >
              <span>Cancel</span>
            </button>
            <button
              onClick={this.submit}
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
              {macros ? <span>Save</span> : <span>Insert</span>}
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

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(InsertMacrosModal)
