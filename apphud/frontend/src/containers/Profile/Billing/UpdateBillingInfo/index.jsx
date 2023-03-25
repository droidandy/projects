import React, { useState, useEffect } from 'react'
import SweetAlert from 'react-swal'
import { NotificationManager } from 'libs/Notifications'
import styles from './index.module.css'
import classnames from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import { initialParamsFormData, prepareTaxIdList, findFormat, getTaxIdPlaceholder } from "./helpers"
import Input from 'components/Input'
import Select from 'components/Select'
import { updateBillingUserRequest } from 'actions/billing'
import countryList from 'country-list-js'
import { fetchTaxId, fetchTaxIdTypeRequest, fetchUserRequest } from 'actions/user'
import {track} from "../../../../libs/helpers";

const UpdateBillingInfo = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state)
  const { billing_address } = user
  let tax_id_type, country, county, tax_id_country
  if (billing_address) {
    tax_id_type = billing_address.tax_id_type
    tax_id_country = billing_address.tax_id_country
    country = billing_address.country
    const county = billing_address.state
  }
  const [alert, setAlert] = useState(false)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState([])
  const formKeys = Object.keys(formData)
  const updateTaxIdData = (payload) => {
    setFormData({
      ...formData,
      taxIdType: {
        ...formData.taxIdType,
        list: prepareTaxIdList({
          list: payload,
          value: formData.taxIdType.value,
        }),
      },
    })
    if (!formData.taxId) {
      setFormData({
        ...formData,
        taxId: {
          ...formData.taxId,
          placeholder: findFormat({
            list: payload,
            value: formData.taxIdType.value,
          }),
          value: findFormat({
            list: payload,
            value: formData.taxIdType.value,
          }),
        },
      })
    }
  }

  useEffect(() => {
    setInitialLoading(true);
    dispatch(fetchUserRequest((resUser) => {
      dispatch(fetchTaxIdTypeRequest((payload) => {
        const newUser = {...resUser, billing_address: {
            ...resUser.billing_address,
            tax_id_types: payload
          }
        }
        setFormData(initialParamsFormData({ user: newUser }));
        setInitialLoading(false);
      }));
    }));
  }, [])

  const handleCallbackAlert = (ok) => {
    if (ok) {
      setFormData(initialParamsFormData({ user }))
      setErrors([])
    }
    setAlert(false)
  }

  const validateForm = () => {
    const newerr = []
    formKeys.forEach((id) => {
      if (formData[id].value.length === 0 && formData[id].required) {
        if (id !== 'region') {
          newerr.push(id)
        }
        if (
          id === 'county' &&
          formData[id].list.length === 0 &&
          formData[id].required
        ) {
          newerr.push(id)
        }
      }
    })
    setErrors(newerr)
    return newerr
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const err = validateForm()
    if (err.length === 0) {
      setLoading(true);
      const tax_id_type = formData.taxIdType.value.split('.')[1];
      const tax_id_country = formData.taxIdType.value.split('.')[0];

      const sendForm = {
        name: formData.name.value,
        country: formData.region.value,
        line1: formData.streetAddress.value,
        line2: formData.streetAddress_2.value,
        city: formData.city.value,
        state: formData.county.value,
        postal_code: formData.postalCode.value,
        phone: formData.phone.value,
        tax_id_type,
        tax_id_country,
        tax_id: formData.taxId.value,
      }

      const cb = () => {
        setLoading(false);
        NotificationManager.success('User successfully saved', 'OK', 5000)
      }

      const err = () => {
        setLoading(false);
        NotificationManager.error('Error', 'OK', 5000)
      }

      dispatch(updateBillingUserRequest(sendForm, cb, err))
    }
    track("profile_billing_info_updated");
  }

  const handleChangeInput = (params) => {
    const { id, value } = params
    setErrors(errors.filter((i) => i !== id))
    if (id === 'region') {
      let list = countryList.findByName(value).provinces
      if (list) {
        list = list.map((i) => i.name)
        setFormData({
          ...formData,
          region: {
            ...formData.region,
            value,
          },
          county: {
            ...formData.county,
            list: list,
            type: 'select',
            elementType: 'select',
            required: true,
            disabled: false,
          },
        })
      } else {
        setFormData({
          ...formData,
          region: {
            ...formData.region,
            value,
          },
          county: {
            ...formData.county,
            type: 'input',
            elementType: 'input',
            required: true,
            disabled: false,
          },
        })
      }
    } else if (id === 'taxIdType') {
      dispatch(fetchTaxId(value))
      setFormData({
        ...formData,
        taxIdType: { ...formData[id], value },
        taxId: {
          ...formData.taxId,
          placeholder: getTaxIdPlaceholder(formData.taxIdType.list, value.split('.')[1], value.split('.')[0])
        },
      })
    } else {
      setFormData({ ...formData, [id]: { ...formData[id], value } })
    }
  }

  const renderItemSelect = (id, item, key) => {
    const getSelected = (id, dataItem, currentItem, country1, country2) => {
      if (id === 'taxIdType') {
        return country1 && country2 && `${country1}.${dataItem}` === `${country2}.${currentItem}`;
      } else {
        if (String(dataItem) === String(currentItem)) {
          return true
        }
      }
      return false;
    }
    if (id === 'region') {
      if (item) {
        return getSelected(id, country, item) ? (
          <option selected value={item} key={key}>
            {item}
          </option>
        ) : (
          <option key={key} value={item}>
            {item}
          </option>
        )
      }
    }
    if (id === 'county') {
      if (item) {
        return getSelected(id, county, item) ? (
          <option selected value={item} key={key}>
            {item}
          </option>
        ) : (
          <option key={key} value={item}>
            {item}
          </option>
        )
      }
    }
    if (id === 'taxIdType') {
      if (item) {
        return getSelected(id, tax_id_type, item.code, tax_id_country, item.country_iso) ? (
          <option selected value={`${item.country_iso}.${item.code}`} key={key}>
            {item.value}
          </option>
        ) : (
          <option key={key} value={`${item.country_iso}.${item.code}`}>
            {item.value}
          </option>
        )
      }
    }
  }

  const renderInput = (i, key) => {
    if (formData[i].elementType === 'select') {
      return (
        <Select
          label={formData[i].label}
          list={formData[i].list}
          renderItem={(item, key) =>
            renderItemSelect(formData[i].id, item, key)
          }
          className={styles['input-item']}
          onChange={handleChangeInput}
          id={formData[i].id}
          disabled={formData[i].disabled}
          type={formData[i].type}
          errors={errors}
          required={formData[i].required}
          placeholder={formData[i].placeholder}
          key={key}
          value={formData[i].value}
          defaultValue={formData[i].defaultValue}
        />
      )
    }
    return (
      <Input
        key={formData[i].id}
        label={formData[i].label}
        value={formData[i].value}
        onChange={handleChangeInput}
        id={formData[i].id}
        type={formData[i].type}
        required={formData[i].required}
        elementType={formData[i].elementType}
        className={styles['input-item']}
        selectList={formData[i].list}
        errors={errors}
        disabled={formData[i].disabled}
        placeholder={formData[i].placeholder}
        autoComplete="new-password"
      />
    )
  }

  return (
    <>
      {initialLoading ? (
        <div>
          <br/>
          <div className="animated-background timeline-item" /> <br/>
          <div className="animated-background timeline-item" /> <br/>
          <div className="animated-background timeline-item" /> <br/>
          <div className="animated-background timeline-item" />
        </div>
        ) : (
        <div className="c-c__b-billing__update-payment-method">
          <SweetAlert
            isOpen={alert}
            type="warning"
            title="Clear form"
            text="Do you really want to clear form?"
            confirmButtonText="Clear"
            cancelButtonText="Cancel"
            callback={handleCallbackAlert}
          />
          <form onSubmit={handleSubmit}>
            <div className={styles['billding-info-form']}>
              {formKeys.map((i, key) => renderInput(i, key))}
              <div className={styles['button-wrapper']}>
                <button
                  disabled={loading}
                  type="submit"
                  className={classnames(
                    'button',
                    'button_green',
                    'button_icon',
                    'button_160',
                    styles['button-success'],
                    styles['button']
                  )}
                >
                  {loading ? <span>Saving..</span> : <span>Save</span>}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default UpdateBillingInfo
