import React, { Component } from 'react'
import { connect } from 'react-redux'
import history from '../../history'
import { authenticateSuccess } from '../../actions/sessions'
import { fetchApplicationsRequest } from '../../actions/applications'
import axios from 'axios'
import TokenService from '../../libs/TokenService'

const PRODUCTION_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6ImViZjdmOTU5LTNlMmYtNDkxYy1iMTVlLTEwYmQyZGQwZmIwYiIsImVtYWlsIjoiZGVtb0BhcHBodWQuY29tIiwic3RhdHVzIjoiYWRtaW4iLCJhcHBzIjpbXSwiZXhwIjo0NzU2NTI0MjQwfQ.Bjt9kHiu8oMeyQRLFAAoRyoNDcCklK9QMgwmOOk2jw0'
const STAGING_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjRlOGUxZDIwLWM4NmYtNDZmNS1hZmMyLWY0Mzk1NTUxZWIyMSIsImVtYWlsIjoiZGVtb0BhcHBodWQuY29tIiwic3RhdHVzIjoiYWRtaW4iLCJhcHBzIjpbXSwiZXhwIjo0NzU2NTIzMjc4fQ.4mAbPWnaEqatPN4ZaReWYiIw81hoSVuzuxZg0qyyFlY'
const DEVELOPMENT_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjRlOGUxZDIwLWM4NmYtNDZmNS1hZmMyLWY0Mzk1NTUxZWIyMSIsImVtYWlsIjoiZGVtb0BhcHBodWQuY29tIiwic3RhdHVzIjoiYWRtaW4iLCJhcHBzIjpbXSwiZXhwIjo0NzU2NTIzMjc4fQ.4mAbPWnaEqatPN4ZaReWYiIw81hoSVuzuxZg0qyyFlY'

class Demo extends Component {
  componentDidMount() {
    document.title = 'Apphud'
    let token = DEVELOPMENT_TOKEN

    switch (window.ENV) {
      default:
        break
      case 'production':
        token = PRODUCTION_TOKEN
        break
      case 'staging':
        token = STAGING_TOKEN
        break
    }

    if (this.props.match.params.id === '9ab0ca91') {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      axios.get('/user.json').then((response) => {
        TokenService.setToken({token});
        const data = response.data.data.results;
        this.props.authenticateSuccess(data);
        this.props.fetchApplicationsRequest((apps) => {
          if (apps.length === 0) {
            history.push('/newapp')
          } else {
            history.push(`/apps/${apps[0].id}/dashboard`)
          }
        })
      })
    }
  }

  render() {
    return <div />
  }
}

const mapStateToProps = (state) => {
  return {
    lastapp: state.application,
  }
}

const mapDispatchToProps = {
  authenticateSuccess,
  fetchApplicationsRequest,
}

export default connect(mapStateToProps, mapDispatchToProps)(Demo)
