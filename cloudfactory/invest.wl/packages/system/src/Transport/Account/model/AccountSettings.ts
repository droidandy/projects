import { EDCustomerAccountState, EDCustomerInterviewState } from '@invest.wl/core';

export interface IAccountSettingsResponse {
  Name: string;
  Login: string;
  State: EDCustomerAccountState;
  InterviewState: {
    State: EDCustomerInterviewState;
    RiskProfileId: number;
  };
  Trading: {
    CanPostOrder: boolean;
    CanCancelOrder: boolean;
    CanReadOrder: boolean;
  };
  Preferences: {
    [key: string]: string;
  };
  Phone: string;
  Email: string;
  DaysToDemoExpiry: number;
  ShortName: string;
  UserAvatarUri?: string;
  IsMustChangePassword: boolean;
}
