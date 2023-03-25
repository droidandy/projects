import { all } from 'redux-saga/effects'

import userWatcher from './user'
import sessionsWatcher from './sessions'
import productGroupsWatcher from './productGroups'
import applicationWatcher from './application'
import applicationsWatcher from './applications'
import integrationsWatcher from './integrations'
import eventsWatcher from './events'
import customersWatcher from './customers'
import customerWatcher from './customer'
import rulesWatcher from './rules'
import butlerRulesWatcher from './butlerRules'
import butlerRuleWatcher from './butlerRule'
import ruleWatcher from './rule'
import fontsWatcher from './fonts'
import apphooksWatcher from './apphooks'
import billingWatcher from './billing'
import tutorialWatcher from './tutorials'

export default function* rootSaga() {
  yield all([
    userWatcher(),
    customersWatcher(),
    customerWatcher(),
    sessionsWatcher(),
    applicationWatcher(),
    applicationsWatcher(),
    integrationsWatcher(),
    productGroupsWatcher(),
    eventsWatcher(),
    rulesWatcher(),
    butlerRulesWatcher(),
    ruleWatcher(),
    fontsWatcher(),
    butlerRuleWatcher(),
    apphooksWatcher(),
    tutorialWatcher(),
    billingWatcher(),
  ])
}
