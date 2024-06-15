import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signup } from "../services/Auth";
import { ISignup } from "../interfaces/Auth";
import { signupSchema } from "../schemas/authSchema";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (values: ISignup) => {
    setIsButtonEnabled(false);
    try {
      await signup(values);
      navigate("/");
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
      image: null,
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

      <form
        onSubmit={formik.handleSubmit}
        className="form__login"
        encType="multipart/form-data"
      >
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
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={(e) => {
              formik.setFieldValue("password", e.target.value);
            }}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <div style={{ color: "red" }}>{formik.errors.password}</div>
          )}
          <button
            type="button"
            className="form-login__password_eye"
            onClick={() => setShowPassword(!showPassword)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setShowPassword(!showPassword);
              }
            }}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
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

        <div className="form-login__inputs">
          <label htmlFor="image">Profile Pic</label>
          <input
            name="image"
            type="file"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              formik.setFieldValue("image", file);
            }}
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
