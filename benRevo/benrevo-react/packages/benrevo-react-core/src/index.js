// Components

export { default as ValidationLabel } from './components/ValidationLabel';
export { default as GuideTour } from './components/GuideTour';
export { default as TextLoader } from './components/TextLoader';
export { default as withProgressBar } from './components/ProgressBar';
export { default as Dropzone } from './components/Dropzone';
export { origin } from './components/Window/constants';
export { default as SubNavigation } from './components/SubNavigation';
export { default as ToggleButton } from './components/ToggleButton';
export { default as SideNavigation } from './components/SideNavigation';

// Pages: App

export { default as AppPage } from './pages/App';
export { default as AppFooter } from './pages/App/Footer';
export { default as AppHeader } from './pages/App/Header';
export { default as MenuList } from './pages/App/Header/MenuList';
export { default as Wrapper } from './pages/App/';
export { default as UserProfileMenuItem, mapDispatchToProps } from './pages/App/Header/UserProfileMenuItem';
export { DEFAULT_LOCALE, TOGGLE_MOBILE_NAV } from './pages/App/constants';
export { toggleMobileNav } from './pages/App/actions';
export { default as appReducer } from './pages/App/reducer';
export {
  selectGlobal,
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectError,
  makeSelectRepos,
  makeSelectLocationState,
} from './pages/App/selectors';
export { default as AppFooterMessages } from './pages/App/Footer/messages';

// Pages: Admin

export { default as Admin } from './pages/Admin';
export { default as AdminComponent } from './pages/Admin/Admin';

export {
  GET_CONFIG,
  CHANGE_DISCLOSURE,
  DISCLOSURE_CANCEL,
  DISCLOSURE_SUBMIT,
  DISCLOSURE_SUBMIT_SUCCESS,
  DISCLOSURE_SUBMIT_ERROR,
  GET_CONFIG_SUCCESS,
  GET_CONFIG_ERROR,
} from './pages/Admin/constants';
export { changeForm, cancelForm, formSubmit, getConfig } from './pages/Admin/actions';
export { default as homeReducer } from './pages/Admin/reducer';
export {
  watchFetchData,
  getConfig as getConfigData,
  disclosureSubmit,
} from './pages/Admin/sagas';


// Pages: TeamMembers

export { default as TeamMembers } from './pages/Team';
export { default as TeamList } from './pages/Team/TeamList';
export { saveTeam, updateTeam, getTeamMembers } from './pages/Team/actions';

// Pages: Terms

export { default as Terms } from './pages/Terms';

// Pages: Home

export { default as HomeReducer } from './pages/Home/reducer';
export { default as HomeSagas, formSubmit as HomeSagasFormSubmit, watchFetchData as HomeSagasWatchFetchData } from './pages/Home/sagas';
export { changeForm as HomeChangeForm, formSubmit as HomeFormSubmit } from './pages/Home/actions';
export {
  CHANGE_FORM,
  FORM_SUBMIT,
  FORM_SUBMIT_SUCCESS,
  FORM_SUBMIT_ERROR,
} from './pages/Home/constants';

export { default as HomeMessages } from './pages/Home/messages';
export { selectHome, makeSelectForm } from './pages/Home/selectors';

// Pages: Carrier


export { default as CarrierPage } from './pages/Carrier';
export { default as CarrierHome } from './pages/Carrier/Home';
export { sendClients } from './pages/Carrier/actions';
export { default as CarrierMessages } from './pages/Carrier/messages';
export { FETCH_CLIENTS } from './pages/Carrier/constants';
export { selectProfileMeta } from './pages/Carrier/selectors';

// Pages: CompanyDetailPage

export { default as CompanyDetailPage } from './pages/CompanyDetail';
export { CardHeader } from './pages/CompanyDetail/CardHeader';
export { default as CompanyDetailPageMessages } from './pages/CompanyDetail/messages';
export { defaultAction } from './pages/CompanyDetail/actions';
export { DEFAULT_ACTION } from './pages/CompanyDetail/constants';
export { defaultSaga as CompanyDetailSagas } from './pages/CompanyDetail/sagas';
export { default as companyDetailPageReducer } from './pages/CompanyDetail/reducer';

// Pages: Contact

export { default as ContactPage } from './pages/Contact';

// Pages: Login

export { default as LoginPage } from './pages/Login';
export { defaultAction as defaultLoginAction } from './pages/Login/actions';
export { default as LoginMessages } from './pages/Login/messages';
export { DEFAULT_ACTION as DEFAULT_LOGIN_ACTION } from './pages/Login/constants';
export { createLock, createNonce, randomLength, createAndShow } from './pages/Login/lib';

// Pages: UserProfile

export { default as EULAModal } from './pages/UserProfile/components/EULAModal';
export { SAVE_INFO, SAVE_INFO_FAILED, SAVE_INFO_SUCCEEDED } from './pages/UserProfile/constants';
export { saveInfo as saveInfoSagas, watchFetchData as userProfileWatchFetchData } from './pages/UserProfile/sagas';
export { changeInfo, saveInfo, setUserEULA } from './pages/UserProfile/actions';

