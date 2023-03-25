import React from "react"
import { NavLink } from "react-router-dom"
import { connect } from "react-redux"
import history from "../../../history"

import successImage from "../../../assets/images/image-success.jpg"

class Success extends React.Component {
  goToDashboard = (e) => {
    e.preventDefault()

    const { apps } = this.props

    if (apps.length === 0) {
      history.push("/newapp")
    } else {
      const lastId = localStorage.getItem("lastApplicationId")
      let lastApp = apps[0]

      if (lastId) {
        const app = apps.find((app) => app.id === lastId)
        if (app) lastApp = app
      }

      history.push(`/apps/${lastApp.id}/dashboard`)
    }
  };

  render() {
    return (
      <div className="ta-center input-wrapper">
        <img src={successImage} width="350px" />
        <div>
          <a
            href="#"
            className="button button_225 button_green button_inline-block"
            onClick={this.goToDashboard}
          >
            Continue
          </a>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    apps: state.applications
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Success)
