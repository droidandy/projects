import { Action, AnyAction, Middleware, Store } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  ExchangeRates,
  APPLICATION_CREDIT_STATUS,
  APPLICATION_INSURANCE_TYPE,
  APPLICATION_VEHICLE_STATUS,
  ApplicationMeeting,
  BlogPosts,
  CatalogBrand,
  CatalogBrandNode,
  Partners,
  Vehicle,
  VEHICLE_TYPE,
  VehiclesFilterData,
  SpecialOfferItem,
  BDASpecialOffer,
  AdvertiseList,
  BlogCategories,
  CatalogBrandsShort,
  VehicleShort,
  VehicleNew,
  VehicleApplicationShort,
  Seller,
  InstalmentApplicationShort,
  LinkItem,
  C2cApplicationShort,
  VEHICLE_SCENARIO,
  CreditType,
  CreditSubtype,
  SimpleCreditSubtype,
  SpecialOffer,
  APPLICATION_CREDIT_STEP,
  ComparisonIds,
  VehicleComparisonUsed,
  Option,
  VehicleComparisonNew,
  StickerData,
} from '@marketplace/ui-kit/types';
import { StepsData, StepsDataFis } from 'containers/PersonalArea/Application/types';
import { CreditStep as FinanceCreditStep, SimpleCreditStep } from 'containers/Finance/Credit/types/CreditFormTypes';
import { Flash } from 'types/Flash';
import { InsuranceApplication, InsuranceFilterFormValues } from 'types/Insurance';
import {
  CreateVehicleContacts,
  CreateVehicleData,
  CreateVehicleDataWithOptions,
  CreateVehicleValues,
} from 'types/VehicleCreateNew';
import {
  VehicleFormDataParams,
  VehicleFormData,
  VehicleFormOptions,
  VehicleFormSellValues,
  VehicleFormCatalogType,
} from 'types/VehicleFormType';
import { HomeTab } from 'types/Home';
import { AutostatParamsAccurate, AutostatData, AutostatParams } from 'types/Autostat';
import { SimpleModalControl } from 'components/SimpleModal';
import { MessageModalName } from 'types/MessageModal';
import { InstalmentVehiclesMeta, VehicleInstalmentItem, VehicleInstalmentListItem } from 'types/Vehicle';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { VehicleSortType } from 'types/VehicleSortTypes';
import { ColorChooseItem } from 'types/VehicleChooseColor';
import { City } from 'types/City';
import { NotificationItem } from 'types/Notification';
import { VehiclesMetaData } from 'types/VehicleMeta';
import { BreadCrumbsItem } from 'types/BreadCrumbs';
import { VehicleAlias } from 'types/VehicleAlias';
import { StateSession } from 'store/user/types';
import { VehicleOfferDraft } from 'api/client/vehicle';
import {
  CurrentUserReview,
  Review,
  ReviewCreateFormData,
  ReviewCreateFormValue,
  ReviewFilterDataParams,
  ReviewsStats,
} from 'types/Review';
import { VehiclesFilterDataWithSeller } from 'types/VehiclesFilterDataWithSeller';

interface StateBase {
  initiated?: boolean;
  loading?: boolean;
  error?: Error | null;
}

export type NotificationsState = {
  messages: NotificationItem[];
};

export type BrandsState = Record<VEHICLE_TYPE, CatalogBrandNode[] | null>;

export type ApplicationsState = BaseStateProperties & {
  items: (VehicleApplicationShort | InstalmentApplicationShort | C2cApplicationShort)[];
};

export type FavouritesState = BaseStateProperties & {
  items: VehicleShort[];
};

export type ComparisonIdsState = BaseStateProperties & {
  data: ComparisonIds;
};

export type InsuranceServiceState = {
  loading: boolean;
  error: string | null;
  paymentLink: string;
  paymentLinkLoading: boolean;
};

export type InsuranceState = StateBase & {
  application: InsuranceApplication;
  services: Record<APPLICATION_INSURANCE_TYPE, InsuranceServiceState>;
};

