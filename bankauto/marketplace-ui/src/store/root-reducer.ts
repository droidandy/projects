import { combineReducers } from 'redux';
import { StateModel } from './types';
import { flashMessagesReducer } from './flash-messages';
import { reducer as userReducer } from './user';
import { insuranceFilterValuesReducer } from './insurance/filter';
import { insuranceApplicationReducer } from './insurance/application';
import { messageModalReducer } from './message-modal';
import { reducer as applicationReducer } from './profile/application';
import { reducer as vehiclesFilterReducer } from './catalog/vehicles/filter';
import { reducer as vehiclesListReducer } from './catalog/vehicles/list';
import { reducer as vehiclesMetaReducer } from './catalog/vehicles/meta';
import { reducer as vehicleItemReducer } from './catalog/vehicle/item';
import { reducer as vehicleRelativesReducer } from './catalog/vehicle/relatives';
import { reducer as vehiclesBestOffersReducer } from './catalog/bestOffers';
import { reducer as vehicleCreateReducer } from './catalog/vehicleCreate';
import { reducer as aliasCheckReducer } from './catalog/aliasCheck';
import { reducer as brandsNewReducer } from './catalog/brands';
import { reducer as brandReducer } from './catalog/brand';
import { reducer as specialProgramsReducer } from './finance/specialPrograms';
import { reducer as specialProgramReducer } from './finance/specialProgram';
import { reducer as homeReducer } from './home';
import { reducer as blogReducer } from './blog';
import { reducer as partnersReducer } from './partners';
import { reducer as applicationsReducer } from './profile/applications';
import { reducer as favouritesReducer } from './profile/favourites';
import { reducer as advertiseListReducer } from './finance/advertiseList';
import { reducer as depositCalculatorReducer } from './finance/depositCalculator';
import { reducer as depositSubmitReducer } from './finance/depositSubmit';
import { reducer as exchangeRatesReducer } from './finance/exchangeRates';
import { reducer as vehicleDraftReducer } from './catalog/vehicleDraft';
import { reducer as autostatReducer } from './autostat';
import { reducer as instalmentBrandsReducer } from './instalment/brands';
import { reducer as instalmentBestOffersReducers } from './instalment/bestOffers';
import { reducer as instalmentFilterReducer } from './instalment/vehicles/filter';
import { reducer as instalmentListReducer } from './instalment/vehicles/list';
import { reducer as instalmentMetaReducer } from './instalment/vehicles/meta';
import { reducer as instalmentOfferReducer } from './instalment/vehicle/item';
import { reducer as instalmentRelativesReducer } from './instalment/vehicle/relatives';
import { reducer as financeCreditStandaloneReducer } from './finance/credit/standalone';
import { reducer as financeCreditVehicleReducer } from './finance/credit/vehicle';
import { reducer as sellerInfoReducer } from './catalog/seller';
import { reducer as cityReducer } from './city';
import { reducer as linksReducer } from './links';
import { reducer as breadCrumbsReducer } from './breadcrumbs';
import { reducer as notificationsReducer } from './notifications';
import { reducer as vehicleCreateDataReducer } from './catalog/create/data';
import { reducer as vehicleCreateOptionsReducer } from './catalog/create/options';
import { reducer as vehicleCreateStickersReducer } from './catalog/create/stickers';
import { reducer as vehicleCreateValuesReducer } from './catalog/create/values';
import { reducer as serviceRequestReducer } from './service/request';
import { reducer as debitCardsReducer } from './finance/debitCards';
import { reducer as debitSubmitReducer } from './finance/debitSubmit';
import { reducer as comparisonVehiclesNewReducer } from './profile/comparisonVehicles/comparisonVehiclesNew';
import { reducer as comparisonVehiclesUsedReducer } from './profile/comparisonVehicles/comparisonVehiclesUsed';
import { reducer as comparisonIdsReducer } from './comparisonIds';
import { reducer as userReviewReducer } from './profile/userReview';
import { reducer as userReviewsReducer } from './profile/userReviews';
import { reducer as createReviewDataReducer } from './catalog/review/create/data';
import { reducer as vehicleReviewReducer } from './catalog/review/vehicle';

export const rootReducer = combineReducers<StateModel>({
  notifications: notificationsReducer,
  home: homeReducer,
  blog: blogReducer,
  dealerPartners: partnersReducer,
  vehiclesBestOffers: vehiclesBestOffersReducer,
  vehiclesFilter: vehiclesFilterReducer,
  vehiclesList: vehiclesListReducer,
  vehiclesMeta: vehiclesMetaReducer,
  vehicleItem: vehicleItemReducer,
  vehicleRelatives: vehicleRelativesReducer,
  vehicleCreate: vehicleCreateReducer,
  vehicleCreateData: vehicleCreateDataReducer,
  vehicleCreateOptions: vehicleCreateOptionsReducer,
  vehicleCreateStickers: vehicleCreateStickersReducer,
  vehicleCreateSellValues: vehicleCreateValuesReducer,
  serviceRequest: serviceRequestReducer,
  insuranceFilterValues: insuranceFilterValuesReducer,
  insuranceApplication: insuranceApplicationReducer,
  brand: brandReducer,
  brandsNew: brandsNewReducer,
  aliasCheck: aliasCheckReducer,
  flashMessages: flashMessagesReducer,
  messageModal: messageModalReducer,
  user: userReducer,
  applications: applicationsReducer,
  application: applicationReducer,
  favourites: favouritesReducer,
  comparisonVehiclesNew: comparisonVehiclesNewReducer,
  comparisonVehiclesUsed: comparisonVehiclesUsedReducer,
  comparisonIds: comparisonIdsReducer,
  userReviews: userReviewsReducer,
  userReview: userReviewReducer,
  specialPrograms: specialProgramsReducer,
  specialProgram: specialProgramReducer,
  advertiseList: advertiseListReducer,
  depositCalculator: depositCalculatorReducer,
  depositSubmit: depositSubmitReducer,
  sellerInfo: sellerInfoReducer,
  vehicleDraftData: vehicleDraftReducer,
  autostat: autostatReducer,
  exchangeRates: exchangeRatesReducer,
  instalmentBrands: instalmentBrandsReducer,
  instalmentBestOffers: instalmentBestOffersReducers,
  instalmentFilter: instalmentFilterReducer,
  instalmentList: instalmentListReducer,
  instalmentMeta: instalmentMetaReducer,
  instalmentOffer: instalmentOfferReducer,
  instalmentRelatives: instalmentRelativesReducer,
  financeCreditStandalone: financeCreditStandaloneReducer,
  financeCreditVehicle: financeCreditVehicleReducer,
  city: cityReducer,
  links: linksReducer,
  breadCrumbs: breadCrumbsReducer,
  debitCards: debitCardsReducer,
  debitSubmit: debitSubmitReducer,
  createReviewData: createReviewDataReducer,
  vehicleReview: vehicleReviewReducer,
});
