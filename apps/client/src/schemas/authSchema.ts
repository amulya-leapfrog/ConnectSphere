import * as Yup from "yup";
import { AUTH } from "../languages";

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email(AUTH.VALIDATION.EMAIL_VALID)
    .required(AUTH.VALIDATION.EMAIL_REQUIRED),
  password: Yup.string().required(AUTH.VALIDATION.PASSWORD_REQUIRED),
});

export const signupSchema = loginSchema.shape({
  fullName: Yup.string().required(AUTH.VALIDATION.FULLNAME),
  residence: Yup.string().required(AUTH.VALIDATION.RESIDENCE),
  phone: Yup.number()
    .typeError(AUTH.VALIDATION.PHONE_VALID)
    .required(AUTH.VALIDATION.PHONE),
});

export const updateSchema = Yup.object().shape({
  email: Yup.string()
    .email(AUTH.VALIDATION.EMAIL_VALID)
    .required(AUTH.VALIDATION.EMAIL_REQUIRED),
  fullName: Yup.string().required(AUTH.VALIDATION.FULLNAME),
  residence: Yup.string().required(AUTH.VALIDATION.RESIDENCE),
  phone: Yup.number()
    .typeError(AUTH.VALIDATION.PHONE_VALID)
    .required(AUTH.VALIDATION.PHONE),
});