export type MessageModalState = {
  variant: MessageModalName | null;
  open: boolean;
  controls?: SimpleModalControl[];
  callbackOnClose?: () => void;
};

export interface StateError {
  message: string;
}

export interface BaseStateProperties {
  loading: boolean;
  error: StateError | null;
  initial: boolean | null;
}

interface BaseListProperties {
  currentPage: number;
  sorting: VehicleSortType | null;
  pageLimit: number;
}

export type ApplicationContainerState = {
  id?: number;
  uuid?: string;
  discount?: number;
  createdAt?: number;
  approvedCreditExists?: boolean;
};

export type VehicleState = {
  id?: number;
  vehicleId?: number;
  discount?: number;
  number?: string;
  type?: VEHICLE_TYPE;
  salesOfficeId?: number;
  price: number;
  isPaid?: boolean;
  paymentDate?: number;
  refundDate?: number;
  bookedTill?: number;
  meetingSchedule?: ApplicationMeeting;
  data?: Vehicle;
  status?: APPLICATION_VEHICLE_STATUS;
  pdf?: string;
  qrCode?: string;
  specialOffer?: SpecialOffer;
};

type CreditCommonState = {
  id?: number;
  discount?: number;
  initialPayment: number;
  amount: number;
  term: number;
  monthlyPayment: number;
  backendLastSentStep?: APPLICATION_CREDIT_STEP;
  savedStep?: number;
  savedData?: StepsData | StepsDataFis;
  number?: string;
  rate?: number;
};

export type SimpleCreditState = CreditCommonState & {
  rate: number;
  type: CreditType;
  vehicleCost: number;
  status: APPLICATION_CREDIT_STATUS;
  subtype: SimpleCreditSubtype | CreditSubtype.BDA_C2C;
};

export type ApplicationState = {
  container: BaseStateProperties & ApplicationContainerState;
  vehicle: BaseStateProperties & VehicleState;
  simpleCredit: BaseStateProperties & SimpleCreditState;
};

export type DepositCalculatorState = BaseStateProperties & {
  amount: number;
  term: number;
  refill: boolean;
  withdrawal: boolean;
  withoutPercentWithdrawal: boolean;
  depositRate: number;
  addition: number;
};

export type VehicleCreateState = BaseStateProperties & {
  values: CreateVehicleValues;
  valid: boolean | null;
  lastUpdated: keyof CreateVehicleValues | null;
  data: CreateVehicleDataWithOptions;
  contacts: CreateVehicleContacts;
  contactsValid: boolean | null;
  scenario: VEHICLE_SCENARIO;
};

export type VehicleCreateSellValuesState = BaseStateProperties & {
  values: VehicleFormSellValues;
};

export type VehicleCreateOptionsState = BaseStateProperties & {
  options: VehicleFormOptions;
};
export type VehicleCreateStickersState = BaseStateProperties & {
  stickers: StickerData[];
};

export type VehicleCatalogDataState = BaseStateProperties & {
  catalogType: VehicleFormCatalogType;
  params: VehicleFormDataParams;
  data: VehicleFormData;
};

export type VehicleReviewState = BaseStateProperties & {
  stats: ReviewsStats | null;
  reviews: Review[];
  totalPages: number | null;
} & Omit<BaseListProperties, 'sorting'>;

export type ReviewCatalogDataState = BaseStateProperties & {
  params: ReviewFilterDataParams;
  data: ReviewCreateFormData;
};

export type FinanceCreditStandaloneState = {
  initialPayment: number;
  /** Сумма кредита наличными */
  amount: number;
  /** Сумма авто без вычета первоначального взноса */
  vehiclePrice: number;
  term: number;
  rate: number;
  monthlyPayment: number;
  id?: number;
  uuid?: string;
  creditStep?: SimpleCreditStep;
  userSkippedAuth?: boolean;
};

