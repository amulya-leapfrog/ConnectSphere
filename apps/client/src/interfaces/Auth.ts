export interface ILogin {
  email: string;
  password: string;
}

export interface ISignup extends ILogin {
  fullName: string;
  residence: string;
  phone: string;
  bio?: string;
  image: File | string | null;
}

export interface IUpdate {
  email?: string;
  fullName?: string;
  residence?: string;
  phone?: string;
  bio?: string;
}

export interface IUpdateImage {
  image?: File | null;
  isDelete: boolean;
}
