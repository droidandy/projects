import React from "react"

const RuleNavigation = (props) => {
  const { saving, handleBack, handleNext, backDisabled } = props

  return (
    <div className="rules-bottom__panel">
      {handleBack && (
        <button
          disabled={backDisabled}
          onClick={handleBack}
          className="button button_160 button_blue button_icon rules-bottom__panel-button"
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
              d="M3.41422 6.53554L6.94975 3L8.36396 4.41421L5.77817 7H13V9H5.87868L8.36396 11.4853L6.94975 12.8995L3.41421 9.36396L2 7.94975L3.41422 6.53554Z"
              fill="white"
            />
          </svg>
          <span>Back</span>
        </button>
      )}
      {handleNext && (
        <button
          disabled={saving}
          onClick={handleNext}
          className="button button_255 button_green button_icon button_icon-right"
        >
          <span>{saving ? "Loading..." : "Save and continue"}</span>
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
              d="M11.5858 9.46446L8.05025 13L6.63604 11.5858L9.22183 9L2 9L2 7L9.12132 7L6.63604 4.51471L8.05025 3.1005L11.5858 6.63604L13 8.05025L11.5858 9.46446Z"
              fill="white"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

export default RuleNavigation
