import user from './user'
import sessions from './sessions'
import application from './application'
import applications from './applications'
import integrations from './integrations'
import events from './events'
import rules from './rules'
import butlerRules from './butlerRules'
import butlerRule from './butlerRule'
import rule from './rule'
import customers from './customers'
import customer from './customer'
import productGroups from './productGroups'
import fonts from './fonts'
import apphooks from './apphooks'
import settings from './settings'

const rootReducer = {
  user,
  sessions,
  application,
  applications,
  integrations,
  customers,
  customer,
  productGroups,
  events,
  rules,
  butlerRules,
  butlerRule,
  rule,
  fonts,
  apphooks,
  settings
}

export default rootReducer
