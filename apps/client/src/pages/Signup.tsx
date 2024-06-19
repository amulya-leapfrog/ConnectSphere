import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signup } from "../services/Auth";
import { ISignup } from "../interfaces/Auth";
import { signupSchema } from "../schemas/authSchema";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import { Button, TextareaAutosize } from "@material-ui/core";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";

export default function Signup() {
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (values: ISignup) => {
    setIsButtonEnabled(false);
    try {
      await signup(values);
      navigate("/");
    } catch (err) {
      toast.error("Submit Failed");
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
    <div className="signup__container">
      <div>
        <h1>Signup</h1>

        <form
          onSubmit={formik.handleSubmit}
          id="form"
          style={{ gap: 0 }}
          encType="multipart/form-data"
        >
          <div className="signup__formData">
            <div className="signup__element">
              <TextField
                name="email"
                fullWidth
                label="Email"
                variant="outlined"
                value={formik.values.email}
                onChange={(e) => {
                  formik.setFieldValue("email", e.target.value);
                }}
              />

              {formik.touched.email && formik.errors.email && (
                <div className="error">{formik.errors.email}</div>
              )}
            </div>

            <div className="signup__element">
              <TextField
                name="password"
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Password"
                variant="outlined"
                value={formik.values.password}
                onChange={(e) => {
                  formik.setFieldValue("password", e.target.value);
                }}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="error">{formik.errors.password}</div>
              )}
              <button
                type="button"
                className="login__password_eye"
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
          </div>

          <div className="signup__formData">
            <div className="signup__element">
              <TextField
                name="fullName"
                fullWidth
                label="Full Name"
                variant="outlined"
                value={formik.values.fullName}
                onChange={(e) => {
                  formik.setFieldValue("fullName", e.target.value);
                }}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <div className="error">{formik.errors.fullName}</div>
              )}
            </div>

            <div className="signup__element">
              <TextField
                name="phone"
                fullWidth
                label="Phone No."
                variant="outlined"
                value={formik.values.phone}
                onChange={(e) => {
                  formik.setFieldValue("phone", e.target.value);
                }}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="error">{formik.errors.phone}</div>
              )}
            </div>
          </div>

          <div className="signup__element">
            <TextField
              name="residence"
              fullWidth
              label="Residence"
              variant="outlined"
              value={formik.values.residence}
              onChange={(e) => {
                formik.setFieldValue("residence", e.target.value);
              }}
            />
            {formik.touched.residence && formik.errors.residence && (
              <div className="error">{formik.errors.residence}</div>
            )}
          </div>

          <div className="signup__element">
            <TextareaAutosize
              name="bio"
              placeholder="Bio"
              onChange={(e) => {
                formik.setFieldValue("bio", e.target.value);
              }}
              minRows={4}
              value={formik.values.bio}
              className="signup__bio"
            />
          </div>

          <div className="signup__image">
            <label
              htmlFor="input-file"
              id="drop-area"
              style={{ cursor: "pointer" }}
            >
              <input
                type="file"
                accept="image/*"
                hidden
                id="input-file"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  const parentDiv = document.getElementById(
                    "img-view"
                  ) as HTMLElement;
                  if (file) {
                    const imgLink = URL.createObjectURL(file);
                    parentDiv.style.backgroundImage = `url(${imgLink})`;
                    parentDiv.style.backgroundPosition = "center";
                    parentDiv.style.backgroundSize = "cover";
                    parentDiv.textContent = "";
                  }
                  formik.setFieldValue("image", file);
                }}
              />
              <div id="img-view">
                <CloudUploadIcon
                  style={{ fontSize: "50px", color: "#1976d2" }}
                />
                <p>Click here to upload your profile picture</p>
              </div>
            </label>
          </div>

          <div className="submit__btn">
            <Button
              disabled={!formik.dirty || !isButtonEnabled}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              id="loginBtn"
              style={
                isButtonEnabled
                  ? { backgroundColor: "#1976d2" }
                  : { backgroundColor: "" }
              }
            >
              Submit
            </Button>
          </div>
          <p className="login__footer">
            Already Have An Account?{" "}
            <span>
              <Link to="/">Login</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
