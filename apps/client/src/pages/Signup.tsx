import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { signup } from "../services/Auth";
import { ISignup } from "../interfaces/Auth";
import { signupSchema } from "../schemas/authSchema";
import { useState } from "react";

export default function Signup() {
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const handleSubmit = async (values: ISignup) => {
    setIsButtonEnabled(false);
    try {
      const response = await signup(values);
      console.log("Login: ", response);
    } catch (error) {
      console.log(error);
      setIsButtonEnabled(true);
    }
  };

  const formik = useFormik<ISignup>({
    initialValues: {
      email: "",
      password: "",
      fullName: "",
      residence: "",
      phone: "",
      bio: "",
    },

    validationSchema: signupSchema,
    onSubmit: async (values) => {
      handleSubmit(values);
    },
    validateOnChange: true,
    enableReinitialize: true,
    validate: (values) => {
      if (
        !values.email ||
        !values.password ||
        !values.fullName ||
        !values.phone ||
        !values.residence
      ) {
        setIsButtonEnabled(false);
      } else {
        setIsButtonEnabled(true);
      }
    },
  });

  return (
    <div>
      <h1>This is Signup page</h1>
      <Link to="/">
        <button>Go back to login</button>
      </Link>

      <form onSubmit={formik.handleSubmit} className="form__login">
        <div className="form-login__inputs">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            onChange={(e) => {
              formik.setFieldValue("email", e.target.value);
            }}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <div style={{ color: "red" }}>{formik.errors.email}</div>
          )}
        </div>

        <div className="form-login__inputs">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            onChange={(e) => {
              formik.setFieldValue("password", e.target.value);
            }}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div style={{ color: "red" }}>{formik.errors.password}</div>
          )}
        </div>

        <div className="form-login__inputs">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            name="fullName"
            onChange={(e) => {
              formik.setFieldValue("fullName", e.target.value);
            }}
            value={formik.values.fullName}
          />
          {formik.touched.fullName && formik.errors.fullName && (
            <div style={{ color: "red" }}>{formik.errors.fullName}</div>
          )}
        </div>

        <div className="form-login__inputs">
          <label htmlFor="residence">Residence</label>
          <input
            type="text"
            name="residence"
            onChange={(e) => {
              formik.setFieldValue("residence", e.target.value);
            }}
            value={formik.values.residence}
          />
          {formik.touched.residence && formik.errors.residence && (
            <div style={{ color: "red" }}>{formik.errors.residence}</div>
          )}
        </div>

        <div className="form-login__inputs">
          <label htmlFor="phone">Phone No.</label>
          <input
            type="text"
            name="phone"
            onChange={(e) => {
              formik.setFieldValue("phone", e.target.value);
            }}
            value={formik.values.phone}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div style={{ color: "red" }}>{formik.errors.phone}</div>
          )}
        </div>

        <div className="form-login__inputs">
          <label htmlFor="bio">Bio</label>
          <textarea
            name="bio"
            onChange={(e) => {
              formik.setFieldValue("bio", e.target.value);
            }}
            value={formik.values.bio}
          />
        </div>

        <div className="form__submit-button">
          <button type="submit" disabled={!formik.dirty || !isButtonEnabled}>
            {" "}
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
