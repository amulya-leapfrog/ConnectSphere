import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ILogin } from "../interfaces/Auth";
import { loginSchema } from "../schemas/authSchema";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/Auth";
import { setCookies } from "../utils/cookies";
import { AxiosError } from "axios";
import { getErrorMessage } from "../utils/errors";
import { useAuth } from "../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  textField: {
    marginBottom: theme.spacing(0),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const LoginForm = () => {
  const classes = useStyles();

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: ILogin) => {
    setIsButtonEnabled(false);
    try {
      const { accessToken, refreshToken } = await login(values);
      setCookies(accessToken, refreshToken);
      isLogin();
      navigate("/home");
    } catch (error) {
      setIsButtonEnabled(true);
      if (
        error instanceof AxiosError &&
        (error.response?.status === 403 || error.response?.status === 404)
      ) {
        const errMessage = getErrorMessage(error);
        setApiError(errMessage);
      } else if (error instanceof AxiosError) {
        const errMessage = String(error.response?.data.message);
        alert(errMessage);
      } else {
        alert("ERROR Occured");
      }
    }
  };

  const displayError = () => {
    if (apiError) {
      return <div className="error">{apiError}</div>;
    }
    if (formik.touched.password && formik.errors.password) {
      return <div className="error">{formik.errors.password}</div>;
    }
    return "";
  };

  const formik = useFormik<ILogin>({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: loginSchema,
    onSubmit: async (values) => {
      handleSubmit(values);
    },
    validateOnChange: true,
    enableReinitialize: true,
    validate: (values) => {
      if (!values.email || !values.password) {
        setIsButtonEnabled(false);
      } else {
        setIsButtonEnabled(true);
      }
    },
  });

  return (
    <div className="login__container">
      <div className="forBlur"></div>
      <div id="form__container">
        <Container>
          <div className={classes.formContainer}>
            <Typography variant="h4" gutterBottom>
              <div className="login__header">Login</div>
            </Typography>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit(e);
              }}
              id="form"
            >
              <div>
                <TextField
                  className={classes.textField}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={formik.values.email}
                  onChange={(e) => {
                    formik.setFieldValue("email", e.target.value);
                  }}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="error">{formik.errors.email}</div>
                )}
              </div>
              <div className="login__password">
                <div>
                  <TextField
                    className={classes.textField}
                    label="Password"
                    variant="outlined"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={(e) => {
                      formik.setFieldValue("password", e.target.value);
                    }}
                  />
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
                  {formik.touched.password && formik.errors.password && (
                    <div className="error">{formik.errors.password}</div>
                  )}
                </div>
                {displayError()}
              </div>

              <Button
                className={classes.button}
                disabled={!formik.dirty || !isButtonEnabled}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                id="loginBtn"
              >
                Login
              </Button>
            </form>
          </div>
          <p className="login__footer">
            Don't Have An Account?{" "}
            <span>
              <Link to="/signup">Signup</Link>
            </span>
          </p>
        </Container>
      </div>
    </div>
  );
};

export default LoginForm;
