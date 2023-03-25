import { EDCustomerInterviewState, IDCustomerAccountDTO, IDCustomerPreferenceMap } from './D.Customer.dto';

export interface IDCustomerAccountSelfRequestDTO {

}

export interface IDCustomerAccountSelfResponseDTO extends IDCustomerAccountDTO {
  ShortName: string;
  InterviewState?: IDCustomerAccountInterviewDTO;
  Trading?: IDCustomerAccountTradingDTO;
  Preferences?: IDCustomerPreferenceMap;
  DaysToDemoExpiry: number;
  IsMustChangePassword: boolean;
}

interface IDCustomerAccountInterviewDTO {
  State: EDCustomerInterviewState;
  RiskProfileId: number;
}

interface IDCustomerAccountTradingDTO {
  CanPostOrder: boolean;
  CanCancelOrder: boolean;
  CanReadOrder: boolean;
}