export type FinanceCreditVehicleState = {
  applicationId?: number;
  id?: number;
  uuid?: number;
  amount: number;
  initialPayment: number;
  monthlyPayment: number;
  vehiclePrice: number;
  term: number;
  creditStep?: FinanceCreditStep;
  rate: number;
  userSkippedAuth?: boolean;
};

export type CreateReviewState = BaseStateProperties & {
  values: ReviewCreateFormValue;
  valid: boolean | null;
  lastUpdated: keyof ReviewCreateFormValue | null;
  data: CreateVehicleData;
};

type StateModules = {
  notifications: NotificationsState;
  home: BaseStateProperties & {
    activeTab: HomeTab;
    meta: { vehiclesCount: number };
  };
  vehiclesBestOffers: BaseStateProperties & {
    items: VehicleShort[] | null;
  };
  specialPrograms: BaseStateProperties & {
    items: SpecialOfferItem[] | null;
    count: number;
  };
  specialProgram: BaseStateProperties & { data: BDASpecialOffer; vehicles: Array<any> };
  vehiclesFilter: BaseStateProperties & {
    sort: VehicleSortType | null;
    values: VehiclesFilterValues;
    data: VehiclesFilterDataWithSeller;
  };
  vehiclesList: BaseStateProperties &
    BaseListProperties & {
      items: VehicleShort[];
      loadingPage: boolean;
      errorPage: StateError | null;
    };
  blog: BaseStateProperties & {
    posts: BlogPosts | null;
    blogCategories: BlogCategories | null;
  };
  dealerPartners: BaseStateProperties & {
    partners: Partners | null;
  };
  vehiclesMeta: BaseStateProperties & {
    meta: VehiclesMetaData;
  };
  vehicleItem: BaseStateProperties & {
    vehicle: VehicleNew | null;
    availableColors: ColorChooseItem[] | null;
    pickedColor: ColorChooseItem | null;
  };
  vehicleRelatives: BaseStateProperties & {
    items: VehicleShort[] | null;
  };
  aliasCheck: BaseStateProperties & {
    data: {
      brand: VehicleAlias | null;
      model: VehicleAlias | null;
      generation: VehicleAlias | null;
    } | null;
  };
  brandsNew: BaseStateProperties & {
    brands: Record<VEHICLE_TYPE | 'all', CatalogBrandsShort[] | null>;
  };
  brand: BaseStateProperties & {
    brand: (CatalogBrand & { type: VEHICLE_TYPE }) | null;
  };
  vehicleCreate: VehicleCreateState;
  vehicleCreateData: VehicleCatalogDataState;
  vehicleCreateOptions: VehicleCreateOptionsState;
  vehicleCreateStickers: VehicleCreateStickersState;
  vehicleDraftData: BaseStateProperties & {
    draftData: VehicleOfferDraft | null;
    isSent: boolean;
  };
  vehicleCreateSellValues: VehicleCreateSellValuesState;
  serviceRequest: any;
  autostat: BaseStateProperties & {
    params: AutostatParams | null;
    paramsAccurate: AutostatParamsAccurate | null;
    data: AutostatData | null;
  };
  sellerInfo: BaseStateProperties & {
    info: Seller | null;
  };
  userReviews: BaseStateProperties &
    Omit<BaseListProperties, 'sorting'> & {
      items: CurrentUserReview[];
      totalPages: number | null;
    };
  userReview: BaseStateProperties & {
    data: Review | null;
  };
  insuranceApplication: InsuranceState;
  insuranceFilterValues: InsuranceFilterFormValues;
  flashMessages: Flash[];
  messageModal: MessageModalState;
  applications: ApplicationsState;
  application: ApplicationState;
  favourites: FavouritesState;
  comparisonVehiclesNew: BaseStateProperties & {
    items: VehicleComparisonNew[];
    optionsMap: Option[];
  };
  comparisonVehiclesUsed: BaseStateProperties & {
    items: VehicleComparisonUsed[];
    optionsMap: Option[];
  };
  comparisonIds: ComparisonIdsState;
  advertiseList: BaseStateProperties & AdvertiseList;
  depositCalculator: DepositCalculatorState;
  depositSubmit: BaseStateProperties;
  debitSubmit: BaseStateProperties;
  exchangeRates: BaseStateProperties & {
    rates: ExchangeRates;
  };
  // instalment
  instalmentBrands: BaseStateProperties & {
    brands: CatalogBrandsShort[] | null;
  };
  instalmentBestOffers: BaseStateProperties & {
    items: VehicleInstalmentListItem[] | null;
  };
  instalmentFilter: BaseStateProperties & {
    sort: VehicleSortType;
    values: VehiclesFilterValues;
    data: VehiclesFilterData;
  };
  instalmentList: BaseStateProperties &
    BaseListProperties & {
      items: VehicleInstalmentListItem[];
      loadingPage: boolean;
      errorPage: StateError | null;
    };
  instalmentMeta: BaseStateProperties & {
    meta: InstalmentVehiclesMeta;
  };
  instalmentOffer: BaseStateProperties & {
    vehicle: VehicleInstalmentItem | null;
  };
  instalmentRelatives: BaseStateProperties & {
    items: VehicleInstalmentListItem[] | null;
  };
  financeCreditStandalone: BaseStateProperties & FinanceCreditStandaloneState;
  financeCreditVehicle: BaseStateProperties & FinanceCreditVehicleState;
  city: BaseStateProperties & {
    list: {
      primary: City[];
      secondary: City[];
    };
    current: City;
    extraCoverageRadius: number;
    isCityModalOpen: boolean;
    showCityConfirmation: boolean;
  };
  links: BaseStateProperties & {
    items: LinkItem[] | null;
  };
  debitCards: BaseStateProperties & {
    items: DebitCardSmall[] | null;
    item: DebitCardSmall | null;
  };
  breadCrumbs: {
    items: BreadCrumbsItem[] | null;
  };
  createReviewData: ReviewCatalogDataState;
  vehicleReview: VehicleReviewState;
};

