/* COMMON */

export const FETCH_RFP = 'FETCH_RFP';
export const FETCH_RFP_SUCCEEDED = 'FETCH_RFP_SUCCEEDED';
export const FETCH_RFP_FAILED = 'FETCH_RFP_FAILED';

export const FETCH_CARRIERS = 'FETCH_CARRIERS';
export const FETCH_CARRIERS_SUCCEEDED = 'FETCH_CARRIERS_SUCCEEDED';
export const FETCH_CARRIERS_FAILED = 'FETCH_CARRIERS_FAILED';

export const SEND_RFP = 'SEND_RFP';
export const SEND_RFP_TO_CARRIER_SUCCESS = 'SEND_RFP_TO_CARRIER_SUCCESS';
export const SEND_RFP_TO_CARRIER_ERROR = 'SEND_RFP_TO_CARRIER_ERROR';
export const CHECK_CENSUS_TYPE = 'CHECK_CENSUS_TYPE';
export const CHECK_CENSUS_TYPE_SUCCESS = 'CHECK_CENSUS_TYPE_SUCCESS';
export const CHECK_CENSUS_TYPE_ERROR = 'CHECK_CENSUS_TYPE_ERROR';

export const RFP_SUBMIT = 'RFP_SUBMIT';
export const RFP_SUBMITTED_SUCCESS = 'RFP_SUBMITTED_SUCCESS';
export const RFP_SUBMITTED_ERROR = 'RFP_SUBMITTED_ERROR';

export const SEND_RFP_CLIENT = 'SEND_RFP_CLIENT';
export const SEND_RFP_CLIENT_SUCCESS = 'SEND_RFP_CLIENT_SUCCESS';
export const SEND_RFP_CLIENT_ERROR = 'SEND_RFP_CLIENT_ERROR';

export const GET_RFP_STATUS = 'GET_RFP_STATUS';
export const GET_RFP_STATUS_SUCCESS = 'GET_RFP_STATUS_SUCCESS';
export const GET_RFP_STATUS_ERROR = 'GET_RFP_STATUS_ERROR';

export const CHANGE_SELECTED = 'app/RfpPage/CHANGE_SELECTED';

export const RESET_RFP_STATE = 'RESET_RFP_STATE';

export const CHANGE_SECTION_FIELD = 'app/RFPPage/CHANGE_SECTION_FIELD';

export const CHANGE_SHOW_ERRORS = 'app/RFPPage/CHANGE_SHOW_ERRORS';

export const RATE_TYPE_COMPOSITE = 'COMPOSITE';
export const RATE_TYPE_BANDED = 'BANDED';

export const UPDATE_PLAN_BANDED = 'UPDATE_PLAN_BANDED';
/*
 * Fields
 *
 */

/* Info */

export const CHANGE_PAY_TYPE = 'payType';
export const CHANGE_BROKER_RECORD = 'brokerOfRecord';
export const CHANGE_PREVIOUS_CARRIER = 'previousCarrier';
export const CHANGE_COMMISSION = 'commission';
export const CHANGE_WAITING_PERIOD = 'daysAfterHire';

/* Contribution */

export const CHANGE_CONTRIBUTION_TYPE = 'contributionType';
export const CHANGE_BUY_FROM_BASE_PLAN = 'buyUp';

/* Quote */

export const CHANGE_SELF_FUNDING = 'selfFunding';
export const CHANGE_ALTERNATIVE_QUOTE = 'alternativeQuote';

export const CHANGE_ALONG_SIDE = 'alongside';
export const CHANGE_FULL_TAKEOVER = 'takeOver';
export const CHANGE_RATING_TIERS = 'ratingTiers';
export const CHANGE_DIAGNOSIS_AND_STATUS = 'diagnosisAndStatus';
export const CHANGE_ADDITIONAL_REQUESTS = 'additionalRequests';

/*
 * Constants
 *
 */

/* Info */

export const ADD_CARRIER = 'ADD_CARRIER';
export const REMOVE_CARRIER = 'REMOVE_CARRIER';
export const UPDATE_CARRIER = 'UPDATE_CARRIER';

export const CARRIERS = 'carriers';
export const PREVIOUS_CARRIERS = 'previousCarriers';
export const PERCENTAGE = '%';
export const PEPM = 'PEPM';
export const NET = 'COMMISSION';

/* Options */

export const CHANGE_TIER = 'CHANGE_TIER';
export const ADD_PLAN = 'ADD_PLAN';
export const REMOVE_PLAN = 'REMOVE_PLAN';
export const UPDATE_PLAN = 'UPDATE_PLAN';
export const UPDATE_PLAN_TIER = 'UPDATE_PLAN_TIER';

export const CHANGE_LIFE_STD_LTD_PLAN = 'app/RFPPage/CHANGE_LIFE_STD_LTD_PLAN';
export const ADD_LIFE_STD_LTD_PLAN = 'app/RFPPage/ADD_LIFE_STD_LTD_PLAN';
export const REMOVE_LIFE_STD_LTD_PLAN = 'app/RFPPage/REMOVE_LIFE_STD_LTD_PLAN';
export const CHANGE_LIFE_STD_LTD_PLAN_CLASS = 'app/RFPPage/CHANGE_LIFE_STD_LTD_PLAN_CLASS';

export const PLANS = 'plans';

/* Contribution */

export const PLAN_TIERS = 'planTiers';

export const DOLLARS = '$';
export const VOLUNTARY = 'VOLUNTARY';

