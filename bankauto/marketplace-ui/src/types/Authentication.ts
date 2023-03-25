import { SingleApplication } from 'types/SingleApplication';
import { CreditFisCreateParams } from 'types/CreditFis';
import { CreateCreditApplicationParamsDTO } from 'dtos/CreateCreditApplicationParamsDTO';
import { CreateInstalmentApplicationParamsDTO } from 'dtos/CreateInstalmentApplicationParamsDTO';

export interface AuthenticationProperties {
  phone: string;
}

export interface RegistrationProperties {
  firstName: string;
  email: string;
}

export enum AuthSteps {
  DEFAULT = 'default',
  AUTH = 'authorization',
  PHONE_CONFIRMATION = 'phoneConfirmation',
  REGISTRATION = 'registration',
  /** Предложение авторизоваться | зарегистрироваться */
  SUGGEST = 'suggest',
  /* Auth from favourites */
  FAVOURITES = 'favourites',
  COMPARISON = 'comparison',
  TEST_DRIVE = 'testDrive',
  SUBSCRIPTION = 'subscription',
}

export enum RegistrationTypes {
  PLAIN = 'plain',
  VEHICLE_NEW = 'vehicle_new',
  VEHICLE_USED = 'vehicle_used',
  VEHICLE_C2C = 'vehicle_c2c',
  VEHICLE_INSTALLMENT_NEW = 'vehicle_installment_new',
  VEHICLE_INSTALLMENT_USED = 'vehicle_installment_used',
  CREDIT = 'credit',
  CREDIT_VEHICLE_C2C = 'credit_vehicle_c2c',
  CREDIT_C2C = 'credit_c2c',
  INSURANCE = 'insurance',
  CREDIT_NEW = 'credit_new',
  AB_TEST_USER = 'ab_test_user',
  AB_TEST_CALL_CENTER = 'ab_test_call_center',
  AB_TEST_HELP = 'ab_test_help',
  CREDIT_USED = 'credit_used',
  FAVORITES = 'favorites',
  COMPARISON = 'comparison',
  REVIEW = 'review',
  TEST_DRIVE = 'test_drive',
  C2C_PHONE_REQUEST = 'c2c_phone_request',
  SUBSCRIPTION = 'subscription',
}

// Form shared
type NullableProperties<T extends { [k: string]: any }> = {
  [P in keyof T]: T[P] | null;
};
export type AuthenticationValues = NullableProperties<AuthenticationProperties>;
export type RegistrationValues = NullableProperties<RegistrationProperties>;

export interface AuthCallbackProps {
  callbackApplicationParams?: {
    applicationParams: SingleApplication | CreateCreditApplicationParamsDTO | CreateInstalmentApplicationParamsDTO;
    creditParams?: CreditFisCreateParams;
    acquiringBookingParams?: number;
  } | null;
}

export interface AuthModalProps {
  authModalOpen: boolean;
  onAuthRedirect: string;
  authModalTitle: string;
  authModalText: string;
  additionalButtonText?: string;
  additionalButtonOnClick?: () => void;
  onCloseCallback?: (isAuthorized: boolean) => void;
  authModalC2COpen: boolean;
  shouldAutoSendSms: boolean;
  phoneEditable: boolean;
}

// TODO remove from state
type AuthenticationStateHoks = AuthCallbackProps & AuthModalProps;

// State properties
export type AuthenticationState = AuthenticationStateHoks & {
  isLogout: boolean;
  authorizationError?: Error;
  isAuthorized: boolean | null;
  isRegistered: boolean | null;
  expiresIn: number;
  regType?: RegistrationTypes;
  authStep: AuthSteps;
};
