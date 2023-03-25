export enum Route {
  Welcome,
  Signup,
  Signin,
  App,
  AuthLoading,
}

export enum Routes {
  // common routes
  HomeScreen = 'HomeScreen',
  FeedScreen = 'FeedScreen',
  StepContainer = 'StepContainer',
  OnboardingError = 'OnboardingError',

  // Root stack screens
  Root = 'Root',
  NotFound = 'NotFound',
  NewAccountFlow = 'NewAccountFlow',
  CreateHunchFlow = 'CreateHunchFlow',
  CreateStackFlow = 'CreateStackFlow',
  Stacks = 'Stacks',
  ExploreStacks = 'ExploreStacks',
  CompaniesList = 'CompaniesList',
  MyStack = 'MyStack',
  OtherStack = 'OtherStack',
  Hunch = 'Hunch',
  Hunches = 'Hunches',
  ExploreHunches = 'ExploreHunches',
  Investopeers = 'Investopeers',
  CreateModal = 'CreateModal',
  ActionSheet = 'ActionSheet',
  AccountHighlights = 'AccountHighlights',

  // modal stack screens
  Main = 'Main',
  AccountSelector = 'AccountSelector',
  ModalScreen = 'ModalScreen',
  FullScreen = 'FullScreen',

  // bottom tabs
  Watchlist = 'Watchlist',
  Trade = 'Trade',
  Home = 'Home',
  Feed = 'Feed',
  Fund = 'Fund',
  Profile = 'Profile',

  // new acount flow
  NewAccountScreen = 'NewAccountScreen',
  ConfirmAccountDetails = 'ConfirmAccountDetails',

  // Profile
  ProfileScreen = 'ProfileScreen',
  EditProfileScreen = 'EditProfileScreen',
  Feedback = 'Feedback',
  Documents = 'Documents',

  // Explore
  Explore = 'Explore',
  ExploreScreen = 'ExploreScreen',
  CompanyProfile = 'CompanyProfile',

  // Trade
  TradeNavigator = 'TradeNavigator',
  BuyOrSell = 'BuyOrSell',
  OrderDetails = 'OrderDetails',
  ConfirmTrade = 'ConfirmTrade',
  ActivityDetails = 'ActivityDetails',
}

export enum OnboardingScreens {
  OnboardingInterests = 'OnboardingInterests',
  OnboardingCompanies = 'OnboardingCompanies',
  OnboardingFirstStack = 'OnboardingFirstStack',
  OnboardingCommunutyStack = 'OnboardingCommunityStack',
  OnboardingInvestorPeers = 'OnboardingInvestorPeers',
  OnboardingTags = 'OnboardingTags',
  OnboardingBadge = 'OnboardingBadge',
  OnboardingSignUp = 'OnboardingSignUp',
  OnboardingSignUpExtra = 'OnboardingSignUpExtra',
  OnboardingCode = 'OnboardingCode',
}

export enum CreateStackScreens {
  Intro = 'CreateStackIntro',
  SelectCompany = 'CreateStackSelectCompany',
  NameStack = 'NameStack',
}

export enum CreateHunchScreens {
  Intro = 'CreateHunchIntro',
  SelectCompany = 'CreateHunchSelectCompany',
  SetPriceAndDate = 'SetPriceAndDate',
  CreateHunch = 'CreateHunch',
}

export enum FundingScreens {
  FundingStack = 'FundingStack',
  HowScreen = 'Home',
  ToWhereScreen = 'ToWhereScreen',
  ACATSFromWhereScreen = 'ACATSFromWhereScreen',
  ACHFromWhereScreen = 'ACHFromWhereScreen',
  HowMuchScreen = 'HowMuchScreen',
  AllSetScreen = 'AllSetScreen',
  WireTransferScreen = 'WireTransferScreen',
  PlaidScreen = 'PlaidScreen',
}
