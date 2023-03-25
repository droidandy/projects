import React, { Component } from "react"
import { connect } from "react-redux"
import Aux from "../../../../../../hoc/Aux"
import Tip from "../../../../../Common/Tip"
import InputGroupSelect from "../../../../../Common/InputGroupSelect"
import ColorPicker from "../../../../../Common/ColorPicker"
import TaggableTextarea from "../../../../../Common/TaggableTextarea"
import InputSelect from "../../../../../Common/InputSelect"
import ScreenPicker from "../../../../../Common/ScreenPicker"
import ScreenImageUploader from "./Settings/ScreenImageUploader"
import TextStyle from "./Settings/TextStyle"
import TextAlign from "./Settings/TextAlign"
import InputRadio from "containers/Common/InputRadio"

class ScreensBuilderSchemaFieldsSettings extends Component {
  getTextValue = (value) => {
    const { language } = this.props
    let resultValue = ""

    if (value.constructor === String) resultValue = value

    if (value.constructor === Object) resultValue = value[language]

    return resultValue
  };

  componentDidMount() {
    const { field, findSchemaField, schemaItem, handleChangeProductOnType } = this.props;

    Object.keys(field).forEach((key) => {
      const schemaField = findSchemaField(schemaItem, key)
      if (schemaField.type === "promo_offer") {
        if (field[schemaField.id]?.offer_id === "") {
          handleChangeProductOnType(true)
        }
      }
    })
  }

  changeProductOnType = (fieldKey, key) => {
    if (!this.props.productOnTap) {
      const { schemaItem, optionIndex, handleValueChanged } = this.props;
      handleValueChanged(
        Object.assign({}, fieldKey, {
          offer_id: ''
        }),
        schemaItem,
        key,
        optionIndex
      )
    }
    this.props.handleChangeProductOnType()
  }

