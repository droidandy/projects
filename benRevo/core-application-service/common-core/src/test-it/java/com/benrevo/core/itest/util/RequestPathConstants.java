package com.benrevo.core.itest.util;


/**
 * The type Request path constants for api tests.
 */
public final class RequestPathConstants {

    /**
     * The constant RFPS_ID_FILES_PATH.
     */
    public static final String RFPS_ID_FILES_PATH = "/rfps/{id}/files";

    /**
     * The constant PATH_FILE.
     */
    public static final String PATH_FILE = "/src/test/resources/static/test_file.png";

    /**
     * The constant FILE_ID_PATH.
     */
    public static final String FILE_ID_PATH = "/file?id={id}";
    /**
     * The constant FILE_ID_INVALID_PATH.
     */
    public static final String FILE_ID_INVALID_PATH = "/file";
    /**
     * The constant ACCOUNTS_USERS_PATH.
     */
    public static final String ACCOUNTS_USERS_PATH = "/accounts/users";
    /**
     * The constant ACCOUNT_REQUEST_PATH.
     */
    public static final String ACCOUNT_REQUEST_PATH = "/accountRequest";
    /**
     * The constant VERIFY_EMAIL_PATH.
     */
    public static final String VERIFY_EMAIL_PATH = "/verifyEmail";
    /**
     * The constant VERIFY_EMAIL_VERIFICATION_CODE_PATH.
     */
    public static final String VERIFY_EMAIL_VERIFICATION_CODE_PATH =
        "/verifyEmail?verificationCode={code}";
    /**
     * The constant ACCOUNTS_USERS_LOGIN_COUNT_PATH.
     */
    public static final String ACCOUNTS_USERS_LOGIN_COUNT_PATH = "/accounts/users/loginCount";
    /**
     * The constant ACCOUNTS_CLIENTS_ID_PATH.
     */
    public static final String ACCOUNTS_CLIENTS_ID_PATH = "/accounts/clients/{id}";
    /**
     * The constant ANSWERS_ID_PATH.
     */
    public static final String ANSWERS_ID_PATH = "/answers/{clientId}";
    /**
     * The constant ANSWERS_PATH.
     */
    public static final String ANSWERS_PATH = "/answers";
    /**
     * The constant ERROR_PATH.
     */
    public static final String ERROR_PATH = "/error";
    /**
     * The constant CONTACT_US_PATH.
     */
    public static final String CONTACT_US_PATH = "/contactus";
    /**
     * The constant CLIENTS_ID_MEMBERS_PATH.
     */
    public static final String CLIENTS_ID_MEMBERS_PATH = "/clients/{clientId}/members";
    /**
     * The constant CLIENTS_PLANS_ID_PATH.
     */
    public static final String CLIENTS_PLANS_ID_PATH = "/clients/plans/{id}";
    /**
     * The constant CLIENTS_CLIENT_ID_PLANS_PATH.
     */
    public static final String CLIENTS_CLIENT_ID_PLANS_PATH = "clients/{clientId}/plans";
    /**
     * The constant CLIENTS_PLANS_CLIENT_PLAN_ID_PATH.
     */
    public static final String CLIENTS_PLANS_CLIENT_PLAN_ID_PATH = "/clients/plans/{clientPlanId}";
    /**
     * The constant CLIENTS_CLIENT_ID_PLANS.
     */
    public static final String CLIENTS_CLIENT_ID_PLANS = "/clients/{clientId}/plans";
    /**
     * The constant CLIENTS_CLIENT_ID_PLANS_ENROLLMENTS_PATH.
     */
    public static final String CLIENTS_CLIENT_ID_PLANS_ENROLLMENTS_PATH =
        "/clients/{clientId}/plans/enrollments";
    /**
     * The constant CLIENTS_CLIENT_ID_POSTSALES_PATH.
     */
    public static final String CLIENTS_CLIENT_ID_POSTSALES_PATH = "/clients/{clientId}/postsales";
    /**
     * The constant CLIENTS_PATH.
     */
    public static final String CLIENTS_PATH = "/clients";
    /**
     * The constant BROKERS_ID_CLIENTS_PATH.
     */
    public static final String BROKERS_ID_CLIENTS_PATH = "/brokers/{id}/clients";
    /**
     * The constant CLIENTS_ID_PATH.
     */
    public static final String CLIENTS_ID_PATH = "/clients/{id}";
    /**
     * The constant CLIENTS_CLIENT_ID_ARCHIVE_PATH.
     */
    public static final String CLIENTS_CLIENT_ID_ARCHIVE_PATH = "/clients/{clientId}/archive";
    /**
     * The constant CLIENTS_CLIENT_ID_UNARCHIVE_PATH.
     */
    public static final String CLIENTS_CLIENT_ID_UNARCHIVE_PATH = "/clients/{clientId}/unarchive";
    /**
     * The constant CLIENTS_CLIENT_ID_EXT_PRODUCTS_PATH.
     */
    public static final String CLIENTS_CLIENT_ID_EXT_PRODUCTS_PATH =
        "/clients/{clientId}/extProducts";
    /**
     * The constant CLIENT_CLIENT_ID_RFP_CATEGORY_CARRIER_HISTORY_ALL_PATH.
     */
    public static final String CLIENT_CLIENT_ID_RFP_CATEGORY_CARRIER_HISTORY_ALL_PATH =
        "/client/{clientId}/rfp/{category}/carrierHistory/all/";
    /**
     * The constant CARRIERS_ID_FEES_PATH.
     */
    public static final String CARRIERS_ID_FEES_PATH = "/carriers/{id}/fees";
    /**
     * The constant CARRIERS_PRODUCT_ALL_PATH.
     */
    public static final String CARRIERS_PRODUCT_ALL_PATH = "/carriers/product/all";
    /**
     * The constant CARRIERS_ALL_PATH.
     */
    public static final String CARRIERS_ALL_PATH = "/carriers/all/";
    /**
     * The constant CARRIER_CARRIER_ID_NETWORK_TYPE_ALL_PATH.
     */
    public static final String CARRIER_CARRIER_ID_NETWORK_TYPE_ALL_PATH =
        "/carrier/{carrierId}/network/{type}/all";
    /**
     * The constant RFP_ID_FILES_RFP_UPLOAD_PATH.
     */
    public static final String RFP_ID_FILES_RFP_UPLOAD_PATH = "/rfp/{id}/files/RFP/upload";
    /**
     * The constant FORMS_PATH.
     */
    public static final String FORMS_PATH = "/forms";
    /**
     * The constant FORMS_ID_PATH.
     */
    public static final String FORMS_ID_PATH = "/forms/{id}";
    /**
     * The constant MEDICAL_GROUPS_PATH.
     */
    public static final String MEDICAL_GROUPS_PATH = "/medical-groups";
    /**
     * The constant PLANS_RFP_ID_PATH.
     */
    public static final String PLANS_RFP_ID_PATH = "/plans/rfp/{rfpId}";
    /**
     * The constant PLANS_CREATE_PATH.
     */
    public static final String PLANS_CREATE_PATH = "plans/create";
    /**
     * The constant PLANS_UPDATE_PATH.
     */
    public static final String PLANS_UPDATE_PATH = "plans/update";
    /**
     * The constant PLANS_DELETE_PATH.
     */
    public static final String PLANS_DELETE_PATH = "plans/delete";
    /**
     * The constant RFPS_ID_OPTIONS_PATH.
     */
    public static final String RFPS_ID_OPTIONS_PATH = "/rfps/{id}/options";
    /**
     * The constant RFP_CARRIERS_RFP_CARRIER_ID_NETWORKS_NETWORK_TYPE_PATH.
     */
    public static final String RFP_CARRIERS_RFP_CARRIER_ID_NETWORKS_NETWORK_TYPE_PATH =
        "rfpcarriers/{rfpCarrierId}/networks/?networkType={type}";
    /**
     * The constant RFP_CARRIERS_CATEGORY_PATH.
     */
    public static final String RFP_CARRIERS_CATEGORY_PATH = "/rfpcarriers?category={category}";
    /**
     * The constant RFP_CARRIERS_ID_NETWORKS_PATH.
     */
    public static final String RFP_CARRIERS_ID_NETWORKS_PATH = "/rfpcarriers/{id}/networks";
    /**
     * The constant QUOTES_OPTIONS_ID_PATH.
     */
    public static final String QUOTES_OPTIONS_ID_PATH = "/quotes/options/{id}";
    /**
     * The constant QUESTIONS_PATH.
     */
    public static final String QUESTIONS_PATH = "/questions";
    /**
     * The constant QUESTIONS_ID_PATH.
     */
    public static final String QUESTIONS_ID_PATH = "/questions/{id}";
    /**
     * The constant QUOTES_OPTIONS_SELECTED_PATH.
     */
    public static final String QUOTES_OPTIONS_SELECTED_PATH =
        "quotes/options/selected?clientId={clientId}";
    /**
     * The constant QUOTES_OPTIONS_ID_AVAILABLE_NETWORKS_RAP_QUOTE_NETWORK_ID_PATH.
     */
    public static final String QUOTES_OPTIONS_ID_AVAILABLE_NETWORKS_RAP_QUOTE_NETWORK_ID_PATH =
        "/quotes/options/{id}/avaliableNetworks?rfpQuoteNetworkId={rfpQuoteNetworkId}";
    /**
     * The constant QUOTES_OPTIONS_ID_AVAILABLE_NETWORKS_REQUIRED_PATH.
     */
    public static final String QUOTES_OPTIONS_ID_AVAILABLE_NETWORKS_REQUIRED_PATH =
        "/quotes/options/{id}/avaliableNetworks";
    /**
     * The constant QUOTES_OPTIONS_ID_NETWORKS_PATH.
     */
    public static final String QUOTES_OPTIONS_ID_NETWORKS_PATH = "/quotes/options/{id}/networks";
    /**
     * The constant QUOTES_OPTIONS_ID_RIDERS_PATH.
     */
    public static final String QUOTES_OPTIONS_ID_RIDERS_PATH = "/quotes/options/{id}/riders";
    /**
     * The constant QUOTES_STATUS_CLIENT_ID_CATEGORY_PATH.
     */
    public static final String QUOTES_STATUS_CLIENT_ID_CATEGORY_PATH =
        "/quotes/status?clientId={clientId}&category={category}";
    /**
     * The constant QUOTES_OPTIONS_CONTRIBUTIONS_IDS_REQUIRED_PATH.
     */
    public static final String QUOTES_OPTIONS_CONTRIBUTIONS_IDS_REQUIRED_PATH =
        "/quotes/options/contributions?ids={0}";
    /**
     * The constant QUOTES_OPTIONS_CONTRIBUTIONS_RFP_QUOTE_OPTION_ID_PATH.
     */
    public static final String QUOTES_OPTIONS_CONTRIBUTIONS_RFP_QUOTE_OPTION_ID_PATH =
        "/quotes/options/contributions?rfpQuoteOptionId={0}";
    /**
     * The constant QUOTES_OPTIONS_COMPARE_IDS_PATH_EMPTY.
     */
    public static final String QUOTES_OPTIONS_COMPARE_IDS_PATH_EMPTY =
        "/quotes/options/compare?ids";
    /**
     * The constant QUOTES_OPTIONS_COMPARE_FILE_IDS_PATH.
     */
    public static final String QUOTES_OPTIONS_COMPARE_FILE_IDS_PATH =
        "/quotes/options/compare/file?ids={0},{1}";
    /**
     * The constant QUOTES_OPTIONS_ALTERNATIVES_ID_PATH.
     */
    public static final String QUOTES_OPTIONS_ALTERNATIVES_ID_PATH =
        "/quotes/options/alternatives/?rfpQuoteOptionNetworkId={id}";
    /**
     * The constant QUOTES_OPTIONS_COMPARE_IDS_PATH.
     */
    public static final String QUOTES_OPTIONS_COMPARE_IDS_PATH =
        "/quotes/options/compare?ids={0},{1}";
    /**
     * The constant QUOTES_RFP_QUOTE_ID_FILE_PATH.
     */
    public static final String QUOTES_RFP_QUOTE_ID_FILE_PATH = "/quotes/{rfpQuoteId}/file";
    /**
     * The constant QUOTES_OPTIONS_CREATE_PATH.
     */
    public static final String QUOTES_OPTIONS_CREATE_PATH = "/quotes/options/create";
    /**
     * The constant QUOTES_OPTIONS_ID_DISCLAIMER_PATH.
     */
    public static final String QUOTES_OPTIONS_ID_DISCLAIMER_PATH =
        "/quotes/options/{id}/disclaimer";
    /**
     * The constant QUALIFICATION_CLEAR_VALUE_ID_RFP_IDS_PATH.
     */
    public static final String QUALIFICATION_CLEAR_VALUE_ID_RFP_IDS_PATH =
        "/qualification/clearValue/{id}?rfpIds={0},{1}";
    /**
     * The constant QUALIFICATION_CLEAR_VALUE_ID_RFP_IDS_INVALID_PATH.
     */
    public static final String QUALIFICATION_CLEAR_VALUE_ID_RFP_IDS_INVALID_PATH =
        "/qualification/clearValue/{id}";
    /**
     * The constant QUOTES_OPTIONS_NETWORKS_NETWORK_ID_RIDERS_RIDER_ID_SELECT_PATH.
     */
    public static final String QUOTES_OPTIONS_NETWORKS_NETWORK_ID_RIDERS_RIDER_ID_SELECT_PATH =
        "/quotes/options/networks/{networkId}/riders/{riderId}/select";
    /**
     * The constant QUOTES_OPTIONS_SUBMIT.
     */
    public static final String QUOTES_OPTIONS_SUBMIT = "/quotes/options/submit";
    /**
     * The constant QUOTES_OPTIONS_ID_ADD_NETWORK_PATH.
     */
    public static final String QUOTES_OPTIONS_ID_ADD_NETWORK_PATH =
        "/quotes/options/{id}/addNetwork";
    /**
     * The constant QUOTES_OPTIONS_CLIENT_ID_CATEGORY_PATH.
     */
    public static final String QUOTES_OPTIONS_CLIENT_ID_CATEGORY_PATH =
        "/quotes/options/?clientId={clientId}&category={category}";
    /**
     * The constant QUOTES_OPTIONS_OPTION_ID_RIDERS_RIDER_ID_SELECT_PATH.
     */
    public static final String QUOTES_OPTIONS_OPTION_ID_RIDERS_RIDER_ID_SELECT_PATH =
        "/quotes/options/{optionId}/riders/{riderId}/select";
    /**
     * The constant QUOTES_OPTIONS_OPTION_ID_RIDERS_RIDER_ID_UN_SELECT_PATH.
     */
    public static final String QUOTES_OPTIONS_OPTION_ID_RIDERS_RIDER_ID_UN_SELECT_PATH =
        "/quotes/options/{optionId}/riders/{riderId}/unselect";
    /**
     * The constant QUOTES_OPTIONS_NETWORKS_ID_RIDERS_ID_UNSELECT_PATH.
     */
    public static final String QUOTES_OPTIONS_NETWORKS_ID_RIDERS_ID_UNSELECT_PATH =
        "/quotes/options/networks/{networkId}/riders/{riderId}/unselect";
    /**
     * The constant QUOTES_SUMMARY_PATH.
     */
    public static final String QUOTES_SUMMARY_PATH = "/clients/{id}/quotes/summary";
    /**
     * The constant QUOTES_OPTIONS_CONTRIBUTIONS_PATH.
     */
    public static final String QUOTES_OPTIONS_CONTRIBUTIONS_PATH = "/quotes/options/contributions";
    /**
     * The constant QUOTES_OPTIONS_SELECT_ADMINISTRATIVE_FEE_PATH.
     */
    public static final String QUOTES_OPTIONS_SELECT_ADMINISTRATIVE_FEE_PATH =
        "/quotes/options/selectAdministrativeFee";
    /**
     * The constant QUOTES_OPTIONS_UN_SELECT_NETWORK_PLAN_PATH.
     */
    public static final String QUOTES_OPTIONS_UN_SELECT_NETWORK_PLAN_PATH =
        "/quotes/options/unselectNetworkPlan";
    /**
     * The constant QUOTES_OPTIONS_ID_CHANGE_NETWORK_PATH.
     */
    public static final String QUOTES_OPTIONS_ID_CHANGE_NETWORK_PATH =
        "/quotes/options/{id}/changeNetwork";
    /**
     * The constant QUOTES_OPTIONS_ID_SELECT_PATH.
     */
    public static final String QUOTES_OPTIONS_ID_SELECT_PATH = "/quotes/options/{id}/select";
    /**
     * The constant RRP_QUOTE_OPTIONS_PATH.
     */
    public static final String RRP_QUOTE_OPTIONS_PATH =
        "/quotes/options/?clientId={clientId}&category={category}";
    /**
     * The constant QUOTES_OPTIONS_ID_UN_SELECT_PATH.
     */
    public static final String QUOTES_OPTIONS_ID_UN_SELECT_PATH = "/quotes/options/{id}/unselect";
    /**
     * The constant CLIENTS_ID_RFPS_SUBMIT_RFP_IDS_PATH.
     */
    public static final String CLIENTS_ID_RFPS_SUBMIT_RFP_IDS_PATH =
        "/clients/{clientsId}/rfps/submit/?rfpIds={id}";
    /**
     * The constant CLIENTS_CLIENT_ID_RFPS_PATH.
     */
    public static final String CLIENTS_CLIENT_ID_RFPS_PATH = "/clients/{clientId}/rfps";
    /**
     * The constant CLIENTS_ID_RFPS_TYPE_PDF_PATH.
     */
    public static final String CLIENTS_ID_RFPS_TYPE_PDF_PATH = "/clients/{id}/rfps/{type}/pdf/";
    /**
     * The constant RFPS_CENSUS_CLIENT_ID_PATH.
     */
    public static final String RFPS_CENSUS_CLIENT_ID_PATH = "/rfps/census/?clientId={clientId}";
    /**
     * The constant RFPS_COUNTY_LIST_PATH.
     */
    public static final String RFPS_COUNTY_LIST_PATH = "/rfps/countyList";
    /**
     * The constant RFPS_ID_PATH.
     */
    public static final String RFPS_ID_PATH = "/rfps/{id}";
    /**
     * The constant CLIENTS_ID_RFPS_ALL_PDF_RFP_IDS_PATH.
     */
    public static final String CLIENTS_ID_RFPS_ALL_PDF_RFP_IDS_PATH =
        "/clients/{id}/rfps/all/pdf/?rfpIds={rfpIds}";
    /**
     * The constant CLIENTS_ID_RFPS_TYPE_PATH.
     */
    public static final String CLIENTS_ID_RFPS_TYPE_PATH = "/clients/{id}/rfps/{type}";
    /**
     * The constant CLIENTS_ID_RFPS_PATH.
     */
    public static final String CLIENTS_ID_RFPS_PATH = "/clients/{id}/rfps";
    /**
     * The constant CLIENTS_ID_RFPS_ALL_DOCX_RFP_IDS_PATH.
     */
    public static final String CLIENTS_ID_RFPS_ALL_DOCX_RFP_IDS_PATH =
        "/clients/{id}/rfps/all/docx/?rfpIds={rfpId}";
    /**
     * The constant CLIENTS_ID_RFP_STATUS_RFP_IDS_PATH.
     */
    public static final String CLIENTS_ID_RFP_STATUS_RFP_IDS_PATH =
        "/clients/{id}/rfp/status?rfpIds={rfpIds}";
    /**
     * The constant SIGN_UP_PATH.
     */
    public static final String SIGN_UP_PATH = "/signup";
    /**
     * The constant TIMELINES_INIT_PATH.
     */
    public static final String TIMELINES_INIT_PATH = "/timelines/init";
    /**
     * The constant TIMELINES_CLIENT_ID_PATH.
     */
    public static final String TIMELINES_CLIENT_ID_PATH = "/timelines?clientId={clientId}";
    /**
     * The constant TIMELINES_INVALID_PATH.
     */
    public static final String TIMELINES_INVALID_PATH = "/timelines";
    /**
     * The constant TIMELINES_ID_UPDATE_COMPLETED_PATH.
     */
    public static final String TIMELINES_ID_UPDATE_COMPLETED_PATH =
        "/timelines/{id}/updateCompleted";
    /**
     * The constant TIMELINES_ID_UPDATE_PROJECTED_TIME_PATH.
     */
    public static final String TIMELINES_ID_UPDATE_PROJECTED_TIME_PATH =
        "/timelines/{id}/updateProjectedTime";
    /**
     * The constant FILES_CODE_CLIENT_ID_PATH.
     */
    public static final String FILES_CODE_CLIENT_ID_PATH = "/files/{code}?clientId={clientId}";

    /**
     * The constant ACCOUNTS_USERS_STATUS_PATH.
     */
    public static final String ACCOUNTS_USERS_STATUS_PATH = "/accounts/users/status";
    /**
     * The constant ACCOUNTS_USERS_ATTRIBUTE_PATH.
     */
    public static final String ACCOUNTS_USERS_ATTRIBUTE_PATH = "/accounts/users/attribute?{0}={1}";

    /**
     * Instantiates a new Request path constants.
     */
    public RequestPathConstants() {
    }

}
