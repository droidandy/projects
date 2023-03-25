import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink } from "react-router-dom"
import Collapsible from "react-collapsible"
import classNames from "classnames"
import Aux from "../../../../../../hoc/Aux"
import { connectFont, uuidv4 } from "../../../../../../libs/helpers"
import ScreensBuilderSchemaFieldsSettings from "./ScreensBuilderSchemaFieldsSettings"

class PurchaseScreensSchemaFields extends Component {
  findSchemaField = (schema, id) => {
    return schema.fields.find((schemaItem) => schemaItem.id === id)
  };

  getFields = (items, schema) => {
    const newitemhash = {}

    schema.fields.forEach((field) => {
      newitemhash[field.id] = items[field.id]
    })

    return [newitemhash]
  };

  handleValueChanged = (
    value,
    schema,
    key,
    optionIndex,
    e = { target: { validity: { valid: true } } }
  ) => {
    let { data, onChange, language } = this.props
    const items = data[schema.slug] // hash or array

    if (this.findSchemaField(schema, key).type === "font") connectFont(value)

    if (e.target.validity.valid) {
      if (schema.collection) {
        if (
          ["text", "textarea"].indexOf(this.findSchemaField(schema, key).type) >
          -1
        ) { items[optionIndex][key][language] = value } else items[optionIndex][key] = value
      } else {
        if (
          ["text", "textarea"].indexOf(this.findSchemaField(schema, key).type) >
          -1
        ) { items[key][language] = value } else items[key] = value
      }

      data = Object.assign(data, {
        [schema.slug]: items
      })
      onChange(data)
      this.forceUpdate()
    }
  };

  fieldNotValid = (schemaItem, field, objectKey = "", optionIndex) => {
    const { data, submitted } = this.props
    let requiredInvalid = false

    if (schemaItem.collection) {
      if (objectKey && submitted && field.required) {
        if (!data[schemaItem.slug][optionIndex][field.id][objectKey]) { requiredInvalid = true }
      } else {
        requiredInvalid =
          field.required &&
          submitted &&
          data[schemaItem.slug][optionIndex][field.id].toString().length === 0
      }
    } else {
      if (objectKey && submitted && field.required) {
        if (!data[schemaItem.slug][field.id][objectKey]) {
          requiredInvalid = true
        }
      } else {
        requiredInvalid =
          field.required &&
          submitted &&
          data[schemaItem.slug][field.id].toString().length === 0
      }
    }

    return requiredInvalid
  };

  numberClasses = (schemaItem, field, optionIndex) => {
    return classNames("input input_stretch input_blue", {
      input_error: this.fieldNotValid(schemaItem, field, "", optionIndex)
    })
  };

  urlClasses = (schemaItem, field, optionIndex) => {
    const { language } = this.props
    return classNames("input input_stretch input_blue", {
      input_error: this.fieldNotValid(schemaItem, field, "", optionIndex)
    })
  };

  textareaClasses = (schemaItem, field, optionIndex) => {
    const { language } = this.props
    return classNames(
      "input purchase-screen__textarea input_stretch input_blue",
      {
        input_error: this.fieldNotValid(
          schemaItem,
          field,
          language,
          optionIndex
        )
      }
    )
  };

  productIdClasses = (schemaItem, field, optionIndex) => {
    return classNames("input-select_blue", {
      select_error: this.fieldNotValid(
        schemaItem,
        field,
        "product_id",
        optionIndex
      )
    })
  };

  offerIdClasses = (schemaItem, field, optionIndex) => {
    return classNames("input input_stretch input_blue", {
      input_error: this.fieldNotValid(
        schemaItem,
        field,
        "offer_id",
        optionIndex
      )
    })
  };

  actionClasses = (schemaItem, field, optionIndex) => {
    return classNames("input-select_blue", {
      select_error: this.fieldNotValid(
        schemaItem,
        field,
        "action",
        optionIndex
      )
    })
  };

  productIdValue = (value) => {
    const productGroups = this.props.productGroups.slice(0)
    let product
    productGroups.forEach((group) => {
      const find = group.options.find((option) => option.product_id === value)

      if (find) product = find
    })
    return product
  };

  schemaTabTriggerClasses = (schemaItem, optionIndex) => {
    let fieldsValid = true
    const { language, productOnTap } = this.props

    for (const field of schemaItem.fields) {
      if (["text", "textarea"].indexOf(field.type) > -1) {
        if (this.fieldNotValid(schemaItem, field, language, optionIndex)) {
          fieldsValid = false
          break
        }
      } else if (this.fieldNotValid(schemaItem, field, "", optionIndex)) {
        fieldsValid = false
        break
      }

      if (field.type === "promo_offer") {
        if (productOnTap) {
          if (this.fieldNotValid(schemaItem, field, "product_id", optionIndex)) {
            fieldsValid = false
            break
          }
        }
        else {
          if (this.fieldNotValid(schemaItem, field, "product_id", optionIndex)) {
            fieldsValid = false
            break
          }
          if (this.fieldNotValid(schemaItem, field, "offer_id", optionIndex)) {
            fieldsValid = false
            break
          }
        }
      }
    }

    return classNames("", {
      "purchase-screen__edit-collapsible__trigger_error":
        this.props.submitted && !fieldsValid,
      "purchase-screen__edit-collapsible__trigger_collection":
        schemaItem.collection
    })
  };

