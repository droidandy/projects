interface RegisterByPhoneFormName {
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
}

export interface RegisterByPhoneFormValues extends RegisterByPhoneFormName {
  phone: string | null;
}

export type RegisterByPhoneFormState = RegisterByPhoneFormValues & {
  isConfirmed?: boolean;
  isValid: boolean;
};