// Pages: GA

export { default as gaPageReducer } from './pages/Ga/reducer';

// Pages: NotFound

export { default as NotFoundPage } from './pages/NotFound';

// Images

export { default as MedicalIcon } from './assets/img/svg/medicalIcon.svg';
export { default as DentalIcon } from './assets/img/svg/dentalIcon.svg';
export { default as VisionIcon } from './assets/img/svg/visionIcon.svg';
export { default as QuoteMedicalImage } from './assets/img/medical.png';
export { default as QuoteDentalImage } from './assets/img/dental.png';
export { default as QuoteVisionImage } from './assets/img/vision.png';
export { default as QuoteDollarImage } from './assets/img/dollarIcon.png';
export { default as DocumentsIcon } from './assets/img/svg/documents-icon.svg';
export { default as ImportIcon } from './assets/img/svg/import-icon.svg';
export { default as CompareImage } from './assets/img/option_compare.png';
export { default as IconCheckImage } from './assets/img/icon_check.png';
export { default as DownloadIconImage } from './assets/img/svg/downloadBS.svg';
export { default as PopBtmLineImage } from './assets/img/popbtmline.png';
export { default as DownloadIcon } from './assets/img/svg/download.svg';

export { default as ExportIcon } from './assets/img/svg/export-icon.svg';
export { default as ExportClient1 } from './assets/img/instructions/export-client-1.jpg';
export { default as ExportClient2 } from './assets/img/instructions/export-client-2.jpg';
export { default as ExportClient3 } from './assets/img/instructions/export-client-3.jpg';
export { default as ExportClient4 } from './assets/img/instructions/export-client-4.jpg';

export { default as favouriteImage } from './assets/img/svg/yellow-star.svg';
export { default as unfavouriteImage } from './assets/img/svg/gray-star.svg';

export { default as MouseImg } from './assets/img/svg/mouse_white.svg';
export { default as MouseBlueImg } from './assets/img/svg/mouse_blue.svg';
export { default as DownImg } from './assets/img/svg/chevron-down.svg';
export { default as TabletImg } from './assets/img/svg/tablet_blue.svg';
export { default as ClockImg } from './assets/img/svg/clock_blue.svg';
export { default as AnthemLogo } from './assets/img/anthem_logo.png';
export { default as UHCLogo } from './assets/img/uhc_logo_white.png';
export { default as Benrevo } from './assets/img/svg/benrevo.svg';
export { default as ExpeditedImg } from './assets/img/svg/expedited.svg';
export { default as DynamicImg } from './assets/img/svg/dynamic.svg';
export { default as Powered } from './assets/img/poweredbybenrevo.png';
export { default as DiscountImg } from './assets/img/svg/discount-icon.svg';
export { default as Dollar } from './assets/img/dollarIcon.png';
export { default as ClearValue } from './assets/img/svg/clear_value.svg';
export { default as CrossSellBannerImg } from './assets/img/cross-sell-banner.png';
export { default as NoteIcon } from './assets/img/svg/note-icon.svg';
export { default as LearnMoreBenefit } from './assets/img/LearnMoreBenefit.png';
export { default as Remove } from './assets/img/remove.png';
export { default as checkIcon } from './assets/img/icon_check.png';
export { default as plane } from './assets/img/svg/plane.svg';
export { default as LisiImg } from './assets/img/lisi.png';
export { default as WarnerImg } from './assets/img/warner.png';
export { default as selectedIcon } from './assets/img/icon_selected.png';
export { default as selectedMatchIcon } from './assets/img/icon_selected_match.png';

export { default as AlertError } from './assets/img/svg/alert-error.svg';
export { default as AlertWarning } from './assets/img/svg/alert-warning.svg';
export { default as AlertInfo } from './assets/img/svg/alert-info.svg';
export { default as AlertSuccess } from './assets/img/svg/alert-success.svg';

export { default as MacBook } from './assets/img/home_anthem_1.png';
export { default as IpadImg } from './assets/img/ipadImg1.png';

export { default as TimelineSuccess } from './assets/img/green_success.png';

export { default as OptionList1 } from './assets/img/guide-tour/option-list-1.svg';
export { default as OptionOverview1 } from './assets/img/guide-tour/option-overview-1.svg';
export { default as OptionOverview2 } from './assets/img/guide-tour/option-overview-2.svg';
export { default as OptionOverview3 } from './assets/img/guide-tour/option-overview-3.svg';
export { default as OptionOverview4 } from './assets/img/guide-tour/option-overview-4.svg';

export { default as MultiCarriersImg } from './assets/img/multiple_carriers.png';
export { default as MultiCarriersKaiserImg } from './assets/img/multiple_carriers_kaiser.png';