  render() {
    const {
      field,
      findSchemaField,
      fieldNotValid,
      schemaItem,
      handleValueChanged,
      urlClasses,
      productIdClasses,
      textareaClasses,
      offerIdClasses,
      numberClasses,
      actionClasses,
      productGroups,
      optionIndex,
      productIdValue,
      language,
      application,
      screens,
      productOnTap,
      handleChangeProductOnType
    } = this.props

    const { changeProductOnType } = this

    return Object.keys(field).map(
      (key, index1) =>
        findSchemaField(schemaItem, key).id !== "font" && (
          <div
            className={
              "input-wrapper ta-left " +
              (index1 === 0 && " input-wrapper_first")
            }
            key={index1}
          >
            {findSchemaField(schemaItem, key).label && (
              <label
                className="l-p__label l-p__label_inline"
                htmlFor={findSchemaField(schemaItem, key).id}
              >
                {findSchemaField(schemaItem, key).label}
              </label>
            )}
            {findSchemaField(schemaItem, key).type === "separator" && (
              <div className="purchase-screen__separator" />
            )}
            {findSchemaField(schemaItem, key).type === "hide" && (
              <Aux>
                <input
                  id={schemaItem.slug + findSchemaField(schemaItem, key).id}
                  type="checkbox"
                  className="purchase-screen__hide-checkbox"
                  checked={field[key]}
                  onChange={(e) => {
                    handleValueChanged(
                      e.target.checked,
                      schemaItem,
                      key,
                      optionIndex
                    )
                  }}
                />
                <label
                  htmlFor={
                    schemaItem.slug + findSchemaField(schemaItem, key).id
                  }
                  className="purchase-screen__hide-checkbox__label"
                >
                  {field[key] ? "Show block" : "Hide block"}
                </label>
              </Aux>
            )}
            {findSchemaField(schemaItem, key).type === "text" && (
              <TaggableTextarea
                className={textareaClasses(
                  schemaItem,
                  findSchemaField(schemaItem, key),
                  optionIndex
                )}
                value={this.getTextValue(field[key])}
                onChange={(value) => {
                  handleValueChanged(value, schemaItem, key, optionIndex)
                }}
                productGroups={productGroups}
                placeholder={findSchemaField(schemaItem, key).placeholder}
                language={language}
                behavior="input"
              />
            )}
            {findSchemaField(schemaItem, key).type === "textarea" && (
              <TaggableTextarea
                className={textareaClasses(
                  schemaItem,
                  findSchemaField(schemaItem, key),
                  optionIndex
                )}
                value={this.getTextValue(field[key])}
                placeholder={findSchemaField(schemaItem, key).placeholder}
                onChange={(value) => {
                  handleValueChanged(value, schemaItem, key, optionIndex)
                }}
                productGroups={productGroups}
                language={language}
              />
            )}
            {findSchemaField(schemaItem, key).type === "url" && (
              <div className="input-wrapper__required">
                <input
                  value={field[key]}
                  onChange={(e) => {
                    handleValueChanged(
                      e.target.value,
                      schemaItem,
                      key,
                      optionIndex
                    )
                  }}
                  id={findSchemaField(schemaItem, key).id}
                  placeholder={findSchemaField(schemaItem, key).placeholder}
                  type="text"
                  name={findSchemaField(schemaItem, key).id}
                  className={urlClasses(
                    schemaItem,
                    findSchemaField(schemaItem, key),
                    optionIndex
                  )}
                />
                {findSchemaField(schemaItem, key).required && (
                  <span className="required-label">Required</span>
                )}
              </div>
            )}
            {findSchemaField(schemaItem, key).type === "color" && (
              <ColorPicker
                value={field[key]}
                onChange={(value) => {
                  handleValueChanged(value, schemaItem, key, optionIndex)
                }}
              />
            )}
            {findSchemaField(schemaItem, key).type === "image" && (
              <ScreenImageUploader
                fieldNotValid={fieldNotValid(
                  schemaItem,
                  findSchemaField(schemaItem, key),
                  "",
                  optionIndex
                )}
                value={field[key]}
                onChange={(value) => {
                  handleValueChanged(value, schemaItem, key, optionIndex)
                }}
              />
            )}
            {findSchemaField(schemaItem, key).type === "number" && (
              <input
                value={field[key]}
                onChange={(e) => {
                  handleValueChanged(
                    e.target.value,
                    schemaItem,
                    key,
                    optionIndex,
                    e
                  )
                }}
                id={findSchemaField(schemaItem, key).id}
                placeholder={findSchemaField(schemaItem, key).placeholder}
                type="number"
                min={0}
                pattern="\d*"
                name={findSchemaField(schemaItem, key).id}
                className={numberClasses(
                  schemaItem,
                  findSchemaField(schemaItem, key),
                  optionIndex
                )}
              />
            )}
            {findSchemaField(schemaItem, key).type === "text_style" && (
              <TextStyle
                value={field[key]}
                onChange={(value) => {
                  handleValueChanged(value, schemaItem, key, optionIndex)
                }}
              />
            )}
            {findSchemaField(schemaItem, key).type === "text_align" && (
              <TextAlign
                value={field[key]}
                onChange={(value) => {
                  handleValueChanged(value, schemaItem, key, optionIndex)
                }}
              />
            )}
            {findSchemaField(schemaItem, key).type === "promo_offer" && (
              <Aux>
                {/* <Tip
              title='Product ID'
              description='Select a parent product of the promotional offer'
              buttonUrl='https://docs.apphud.com/win-back/purchase-screens'
            /> */}
                <InputRadio label={'Purchase product on tap'} onChange={() => changeProductOnType(field[key], key)} checked={productOnTap}></InputRadio>
                <InputRadio label={'Purchase promo offer on tap'} onChange={() => changeProductOnType(field[key], key)} checked={!productOnTap}></InputRadio>
                <div className="input-wrapper">
                  <InputGroupSelect
                    name="product_id"
                    value={productIdValue(field[key].product_id)}
                    onChange={(item) => {
                      handleValueChanged(
                        Object.assign({}, field[key], {
                          product_id: item.product_id
                        }),
                        schemaItem,
                        key,
                        optionIndex
                      )
                    }}
                    isSearchable={false}
                    autoFocus={false}
                    clearable={false}
                    getOptionLabel={({ label }) => label}
                    getOptionValue={({ product_id }) => product_id}
                    classNamePrefix="input-select"
                    className={productIdClasses(
                      schemaItem,
                      findSchemaField(schemaItem, key),
                      optionIndex
                    )}
                    placeholder="Product ID"
                    options={productGroups}
                  />
                  {!productOnTap &&
                    <div className="input-wrapper__required mt5">
                      <input
                        value={field[key].offer_id}
                        onChange={(e) => {
                          handleValueChanged(
                            Object.assign({}, field[key], {
                              offer_id: e.target.value
                            }),
                            schemaItem,
                            key,
                            optionIndex
                          )
                        }}
                        id="name"
                        placeholder="Promo offer ID"
                        type="text"
                        name="offer_id"
                        required
                        className={offerIdClasses(
                          schemaItem,
                          findSchemaField(schemaItem, key),
                          optionIndex
                        )}
                      />
                      <span className="required-label">Required</span>
                    </div>
                  }
                </div>
              </Aux>
            )}
            {findSchemaField(schemaItem, key).type === "action" && (
              <Aux>
                <InputSelect
                  name="action"
                  value={findSchemaField(schemaItem, key).options.find(
                    (o) => o.value === field[key].action
                  )}
                  onChange={(item) => {
                    handleValueChanged(
                      Object.assign({}, field[key], { action: item.value }),
                      schemaItem,
                      key,
                      optionIndex
                    )
                  }}
                  isSearchable={false}
                  getOptionLabel={({ name }) => name}
                  getOptionValue={({ value }) => value}
                  autoFocus={false}
                  clearable={false}
                  classNamePrefix="input-select"
                  className={actionClasses(
                    schemaItem,
                    findSchemaField(schemaItem, key),
                    optionIndex
                  )}
                  options={findSchemaField(schemaItem, key).options}
                />
                {field[key].action === "present_screen" && (
                  <div className="input-wrapper">
                    <label className="l-p__label">
                      Select screen to present
                    </label>
                    <ScreenPicker
                      appId={application.id}
                      screens={screens}
                      onChange={(screen_id) => {
                        handleValueChanged(
                          Object.assign({}, field[key], { screen_id }),
                          schemaItem,
                          key,
                          optionIndex
                        )
                      }}
                      value={field[key].screen_id}
                    />
                  </div>
                )}
              </Aux>
            )}
            <div
              className="input-wrapper__bottom-text"
              dangerouslySetInnerHTML={{
                __html: findSchemaField(schemaItem, key).info
              }}
            />
          </div>
        )
    )
  }
}

const mapStateToProps = (state) => {
  return {
    application: state.application
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreensBuilderSchemaFieldsSettings)
