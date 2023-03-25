import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Route, Redirect } from 'react-router'
import configureStore from './configureStore'
import { App } from 'containers/App'
import { isEmpty, intersection, values } from 'lodash'
import { default as authorize, hasRoles } from 'components/hocs/authorize'
import withCurrentUser from 'components/hocs/withCurrentUser'
import { GoogleAnalytics, googleAnalyticsId } from 'components/GoogleAnalytics'
import { Drivers } from 'containers/Drivers'
import { BoAlerts, BoDocuments } from 'containers/BoAlerts'
import { BoAssignment } from 'containers/BoAssignment'
import { BoUsers } from 'containers/BoUsers'
import { BoReview } from 'containers/BoReview'
import { BoStatistics } from 'containers/BoStatistics'
import { Login, ResetPassword, SetupPassword, Auth } from 'containers/Auth'
import { ContactUs } from 'containers/ContactUs'
import { Earnings } from 'containers/Earnings'
import { ApolloProfile, EditApolloProfile, Profile } from 'containers/Profile'
import { BoNews } from 'containers/BoNews'
import { NewsEditor } from 'containers/NewsEditor'
import { NewsDetail } from 'containers/NewsDetail'
import { Statements } from 'containers/Statements'
import { Onboarding } from 'containers/Onboarding'
import { News } from 'containers/News'
import { PrivacyPolicy, FAQ, Terms } from 'containers/Static'
import { UserDocuments } from 'containers/UserDocuments'
import { Wizard } from 'containers/Wizard'
import { SignUp } from 'containers/SignUp'
import { media } from 'components/Media'
import { SpecialistHub } from 'containers/SpecialistHub'

import 'index.css'

const REDIRECT = 'redirect'

const availableRoles = {
  siteAdmin: 'site_admin',
  driver: 'driver',
  apolloDriver: 'apollo_driver',
  communityManager: 'community_manager',
  complianceAgent: 'compliance_agent',
  driverSupport: 'driver_support',
  onboardingAgent: 'onboarding_agent',
  systemAdmin: 'system_admin'
}

const isAnonymous = (currentUser) => (
  !currentUser.authenticated || isEmpty(intersection(values(availableRoles), currentUser.roles))
)

const isAdmin = (currentUser) => (
  currentUser.authenticated && hasRoles(currentUser, availableRoles.siteAdmin)
)

const isCommunityManager = (currentUser) => (
  currentUser.authenticated && hasRoles(currentUser, availableRoles.communityManager)
)

const isSystem = (currentUser) => (
  currentUser.authenticated && hasRoles(currentUser, availableRoles.systemAdmin)
)

const isComplianceAgent = (currentUser) => (
  currentUser.authenticated && hasRoles(currentUser, availableRoles.complianceAgent)
)

const isDriverSupport = (currentUser) => (
  currentUser.authenticated && hasRoles(currentUser, availableRoles.driverSupport)
)

const isDriver = (currentUser) => (
  currentUser.authenticated && (hasRoles(currentUser, availableRoles.driver) || hasRoles(currentUser, availableRoles.apolloDriver))
)

const isBlackCabDriver = (currentUser) => (
  currentUser.authenticated && hasRoles(currentUser, availableRoles.driver)
)

const isApolloDriver = (currentUser) => (
  currentUser.authenticated && hasRoles(currentUser, availableRoles.apolloDriver)
)

const isNotOnboardedDriver = (currentUser) => (
  currentUser.authenticated && !currentUser.onboardingCompleted && hasRoles(currentUser, availableRoles.apolloDriver)
)

const isOnboardingAgent = (currentUser) => (
  currentUser.authenticated && hasRoles(currentUser, availableRoles.onboardingAgent)
)

const anonymousOnly = authorize(isAnonymous, () => (
  <Redirect to="/" />
))

const adminOnly = authorize(isAdmin, () => (
  <Redirect to="auth" />
))

const driverOnly = authorize(isDriver, () => (
  <Redirect to="/auth" />
))

const driverBlackCabOnly = authorize(isBlackCabDriver, () => (
  <Redirect to="/auth" />
))

const driverApolloOnly = authorize(isApolloDriver, () => (
  <Redirect to="/auth" />
))

const notOnboardedDriverOnly = authorize(isNotOnboardedDriver, () => (
  <Redirect to="/auth" />
))

const communityManagerOnly = authorize(isCommunityManager, () => (
  <Redirect to="/auth" />
))

const communityManagerAdminOnly = authorize([isAdmin, isCommunityManager], () => (
  <Redirect to="/auth" />
))

const accessToDrivers = authorize([isAdmin, isSystem, isDriverSupport, isComplianceAgent], () => (
  <Redirect to="/auth" />
))

const accessToAlerts = authorize([isAdmin, isComplianceAgent], () => (
  <Redirect to="/auth" />
))

const accessToContactUs = authorize([isDriver, isNotOnboardedDriver], () => (
  <Redirect to="/auth" />
))

const onboardingAgentOnly = authorize([isAdmin, isOnboardingAgent], () => (
  <Redirect to="/auth" />
))

const Root = ({ currentUser }) => {
  if (isAdmin(currentUser)) {
    const redirectUrl = localStorage.getItem(REDIRECT)
    if (redirectUrl) {
      localStorage.removeItem(REDIRECT)
      return <Redirect to={ redirectUrl } />
    }
    return <Redirect to="/drivers" />
  }

  if (isNotOnboardedDriver(currentUser)) {
    return <Redirect to={ `/wizard/${currentUser.onboardingStep}` } />
  }

  if (isCommunityManager(currentUser)) {
    return <Redirect to="/bonews" />
  }

  if (isSystem(currentUser)) {
    return <Redirect to="/drivers" />
  }

  if (isComplianceAgent(currentUser)) {
    return <Redirect to="/drivers" />
  }

  if (isDriverSupport(currentUser)) {
    return <Redirect to="/drivers" />
  }

  if (isBlackCabDriver(currentUser)) {
    return <Redirect to="/profilecab" />
  }

  if (isApolloDriver(currentUser)) {
    return <Redirect to="/profile" />
  }

  if (isOnboardingAgent(currentUser)) {
    return <Redirect to="/boassignment" />
  }

  return <Redirect to="/auth" />
}

const Wrapper = styled.div`
  height: 100%;

  & > div {
    height: 100%;
    ${media.phoneSmall`width: 320px; height: auto;`}
  }
`

const Main = () => (
  <Provider store={ configureStore() }>
    <App>
      <BrowserRouter>
        <Wrapper>
          { googleAnalyticsId && <Route path="/" component={ GoogleAnalytics } /> }
          <Route exact path="/" component={ withCurrentUser(Root) } />

          <Route exact path="/auth" component={ anonymousOnly(Login) } />
          <Route exact path="/auth/token/:token" component={ anonymousOnly(Auth) } />
          <Route exact path="/auth/forgot" component={ anonymousOnly(ResetPassword) } />
          <Route exact path="/auth/forgot/:token" component={ anonymousOnly(SetupPassword) } />
          <Route exact path="/auth/invite/:token" component={ anonymousOnly(Onboarding) } />

          <Route exact path="/auth/faq" component={ withCurrentUser(FAQ) } />
          <Route exact path="/auth/privacy" component={ withCurrentUser(PrivacyPolicy) } />
          <Route exact path="/auth/terms" component={ driverOnly(Terms) } />
          <Route exact path="/auth/contact" component={ accessToContactUs(ContactUs) } />
          <Route exact path="/auth/signup" component={ anonymousOnly(SignUp) } />

          <Route exact path="/earnings" component={ driverOnly(Earnings) } />
          <Route exact path="/statements/:id?" component={ driverOnly(Statements) } />
          <Route exact path="/documents" component={ driverApolloOnly(UserDocuments) } />
          <Route exact path="/profile" component={ driverApolloOnly(ApolloProfile) } />
          <Route exact path="/profilecab" component={ driverBlackCabOnly(Profile) } />
          <Route exact path="/profile/edit" component={ driverApolloOnly(EditApolloProfile) } />
          <Route exact path="/news" component={ driverOnly(News) } />
          <Route exact path="/news/detail/:id" component={ driverOnly(NewsDetail) } />

          <Route exact path="/drivers" component={ accessToDrivers(Drivers) } />
          <Route exact path="/bousers" component={ adminOnly(BoUsers) } />
          <Route exact path="/bostatistics" component={ adminOnly(BoStatistics) } />

          <Route exact path="/bonews" component={ communityManagerAdminOnly(BoNews) } />
          <Route exact path="/bonews/create" component={ communityManagerOnly(NewsEditor) } />
          <Route exact path="/bonews/edit/:id" component={ communityManagerOnly(NewsEditor) } />
          <Route exact path="/bonews/preview/:id" component={ communityManagerOnly(NewsEditor) } />

          <Route exact path="/boalerts" component={ accessToAlerts(BoAlerts) } />
          <Route exact path="/bodocuments" component={ accessToAlerts(BoDocuments) } />
          <Route path="/wizard/:page?" component={ notOnboardedDriverOnly(Wizard) } />
          <Route exact path="/boreview/:id" component={ onboardingAgentOnly(BoReview) } />

          <Route exact path="/boassignment" component={ onboardingAgentOnly(BoAssignment) } />
          <Route exact path="/specialisthub" component={ onboardingAgentOnly(SpecialistHub) } />
        </Wrapper>
      </BrowserRouter>
    </App>
  </Provider>
)

ReactDOM.render(<Main />, document.getElementById('root'))
