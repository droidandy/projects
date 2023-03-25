import React, { useState } from 'react'
import classnames from 'classnames'
import { CopyToClipboard } from "react-copy-to-clipboard"

import styles from './index.module.css'

import copyIcon from '../../assets/images/icons/copy-icon.svg'

const TextArea = ({
   label,
   value,
   id,
   type,
   onChange = () => {},
   required,
   className,
   errors = [],
   disabled,
   placeholder = '',
   bottomText,
   showHideButton,
   rightLabel,
   copyButton,
   autoComplete = 'off',
   rows = 5
 }) => {
  const getClassName = (id) => {
    const find = errors.find((i) => i === id)
    return find
      ? 'input input_stretch input_blue input_error'
      : 'input input_stretch input_blue'
  }

  const [hideInputText, setHideInputText] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const onCopyButtonClick = () => {
    setCopiedUrl(true);
    setTimeout(() => {
      setCopiedUrl(false);
    }, 1000);
  };

  const leftPadding = copyButton || showHideButton;

  return (
    <div className={classnames(className, 'input-wrapper ta-left')}>
      <label
        className={
          `${ required ? classnames('l-p__label', styles['required']) : 'l-p__label'} d-inline-block`
        }
      >
        {label}
      </label>
      { rightLabel && <span className="input-wrapper__right-label">
        { rightLabel }
      </span> }
      <div className="input-wrapper__required">
        <textarea
          value={value}
          onChange={(e) => onChange({ id, value: e.target.value, type })}
          id={id}
          placeholder={placeholder}
          name={id}
          className={`${getClassName(id)} ${leftPadding ? '' : 'pr0'} ${copyButton ? 'input_copy-text-button' : ''}`}
          disabled={disabled}
          autoComplete={autoComplete}
          style={{resize: 'none'}}
          rows={rows}
        />
        {showHideButton && <span
          className="required-label cp"
          onClick={() => setHideInputText(!hideInputText)}
        >
          { hideInputText ? <span className="noselect">View</span>: <span className="noselect">Hide</span>}
        </span>}
        {copyButton && <CopyToClipboard
          onCopy={onCopyButtonClick}
          text={value}
        >
          <span className="input-copy-icon">
            {!copiedUrl && <img src={copyIcon} alt="copyIcon" />}
            {copiedUrl && "Copied"}
          </span>
        </CopyToClipboard>}
      </div>
      {bottomText && <div
        className="input-wrapper__bottom-text"
      >
        { bottomText }
      </div>}
    </div>
  )
}

export default TextArea
