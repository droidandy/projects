import { combineReducers } from 'redux'

import App from 'containers/App/reducers'
import Auth from 'containers/Auth/reducers'
import BoAssignment from 'containers/BoAssignment/reducers'
import BoStatistics from 'containers/BoStatistics/reducers'
import ContactUs from 'containers/ContactUs/reducers'
import Earnings from 'containers/Earnings/reducers'
import Drivers from 'containers/Drivers/reducers'
import Statements from 'containers/Statements/reducers'
import Onboarding from 'containers/Onboarding/reducers'
import Profile from 'containers/Profile/reducers'
import BoNews from 'containers/BoNews/reducers'
import NewsEditor from 'containers/NewsEditor/reducers'
import News from 'containers/News/reducers'
import NewsDetail from 'containers/NewsDetail/reducers'
import BoAlerts from 'containers/BoAlerts/reducers'
import BoUsers from 'containers/BoUsers/reducers'
import BoReview from 'containers/BoReview/reducers'
import Documents from 'containers/Documents/reducers'
import Wizard from 'containers/Wizard/reducers'
import SignUp from 'containers/SignUp/reducers'
import SpecialistHub from 'containers/SpecialistHub/reducers'

const containers = combineReducers({
  App,
  Auth,
  BoAssignment,
  BoStatistics,
  ContactUs,
  Earnings,
  Drivers,
  Statements,
  Onboarding,
  Profile,
  BoNews,
  NewsEditor,
  News,
  NewsDetail,
  BoUsers,
  BoAlerts,
  BoReview,
  Documents,
  Wizard,
  SignUp,
  SpecialistHub
})

const appReducer = combineReducers({
  containers
})

const rootReducer = (state, action) => {
  return appReducer(state, action)
}

export default rootReducer
