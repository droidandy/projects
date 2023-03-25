import BaseForm from 'react-form-base'
import validateJs from 'validate.js'
import moment from 'moment'

function validate() {
  const errors = validateJs.single(...arguments)

  return errors && errors[0]
}

class Form extends BaseForm {
  static validations = {
    presence(value) {
      if (value === false) value = undefined

      return validate(value, { presence: true })
    },
    notUndefiend(value) {
      if (value === undefined) {
        return 'Can\'t be blank'
      }
    },
    email(value, options = true) {
      const prepared = (value || '').trim()

      if (!prepared) return null

      const res = validateJs.single(prepared, { email: options })

      if (res !== undefined) {
        return 'Email is not valid'
      }
    },
    personName(value, options) {
      if (!value) return

      return validate(value, {
        length: { maximum: (options && options.length) || 60 },
        format: { pattern: /^[^/|{}[\]%^]+$/, message: 'Invalid name. Avoid using special symbols' }
      })
    },
    isInPast(value) {
      if (!value) return
      if (moment(value).isAfter(moment())) return 'Date can\'t be in future'
    },
    phone(value) {
      if (!value) return
      return validate(value, {
        format: { pattern: /^\d{9}$/, message: 'Phone should contain 9 digits without region code' }
      })
    },
    isInsuranceNumber(value) {
      if (!value) return

      return validate(value, {
        format: { pattern: /^[aA-zZ]{2}\d{6}[aA-zZ]{1}$/, message: 'Invalid value. Standard format is XX000000X' }
      })
    }
  }

  getError(key) {
    const value = super.getError(key)

    return Array.isArray(value) ? value[0] : value
  }
}

export default Form
