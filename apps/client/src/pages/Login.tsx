import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useFormik } from "formik";
import { ILogin } from "../interfaces/Auth";
import { loginSchema } from "../schemas/authSchema";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    marginTop: theme.spacing(4),
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

  const handleSubmit = async (values: ILogin) => {
    setIsButtonEnabled(false);
    try {
      // const response = await login(values);
      console.log("Login: ", values);
    } catch (error) {
      console.log(error);
      setIsButtonEnabled(true);
    }
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
    <div id="form__container">
      <Container component="main" maxWidth="xs">
        <div className={classes.formContainer}>
          <Typography variant="h4" gutterBottom>
            <div className="login__header">Login</div>
          </Typography>
          <form onSubmit={formik.handleSubmit} id="form">
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
            <div>
              <TextField
                className={classes.textField}
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                value={formik.values.password}
                onChange={(e) => {
                  formik.setFieldValue("password", e.target.value);
                }}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="error">{formik.errors.password}</div>
              )}
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
        <p>
          Don't Have An Account?{" "}
          <span>
            <Link to="/signup">Signup</Link>
          </span>
        </p>
      </Container>
    </div>
  );
};

export default LoginForm;