export type StateModel = StateModules & StateSession;

export type ReduxExtraArgument = {
  initial: boolean | null;
};

export type DispatchType<S = StateModel, E = ReduxExtraArgument, A extends Action = AnyAction> = ThunkDispatch<S, E, A>;

export type StoreType<S = StateModel, E = ReduxExtraArgument, A extends Action = AnyAction> = Store<S, A> & {
  dispatch: DispatchType<S, E, A>;
};

export type StateMiddleware<S = StateModel> = Middleware<{}, S, DispatchType>;

export interface DebitCardBonus {
  title: string;
  valueSmallText: string;
  valueBigText: string;
  valueSmallText2?: string;
  tooltipText?: string;
  hideInMobile?: boolean;
  iconName?: string;
}

export type FilterKey = 'travel' | 'savings' | 'cashback' | 'mastercard' | 'mir' | 'budget';
export type DebitCardName = 'active-cashback' | 'active-social' | 'auto-drive' | 'gran-turismo' | 'dorozhnaya';
export type PaymentSystem = 'mir' | 'mastercard';

export type FullCondition = {
  label: string;
  value: string | true;
  tooltipText?: string;
};

export type Banner = {
  imageUrl: string;
  title?: string;
  subtitile?: string;
  percent?: string;
};

export type Tariff = {
  title: string;
  content: { contentTitle: string; conditions?: string[] }[];
};

export interface DebitCardSmall {
  id: number;
  rankForDisplay: number;
  title: string;
  shortDescription: string;
  img: string;
  tags: string[];
  bonuses: DebitCardBonus[];
  keyConditions: DebitCardBonus[];
  fullConditions?: FullCondition[];
  advantages: string[];
  cardName: DebitCardName;
  paymentSystems: PaymentSystem[];
  filter: FilterKey[];
  isPromo?: boolean;
  banners?: Banner[];
  tariffs?: Tariff[];
}
declare module 'react-redux' {
  export function useDispatch(): DispatchType;
}
