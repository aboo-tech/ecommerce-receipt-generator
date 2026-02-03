export interface IPreRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface IRegister {
  email: string;
  otp: string;
}