/* Quote */

export const CHANGE_PLAN_FILES = 'CHANGE_PLAN_FILES';
export const CHANGE_SUMMARY_FILES = 'CHANGE_SUMMARY_FILES';

/* Rates */

export const PLAN_CURRENT_TIERS = 'PLAN_CURRENT_TIERS';
export const PLAN_RENEWAL_TIERS = 'PLAN_RENEWAL_TIERS';
export const PLAN_ENROLLMENT_TIERS = 'PLAN_ENROLLMENT_TIERS';
export const CHANGE_RATE_FIELD = 'CHANGE_RATE_FIELD';
export const CHANGE_RATE_AGE_FIELD = 'CHANGE_RATE_AGE_FIELD';
export const CHANGE_AGES_ROWS_COUNT = 'CHANGE_AGES_ROWS_COUNT';

/* Files */

export const ADD_FILE = 'ADD_FILE';
export const REMOVE_FILE = 'REMOVE_FILE';
export const REMOVE_FILE_UI = 'REMOVE_FILE_UI';
export const ADD_PLAN_FILE = 'ADD_PLAN_FILE';
export const REMOVE_PLAN_FILE = 'REMOVE_PLAN_FILE';
export const REMOVE_PLAN_FILE_UI = 'REMOVE_PLAN_FILE_UI';
export const SEND_RFP_FILE = 'SEND_RFP_FILE';
export const UPDATE_FILES = 'UPDATE_FILES';
export const SEND_RFP_FILE_ERROR = 'SEND_RFP_FILE_ERROR';
export const REMOVE_RFP_FILE_SUCCESS = 'REMOVE_RFP_FILE_SUCCESS';
export const REMOVE_RFP_FILE_ERROR = 'REMOVE_RFP_FILE_ERROR';
export const FETCH_RFP_PDF = 'FETCH_RFP_PDF';
export const FETCH_RFP_PDF_SUCCESS = 'FETCH_RFP_PDF_SUCCESS';
export const FETCH_RFP_PDF_ERROR = 'FETCH_RFP_PDF_ERROR';

/* Plans */

export const CLEAR_VALUE_PLANS_GET = 'CLEAR_VALUE_PLANS_GET';
export const CLEAR_VALUE_PLANS_GET_SUCCESS = 'CLEAR_VALUE_PLANS_GET_SUCCESS';
export const CLEAR_VALUE_PLANS_GET_ERROR = 'CLEAR_VALUE_PLANS_GET_ERROR';
export const CLEAR_VALUE_PLANS_LOADED = 'CLEAR_VALUE_PLANS_LOADED';

export const CLEAR_VALUE_PLANS_SAVE = 'CLEAR_VALUE_PLANS_SAVE';
export const CLEAR_VALUE_PLANS_SAVE_SUCCESS = 'CLEAR_VALUE_PLANS_SAVE_SUCCESS ';
export const CLEAR_VALUE_PLANS_SAVE_ERROR = 'CLEAR_VALUE_PLANS_SAVE_ERROR';

export const CHANGE_CURRENT_CARRIER = 'app/RFPPage/CHANGE_CURRENT_CARRIER';
export const CHANGE_CURRENT_NETWORK = 'app/RFPPage/CHANGE_CURRENT_NETWORK';
export const CHANGE_PLAN_FIELD = 'app/RFPPage/CHANGE_PLAN_FIELD';
export const CHANGE_UPDATE_NETWORK = 'app/RFPPage/CHANGE_UPDATE_NETWORK';

export const NETWORKS_GET_SUCCESS = 'app/RFPPage/NETWORKS_GET_SUCCESS';
export const NETWORKS_GET_ERROR = 'app/RFPPage/NETWORKS_GET_ERROR';

export const PLAN_CARRIER = 'PLAN_CARRIER';
export const PLAN_NETWORK = 'PLAN_NETWORK';

/* Client */

export const SET_CLIENT_ID = 'SET_CLIENT_ID';

/* Date format */

export const SECTION_LAST_UPDATE = 'MMMM Do YYYY, h:mm:ss a';

/* Sectors */

export const RFP_MEDICAL_SECTION = 'medical';
export const RFP_DENTAL_SECTION = 'dental';
export const RFP_VISION_SECTION = 'vision';
export const RFP_LIFE_SECTION = 'life';
export const RFP_STD_SECTION = 'std';
export const RFP_LTD_SECTION = 'ltd';
export const RFP_CLIENT_SECTION = 'client';

export const RFP_MEDICAL_TEXT = 'Medical';
export const RFP_DENTAL_TEXT = 'Dental';
export const RFP_VISION_TEXT = 'Vision';
export const RFP_LIFE_TEXT = 'Life/AD&D';
export const RFP_STD_TEXT = 'Short-Term Disability';
export const RFP_LTD_TEXT = 'Long-Term Disability';

/* Tier Labels */

export const EMPLOYEE_ONLY = 'Employee Only';
export const EMPLOYEE_FAMILY = 'Employee + Family';
export const EMPLOYEE_1 = 'Employee + 1';
export const EMPLOYEE_2 = 'Employee + 2 or more';
export const EMPLOYEE_SPOUSE = 'Employee + \n Spouse';
export const EMPLOYEE_CHILD = 'Employee + Child (ren)';
export const EMPLOYEE_AGE = 'Employee Age';
export const SPOUSE_AGE = 'Spouse Age';

/* Other */

export const KAISER = 'Kaiser';

