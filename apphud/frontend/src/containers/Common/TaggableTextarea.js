import React, { Component } from "react"
import { connect } from "react-redux"
import ReactDOM from "react-dom"
import Aux from "../../hoc/Aux"
import InsertMacrosModal from "./InsertMacrosModal"
import titleize from "titleize"
import Liquid from "liquidjs"
import Tooltip from "rc-tooltip"
import AnnotationDrag from "../../libs/AnnotationDrag"
import { uuidv4 } from "../../libs/helpers"
import OfferSignatureModal from "./OfferSignatureModal"

class TaggableTextarea extends Component {
  state = {
    popupInsertMacros: false,
    value: "",
    currentMacros: "regular_price",
    offerSignatureModal: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.value !== this.state.value ||
      this.props.className !== nextProps.className ||
      this.state.popupInsertMacros !== nextState.popupInsertMacros
    )
  }

  replaceHTMLtags = (html) => {
    html = html.cloneNode(true)
    const macroses = html.querySelectorAll(".input-macros")

    for (var i = 0, len = macroses.length; i < len; i++) {
      const { productId, offerId, macros } = macroses[i].dataset
      const filter = macros === "offer_price" ? `price: "${offerId}"` : "price"
      const replaceTo = document.createElement("span")
      replaceTo.innerText = `{{"${productId}" | ${filter}}}`
      macroses[i].parentNode.replaceChild(replaceTo, macroses[i])
    }

    return html.innerText
  };

  emitChange = () => {
    const element = this.refs.editor
    const html = element.innerHTML
    const text = element.innerText

    if (this.props.onChange && html !== this.lastHtml) { this.props.onChange(this.replaceHTMLtags(element)) }

    this.lastHtml = html
  };

  handleClickMacros = (e) => {
    if (
      e.target.classList.contains("icon-close") ||
      e.target.tagName === "path"
    ) {
      if (e.target.tagName === "path") e.target.parentNode.parentNode.remove()
      else e.target.parentNode.remove()
      this.emitChange()
    } else {
      this.macros = {
        data: e.target.dataset,
        element: e.target
      }
      this.handleShowPopupInsertMacros(this.macros.data.macros)
    }
  };

  initMacroses = (element = this.refs.editor) => {
    const parent = this

    if (element.querySelectorAll(".input-macros").length > 0) {
      element.querySelectorAll(".input-macros").forEach((icon, i) => {
        icon.removeEventListener("click", parent.handleClickMacros)
        icon.addEventListener("click", parent.handleClickMacros)
      })
    }

    if (this.dragInstance) this.dragInstance.disengage()

    this.dragInstance = new AnnotationDrag({
      draggables: ".input-macros",
      dropzones: `#${this.id}`,
      noDrags: ".fancy img",
      onDragEnd: this.emitChange
    })
  };

  createElementFromString(htmlString) {
    var span = document.createElement("span")
    span.innerHTML = htmlString.trim()
    return span
  }

  placeCaretAtEnd(el) {
    el.focus()
    if (
      typeof window.getSelection !== "undefined" &&
      typeof document.createRange !== "undefined"
    ) {
      var range = document.createRange()
      range.selectNodeContents(el)
      range.collapse(false)
      var sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    } else if (typeof document.body.createTextRange !== "undefined") {
      var textRange = document.body.createTextRange()
      textRange.moveToElementText(el)
      textRange.collapse(false)
      textRange.select()
    }
  }

  getSelectionTextInfo(el) {
    var atStart = false
    var atEnd = false
    var selRange, testRange
    if (window.getSelection) {
      var sel = window.getSelection()
      if (sel.rangeCount) {
        selRange = sel.getRangeAt(0)
        testRange = selRange.cloneRange()

        testRange.selectNodeContents(el)
        testRange.setEnd(selRange.startContainer, selRange.startOffset)
        atStart = testRange.toString() === ""

        testRange.selectNodeContents(el)
        testRange.setStart(selRange.endContainer, selRange.endOffset)
        atEnd = testRange.toString() === ""
      }
    } else if (document.selection && document.selection.type !== "Control") {
      selRange = document.selection.createRange()
      testRange = selRange.duplicate()

      testRange.moveToElementText(el)
      testRange.setEndPoint("EndToStart", selRange)
      atStart = testRange.text === ""

      testRange.moveToElementText(el)
      testRange.setEndPoint("StartToEnd", selRange)
      atEnd = testRange.text === ""
    }

    return { atStart: atStart, atEnd: atEnd }
  }

  saveSelection = () => {
    if (window.getSelection) {
      const node =
        window.getSelection().baseNode &&
        window.getSelection().baseNode.parentNode
      if (node) {
        const isTextarea = node.classList.contains("purchase-screen__textarea")
        if (isTextarea && !this.getSelectionTextInfo(node).atEnd) {
          var sel = window.getSelection()
          if (sel.getRangeAt && sel.rangeCount) {
            return sel.getRangeAt(0)
          }
        }
      }
      return null
    } else if (document.selection && document.selection.createRange) {
      return document.selection.createRange()
    }
    return null
  };

  restoreSelection = (range) => {
    if (range) {
      if (window.getSelection) {
        var sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
      } else if (document.selection && range.select) {
        range.select()
      }
    }
  };

  insertTextAtCursor = (element) => {
    var sel, range
    if (window.getSelection) {
      sel = window.getSelection()
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0)
        range.deleteContents()
        range.insertNode(element)
      }
    } else if (document.selection && document.selection.createRange) {
      const text = element.innerText
      document.selection.createRange().text = text
    }
  };

  getSelectedNode = () => {
    if (document.selection) { return document.selection.createRange().parentElement() } else {
      var selection = window.getSelection()
      if (selection.rangeCount > 0) { return selection.getRangeAt(0).startContainer.parentNode }
    }
  };

  handleInsertMacros = (productId, offerId, macros) => {
    if (this.macros) {
      const macrosElement = this.macros.element

      macrosElement.dataset.macros = macros
      macrosElement.dataset.productId = productId
      macrosElement.dataset.offerId = offerId

      const innerHTML = `<svg class='icon-close' width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 0C2.2385 0 0 2.2385 0 5C0 7.7615 2.2385 10 5 10C7.7615 10 10 7.7615 10 5C10 2.2385 7.761 0 5 0ZM7.3535 6.6465L6.6465 7.3535L5 5.7075L3.3535 7.3535L2.6465 6.6465L4.2925 5L2.646 3.3535L3.353 2.647L4.9995 4.2935L6.646 2.647L7.353 3.3535L5.707 5L7.3535 6.6465Z" fill="white"/></svg>${macros.replace(
        /_/g,
        " "
      )}`
      macrosElement.innerHTML = innerHTML
      this.placeCaretAtEnd(this.refs.editor)
      this.emitChange()
      this.macros = undefined
    } else {
      const macrosElement = document.createElement("span")
      macrosElement.classList.add("input-macros")
      macrosElement.setAttribute("contenteditable", "false")

      macrosElement.dataset.macros = macros
      macrosElement.dataset.productId = productId
      macrosElement.dataset.offerId = offerId

      const innerHTML = `<svg class='icon-close' width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 0C2.2385 0 0 2.2385 0 5C0 7.7615 2.2385 10 5 10C7.7615 10 10 7.7615 10 5C10 2.2385 7.761 0 5 0ZM7.3535 6.6465L6.6465 7.3535L5 5.7075L3.3535 7.3535L2.6465 6.6465L4.2925 5L2.646 3.3535L3.353 2.647L4.9995 4.2935L6.646 2.647L7.353 3.3535L5.707 5L7.3535 6.6465Z" fill="white"/></svg>${macros.replace(
        /_/g,
        " "
      )}`
      macrosElement.innerHTML = innerHTML

      if (this.selection) {
        this.restoreSelection(this.selection)
        this.insertTextAtCursor(macrosElement)
      } else {
        this.refs.editor.appendChild(macrosElement)
        this.refs.editor.innerHTML += "&nbsp;"
      }
      this.placeCaretAtEnd(this.refs.editor)
      this.emitChange()
    }
  };

  respondValue = (value) => {
    this.replaceLiquidToHTML(value, () => {
      setTimeout(this.initMacroses)
    })
  };

  onPaste = (e) => {
    e.preventDefault()
    var text = (e.originalEvent || e).clipboardData.getData("text/plain")
    document.execCommand("insertHTML", false, text)
  };

  id = uuidv4();

  updateFromEditor = () => {
    this.respondValue(this.props.value)
  };

  componentDidMount() {
    this.respondValue(this.props.value)
    this.refs.editor.removeEventListener("paste", this.onPaste)
    this.refs.editor.addEventListener("paste", this.onPaste)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value.length !== this.props.value.length) { setTimeout(this.initMacroses) }
  }

  replaceLiquidToHTML = (value, cb) => {
    const engine = new Liquid()

    engine.registerFilter("price", (productId, offerId) => {
      let macrosHTML = `<span contenteditable='false' class='input-macros' data-macros='regular_price' data-product-id='${productId}'><svg class='icon-close' width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 0C2.2385 0 0 2.2385 0 5C0 7.7615 2.2385 10 5 10C7.7615 10 10 7.7615 10 5C10 2.2385 7.761 0 5 0ZM7.3535 6.6465L6.6465 7.3535L5 5.7075L3.3535 7.3535L2.6465 6.6465L4.2925 5L2.646 3.3535L3.353 2.647L4.9995 4.2935L6.646 2.647L7.353 3.3535L5.707 5L7.3535 6.6465Z" fill="white"/></svg>regular price</span>`

      if (offerId) { macrosHTML = `<span contenteditable='false' class='input-macros' data-macros='offer_price' data-product-id='${productId}' data-offer-id='${offerId}'><svg class='icon-close' width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 0C2.2385 0 0 2.2385 0 5C0 7.7615 2.2385 10 5 10C7.7615 10 10 7.7615 10 5C10 2.2385 7.761 0 5 0ZM7.3535 6.6465L6.6465 7.3535L5 5.7075L3.3535 7.3535L2.6465 6.6465L4.2925 5L2.646 3.3535L3.353 2.647L4.9995 4.2935L6.646 2.647L7.353 3.3535L5.707 5L7.3535 6.6465Z" fill="white"/></svg>offer price</span>` }

      return macrosHTML
    })
    engine.parseAndRender(value).then((value) => {
      this.setState({ value }, cb)
    })
  };

  keyPress = (event) => {
    if (event.charCode === 13) {
      if (this.props.behavior === "input") {
        event.preventDefault()
        return false
      } else {
        event.preventDefault()
        document.execCommand("insertHTML", true, "\n&zwnj;")
        return false
      }
    }
  };

  handleShowPopupInsertMacros = (currentMacros) => {
    const { application } = this.props

    this.refs.content.closest(".rc-tooltip").classList.add("rc-tooltip-hidden")

    if (
      currentMacros === "offer_price" &&
      !application.apple_subscription_key
    ) {
      this.handleToggleOfferSignatureModal()
    } else {
      this.selection = this.saveSelection()
      this.setState({
        currentMacros,
        popupInsertMacros: true
      })
    }
  };

  handleClosePopupInsertMacros = () => {
    this.macros = undefined
    this.selection = undefined
    this.setState({ popupInsertMacros: false })
  };

  handleToggleOfferSignatureModal = () => {
    this.setState({ offerSignatureModal: !this.state.offerSignatureModal })
    this.forceUpdate()
  };

  onSuccessOfferSignatureModal = () => {
    this.setState({ offerSignatureModal: false })
    this.handleShowPopupInsertMacros("offer_price")
    this.forceUpdate()
  };

  overlay = () => {
    return (
      <div>
        <div className="tip-content tip-content_right" ref="content">
          <div className="tip-content__title">
            What price macros would you like to insert?
          </div>
          <div className="tip-content__buttons">
            <button
              className="button button_orange button_inline tip-content__buttons-item"
              onClick={this.handleShowPopupInsertMacros.bind(
                null,
                "regular_price"
              )}
            >
              Regular price
            </button>
            <button
              className="button button_orange button_inline tip-content__buttons-item"
              onClick={this.handleShowPopupInsertMacros.bind(
                null,
                "offer_price"
              )}
            >
              Offer price
            </button>
          </div>
        </div>
      </div>
    )
  };

  render() {
    const {
      value,
      onChange,
      className,
      productGroups,
      behavior,
      placeholder,
      application
    } = this.props
    const { popupInsertMacros, offerSignatureModal } = this.state

    return (
      <Aux>
        {offerSignatureModal && (
          <OfferSignatureModal
            appId={application.id}
            close={this.handleToggleOfferSignatureModal}
            onSuccess={this.onSuccessOfferSignatureModal}
          />
        )}
        {popupInsertMacros && (
          <InsertMacrosModal
            currentMacros={this.state.currentMacros}
            macros={this.macros}
            productGroups={productGroups}
            handleInsertMacros={this.handleInsertMacros}
            handleClosePopupInsertMacros={this.handleClosePopupInsertMacros}
          />
        )}
        <div className="input-wrapper__hashbutton">
          <div
            id={this.id}
            ref="editor"
            className={className}
            style={behavior === "input" ? { minHeight: "auto" } : {}}
            onKeyPress={this.keyPress.bind(this)}
            contentEditable={true}
            placeholder={placeholder}
            onInput={this.emitChange}
            onBlur={this.emitChange}
            dangerouslySetInnerHTML={{ __html: this.state.value }}
          />
          <Tooltip
            ref="tooltip"
            mouseEnterDelay={0.2}
            placement="bottom"
            trigger={["click"]}
            overlay={this.overlay()}
          >
            <svg
              className="required-label required-label_textarea required-label_macros noselect"
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 0C4.02944 0 0 4.02944 0 9V10C0 14.9706 4.02944 19 9 19H10C14.9706 19 19 14.9706 19 10V9C19 4.02944 14.9706 0 10 0H9ZM5 6.5C5 5.11929 6.11929 4 7.5 4H8V5H7.5C6.67157 5 6 5.67157 6 6.5V7.5C6 8.3178 5.60733 9.04389 5.00024 9.5C5.60733 9.95612 6 10.6822 6 11.5V12.5C6 13.3284 6.67157 14 7.5 14H8V15H7.5C6.11929 15 5 13.8807 5 12.5V11.5C5 10.6716 4.32843 10 3.5 10H3V9H3.5C4.32843 9 5 8.32843 5 7.5V6.5ZM11.5 15C12.8807 15 14 13.8807 14 12.5V11.5C14 10.6716 14.6716 10 15.5 10H16V9H15.5C14.6716 9 14 8.32843 14 7.5V6.5C14 5.11929 12.8807 4 11.5 4H11V5H11.5C12.3284 5 13 5.67157 13 6.5V7.5C13 8.3178 13.3927 9.04388 13.9998 9.5C13.3927 9.95611 13 10.6822 13 11.5V12.5C13 13.3284 12.3284 14 11.5 14H11V15H11.5Z"
                fill="#F6921D"
              />
            </svg>
          </Tooltip>
        </div>
      </Aux>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    application: state.application
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(TaggableTextarea)
