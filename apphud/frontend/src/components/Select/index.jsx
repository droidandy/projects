import React from 'react'
import styles from './index.module.css'
import classnames from 'classnames'
import { DropdownIcon } from 'components/Icons'

const Select = (props) => {
  const {
    list = [],
    label,
    className,
    onChange,
    id,
    disabled,
    type,
    errors,
    required,
    renderItem,
    value,
    defaultValue,
  } = props

  const getClassName = (id) => {
    const find = errors.find((i) => i === id)
    return find
      ? classnames(
          'input',
          'input_stretch',
          'input_blue',
          styles['select'],
          'input_error'
        )
      : classnames('input', 'input_stretch', 'input_blue', styles['select'])
  }

  const getClassNamelabel = required
    ? classnames('l-p__label', styles['required'])
    : 'l-p__label'

  return (
    <div className={classnames(className, 'input-wrapper ta-left')}>
      <input type="hidden" value="something" />
      <label className={getClassNamelabel}>{label}</label>
      <div className="input-wrapper__required">
        <div className={styles['wrapper']}>
          <select
            onChange={(e) => onChange({ id, value: e.target.value, type })}
            className={classnames(
              'input',
              'input_stretch',
              'input_blue',
              styles['select']
            )}
            className={getClassName(id)}
            disabled={disabled}
            defaultValue={defaultValue}
          >
            {!value && <option>{label}</option>}
            {list.map((i, key) => renderItem(i, key))}
          </select>
          <DropdownIcon
            className={styles['icon']}
            opacity={disabled ? 0.3 : 1}
          />
        </div>
      </div>
    </div>
  )
}

export default Select
