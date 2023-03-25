/*
Enumerations used in the Morningstar Web Services API

Links to documentation are provided in the comments:
[MS-WS-SPEC] = "Morningstar Web Services Specification" v7.1

The suffix RT in enumeration names is an abbreviation for "Request Types".
*/

/** Endpoints used by the MorningStar Web Services API */
export enum EMSAPIEndpoint {
  INDEX_TS = 'IndexTS',
  INDEX_PHP = 'index.php',
  CHANGES = 'changes',
  SYMBOL_GUIDE = 'SymbolGuide',
  ALERT_SERVICE = 'AlertService',
  SEARCH = 'Search',
  STREAMING = 'Streaming',
}

/** [MS-WS-SPEC] 6.8 Historical Price Adjustments */
export enum EMSAPIPriceAdjustmentRT {
  ADJUSTED = 'PriceChangeAdjusted',
  UNADJUSTED = 'PriceChangeUnadjusted',
  BULK_PRICE_DELETE = 'BulkPriceDelete',
}

/** [MS-WS-SPEC] 7.2 Corporate Actions & Name Changes */
export enum EMSAPICorpActionRT {
  CORP_ACTIONS = 'CorpActions',
  NAME_CHANGES = 'NameChanges',
}

/** [MS-WS-SPEC] 7.3 Price History -> 7.3.2 Parameters */
export enum EMSAPIBarType {
  BAR = 'Bar',
  TICK = 'Tick',
  MINUTE = 'MinBar',
  HOUR = 'HourBar',
  DAY = 'DailyBar',
  WEEK = 'WeeklyBar',
  MONTH = 'MonthlyBar',
}
