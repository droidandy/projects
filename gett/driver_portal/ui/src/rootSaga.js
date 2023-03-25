import { all, fork } from 'redux-saga/effects'
import App from 'containers/App/sagas'
import Auth from 'containers/Auth/sagas'
import BoAssignment from 'containers/BoAssignment/sagas'
import ContactUs from 'containers/ContactUs/sagas'
import Earnings from 'containers/Earnings/sagas'
import BoStatistics from 'containers/BoStatistics/sagas'
import Drivers from 'containers/Drivers/sagas'
import Statements from 'containers/Statements/sagas'
import Onboarding from 'containers/Onboarding/sagas'
import Profile from 'containers/Profile/sagas'
import BoNews from 'containers/BoNews/sagas'
import NewsEditor from 'containers/NewsEditor/sagas'
import News from 'containers/News/sagas'
import NewsDetail from 'containers/NewsDetail/sagas'
import BoUsers from 'containers/BoUsers/sagas'
import BoAlerts from 'containers/BoAlerts/sagas'
import BoReview from 'containers/BoReview/sagas'
import Documents from 'containers/Documents/sagas'
import Wizard from 'containers/Wizard/sagas'
import SignUp from 'containers/SignUp/sagas'
import SpecialistHub from 'containers/SpecialistHub/sagas'

function * rootSaga() {
  yield all([
    fork(App),
    fork(Auth),
    fork(BoAssignment),
    fork(BoStatistics),
    fork(ContactUs),
    fork(Earnings),
    fork(Drivers),
    fork(Documents),
    fork(Statements),
    fork(Onboarding),
    fork(Profile),
    fork(BoNews),
    fork(NewsEditor),
    fork(News),
    fork(NewsDetail),
    fork(BoUsers),
    fork(BoAlerts),
    fork(BoReview),
    fork(Wizard),
    fork(SignUp),
    fork(SpecialistHub)
  ])
}

export default rootSaga
