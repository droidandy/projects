export interface ProfileMainInfoFormData {
  phone: string;
  firstName: string | null;
  lastName: string | null;
  patronymicName: string | null;
  email: string;
  gender: 0 | 1 | undefined;
  cityId: number;
}
