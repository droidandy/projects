import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink, Route } from "react-router-dom"
import history from "../../../../history"
import DashboardItem from "../../../../components/DashboardItem"
import CustomSelect from "../../../Common/CustomSelect"
import AnalyzeBar from "../../../Common/AnalyzeBar"
import Moment from "react-moment"

class Survey extends Component {
  render() {
    const {
      presentations_count,
      answers_count,
      answers,
      question
    } = this.props.screen

    return (
      <div className="dashboard-group__content">
        <div className="dashboard-row">
          <div className="rules-analyze__box">
            <DashboardItem
              title="Times presented"
              value={presentations_count}
              prefix=""
              autorenews={false}
              tipTitle="Times presented"
              tipDescription="Number of times survey was shown to users."
              tipButtonUrl=""
              loading={false}
            />
          </div>
          <div className="rules-analyze__box">
            <DashboardItem
              title="Answers"
              value={answers_count}
              prefix=""
              autorenews={false}
              tipTitle="Answers"
              tipDescription="Number of answers received."
              tipButtonUrl=""
              loading={false}
            />
          </div>
        </div>
        {question && (
          <div className="c-c__b-c__box-header pushrules-analyze__select">
            <svg
              className="c-c__b-c__box-header__icon c-c__b-c__box-header__icon_3"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 4C0 2.34315 1.34315 1 3 1H13C14.6569 1 16 2.34315 16 4V9C16 10.6569 14.6569 12 13 12H9L4 16V12H3C1.34315 12 0 10.6569 0 9V4ZM8.55557 5.83147C8.39112 5.94135 8.19778 6 8 6H7.5V7.5H8.5V6.93649C8.6746 6.89141 8.84286 6.82278 9 6.73205C9.03771 6.71028 9.07478 6.68724 9.11114 6.66294C9.44004 6.44318 9.69638 6.13082 9.84776 5.76537C9.99913 5.39992 10.0387 4.99778 9.96157 4.60982C9.8844 4.22186 9.69392 3.86549 9.41421 3.58579C9.13451 3.30608 8.77814 3.1156 8.39018 3.03843C8.00222 2.96126 7.60009 3.00087 7.23463 3.15224C6.86918 3.30362 6.55682 3.55996 6.33706 3.88886C6.31276 3.92522 6.28972 3.96229 6.26795 4C6.0928 4.30337 6 4.64817 6 5H7C7 4.80222 7.05865 4.60888 7.16853 4.44443C7.27841 4.27998 7.43459 4.15181 7.61732 4.07612C7.80004 4.00043 8.00111 3.98063 8.19509 4.01922C8.38907 4.0578 8.56725 4.15304 8.70711 4.29289C8.84696 4.43275 8.9422 4.61093 8.98079 4.80491C9.01937 4.99889 8.99957 5.19996 8.92388 5.38268C8.84819 5.56541 8.72002 5.72159 8.55557 5.83147ZM8.64999 8.625C8.64999 8.97018 8.37017 9.25 8.02499 9.25C7.67982 9.25 7.39999 8.97018 7.39999 8.625C7.39999 8.27982 7.67982 8 8.02499 8C8.37017 8 8.64999 8.27982 8.64999 8.625Z"
                fill="#97ADC6"
              />
            </svg>
            <div className="c-c__b-c__box-header-title c-c__b-c__box-header-title_rules c-c__b-c__box-header-title-3">
              {question}
            </div>
          </div>
        )}
        <div className="rules-analyze__bars">
          {answers.map((answer, index) => (
            <AnalyzeBar
              key={index}
              percent={(answer.count / answers_count) * 100}
              count={answer.count}
              title={answer.name}
              backgroundColor={"white"}
              trackColor="#ABD7FF"
            />
          ))}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions,
    application: state.application
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Survey)