export { default as addNewPlanImg } from './assets/img/svg/group-9.svg';
export { default as closeIcon } from './assets/img/svg/group.svg';
export { default as arrowDown } from './assets/img/svg/group-7.svg';
export { default as warningIcon } from './assets/img/svg/warning-icon.svg';
export { default as arrowLeft } from './assets/img/svg/fill-9.svg';
export { default as editIcon } from './assets/img/svg/edit-icon.svg';
export { default as LessDetails } from './assets/img/svg/less-details.svg';
export { default as DownloadBenefits } from './assets/img/svg/group-15.svg';
export { default as SelectedDetails } from './assets/img/svg/group-2.svg';
export { default as editButton } from './assets/img/svg/group-5.svg';
export { default as ArrowUp } from './assets/img/svg/arrow-up.svg';
export { default as exportIcon } from './assets/img/svg/export-icon.svg';
export { default as CompleteIcon } from './assets/img/svg/complete.svg';

// Utils

export { default as authReducer, initialState as authReducerState } from './utils/authService/reducer';
export { default as commonRoutes,
  errorLoading as errorRouteLoading,
  loadModule as loadRouteModule,
  loadModuleClear as loadRouteModuleClear,
  checkClientRoute,
} from './routes';
export { BENREVO_API_PATH, BENREVO_PATH } from './config';
export Logger from './logger';
export { appLocales, formatTranslationMessages, translationMessages } from './i18n';
export { MIXPANEL_KEY } from './secrets';
export { default as request } from './utils/request';
export { default as version, CHECK_VERSION } from './utils/version';
export { extractFloat, scrollToInvalid, downloadFile } from './utils/form';
export { keepPersist, keepStore, persist } from './utils/persistStore';
export { ROLE_IMPLEMENTATION_MANAGER, LOGOUT, CHANGE_INFO, SET_USER_EULA, CHECK_ROLE } from './utils/authService/constants';
export { default as sagaStorage } from './utils/sagaStorage';
export {
  loggedIn,
  getProfile,
  getToken,
  removeToken,
  popSecret,
  storeToken,
  removeSecret,
  requireUserMetadata,
  storeSecret,
  requireAuth,
  storeProfile,
  getAccessToken,
  getRole,
} from './utils/authService/lib';
export { default as AuthSagas, watchAuth, watchUserGA, getUserInfo } from './utils/authService/sagas';
export {
  SET_PROFILE,
  ERROR_EXPIRED,
} from './utils/authService/constants';

// actions

export { changeUserCount, logout, checkRole, setProfile } from './utils/authService/actions';
export { checkVersion, openFeedbackModal } from './pages/App/actions';

// sagas

export { default as AdminSagas } from './pages/Admin/sagas';
export { default as ContactSagas } from './pages/Contact/sagas';
export { default as UserProfileSagas } from './pages/UserProfile/sagas';
export { default as TeamSagas } from './pages/Team/sagas';

// reducers

export { default as AdminReducer } from './pages/Admin/reducer';
export { default as CompanyDetailReducer } from './pages/CompanyDetail/reducer';
export { default as ContactReducer, initialState as ContactReducerState } from './pages/Contact/reducer';
export { default as globalReducer, initialState as globalReducerState } from './pages/App/reducer';
export { default as languageProviderReducer } from './containers/LanguageProvider/reducer';
export { default as TeamReducer } from './pages/Team/reducer';

// selectors

export { selectEmail, selectPicture, selectBrokerage } from './utils/authService/selectors';

// containers

export { default as LanguageProvider } from './containers/LanguageProvider';

// mockapi

export { default as TimelineData } from './mockapi/_v1_timeline.json';
export { default as Carriers } from './mockapi/_v1_rfpcarriers.json';
export { default as MedicalPresentationPlans } from './mockapi/_v1_presentation_medical.json';
export { default as MedicalPlans } from './mockapi/_v1_presentation_medical_plans.json';
export { default as MedicalPlans2 } from './mockapi/_v1_presentation_medical_plans2.json';
export { default as MedicalPlans3 } from './mockapi/_v1_presentation_medical_plans3.json';
export { default as DentalPlans } from './mockapi/_v1_presentation_dental_plans.json';
export { default as VisionPlans } from './mockapi/_v1_presentation_vision_plans.json';
export { default as CompareData } from './mockapi/_v1_presentation_compare.json';

export { default as ContributionData } from './mockapi/_v1_quotes_options_contribution.json';
export { default as OptionData } from './mockapi/_v1_quotes_options_1.json';
export { default as OptionsData } from './mockapi/_v1_quotes_options.json';
export { default as SelectedData } from './mockapi/_v1_quotes_options_selected.json';
export { default as SummaryData } from './mockapi/_v1_quotes_summary.json';
export { default as NetworksData } from './mockapi/_v1_quotes_options_1_networks.json';
export { default as EnrollmentData } from './mockapi/_v1_quotes_enrollment.json';
export { default as teammembers } from './mockapi/teammembers.json';