  handleAddDataItem = (schemaItem) => {
    const { data, onChange, language } = this.props
    const newDataItem = {
      id: uuidv4()
    }

    for (const field of schemaItem.fields) {
      if (["text", "textarea"].indexOf(field.type) > -1) { newDataItem[field.id] = { [language]: field.default } } else newDataItem[field.id] = field.default
    }

    data[schemaItem.slug].push(newDataItem)
    onChange(data)
    this.forceUpdate()
  };

  handleRemoveDataItem = (schemaItem, optionIndex) => {
    const { data, onChange } = this.props

    data[schemaItem.slug].splice(optionIndex, 1)
    onChange(data)
    this.forceUpdate()
  };

  collectionTrigger = (schemaItem, optionIndex) => {
    const { handleOpenTab } = this.props

    return (
      <div
        className="purchase-screen__edit-collapsible__trigger-item__inner"
        onClick={(e) => {
          handleOpenTab(`${schemaItem.slug}_${optionIndex}`, e)
        }}
      >
        <svg
          onClick={this.handleRemoveDataItem.bind(
            null,
            schemaItem,
            optionIndex
          )}
          className="purchase-screen__edit-item__remove-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM17 11H7V13H17V11Z"
            fill="#FF0C46"
          />
        </svg>
        <span className="va-middle">{`${schemaItem.name} ${optionIndex + 1
          }`}</span>
      </div>
    )
  };

  render() {
    const {
      data,
      schema,
      handleOpenTab,
      currentTab,
      productGroups,
      application,
      screens,
      language,
      handleChangeProductOnType,
      productOnTap
    } = this.props

    console.log(schema)
    return (
      <Aux>
        {schema.map((schemaItem, index) =>
          schemaItem.collection ? (
            <Aux key={index}>
              {data[schemaItem.slug].map((dataItem, optionIndex) => (
                <Collapsible
                  transitionTime={300}
                  transitionCloseTime={300}
                  open={currentTab === `${schemaItem.slug}_${optionIndex}`}
                  key={dataItem.id}
                  triggerDisabled={true}
                  classParentString="purchase-screen__edit-collapsible"
                  openedClassName="collapsible-is-open"
                  overflowWhenOpen="visible"
                  trigger={this.collectionTrigger(schemaItem, optionIndex)}
                  triggerClassName={this.schemaTabTriggerClasses(
                    schemaItem,
                    optionIndex
                  )}
                  triggerOpenedClassName={this.schemaTabTriggerClasses(
                    schemaItem,
                    optionIndex
                  )}
                >
                  {this.getFields(dataItem, schemaItem).map(
                    (field, fieldIndex) => (
                      <ScreensBuilderSchemaFieldsSettings
                        optionIndex={optionIndex}
                        language={language}
                        screens={screens}
                        key={fieldIndex}
                        field={field}
                        findSchemaField={this.findSchemaField}
                        fieldNotValid={this.fieldNotValid}
                        schemaItem={schemaItem}
                        handleValueChanged={this.handleValueChanged}
                        productOnTap={productOnTap}
                        handleChangeProductOnType={handleChangeProductOnType}
                        urlClasses={this.urlClasses}
                        productIdValue={this.productIdValue}
                        productIdClasses={this.productIdClasses}
                        textareaClasses={this.textareaClasses}
                        offerIdClasses={this.offerIdClasses}
                        actionClasses={this.actionClasses}
                        numberClasses={this.numberClasses}
                        productGroups={productGroups}
                      />
                    )
                  )}
                </Collapsible>
              ))}
              <div
                className="purchase-screen__edit-item__add-button"
                onClick={this.handleAddDataItem.bind(null, schemaItem)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM11 11V7H13V11H17V13H13V17H11V13H7V11H11Z"
                    fill="#20BF55"
                  />
                </svg>
                <span>Add option</span>
              </div>
            </Aux>
          ) : (
              <Collapsible
                transitionTime={300}
                transitionCloseTime={300}
                handleTriggerClick={(e) => {
                  handleOpenTab(schemaItem.slug, false)
                }}
                open={currentTab === schemaItem.slug}
                key={index}
                classParentString="purchase-screen__edit-collapsible"
                openedClassName="collapsible-is-open"
                overflowWhenOpen="visible"
                trigger={schemaItem.name}
                triggerClassName={this.schemaTabTriggerClasses(schemaItem)}
                triggerOpenedClassName={this.schemaTabTriggerClasses(schemaItem)}
              >
                {this.getFields(data[schemaItem.slug], schemaItem).map(
                  (field, fieldIndex) => (
                    <ScreensBuilderSchemaFieldsSettings
                      optionIndex={false}
                      key={fieldIndex}
                      language={language}
                      screens={screens}
                      field={field}
                      findSchemaField={this.findSchemaField}
                      fieldNotValid={this.fieldNotValid}
                      schemaItem={schemaItem}
                      handleValueChanged={this.handleValueChanged}
                      productOnTap={productOnTap}
                      handleChangeProductOnType={handleChangeProductOnType}
                      urlClasses={this.urlClasses}
                      productIdValue={this.productIdValue}
                      productIdClasses={this.productIdClasses}
                      textareaClasses={this.textareaClasses}
                      offerIdClasses={this.offerIdClasses}
                      actionClasses={this.actionClasses}
                      numberClasses={this.numberClasses}
                      productGroups={productGroups}
                    />
                  )
                )}
              </Collapsible>
            )
        )}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchaseScreensSchemaFields)
