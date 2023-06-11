import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Icon } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PasswordIcon from "../../assets/CarbonPassword.png";
import EmailIcon from "../../assets/CarbonUser.png";
import Ropstam from "../../assets/ropstam.png";
import { useSignInMutation } from "../../RTK_QUERY/authApi";
import { useState } from "react";
import Snackbar from "../../Components/Snackbar";
import { useDispatch } from "react-redux";
import { Login } from "../../Redux/userSlice";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const theme = createTheme();

const schema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .test("password", "Invalid password", function (value) {
      if (!value) return false;
      if (value.length < 8) {
        return this.createError({
          message: "Password must be at least 8 characters",
          path: "password",
        });
      }
      if (!/\d/.test(value) || !/[a-zA-Z]/.test(value)) {
        return this.createError({
          message: "Password must contain at least 1 letter and 1 number",
          path: "password",
        });
      }
      return true;
    }),
  email: yup.string().email("Invalid email").required("Email is required"),
});

const EmailStart = () => {
  return (
    <Icon sx={{ marginRight: "10px" }}>
      <img src={EmailIcon} height="100%" width="100%" />
    </Icon>
  );
};

const PasswordStart = () => {
  return (
    <Icon sx={{ marginRight: "10px" }}>
      <img src={PasswordIcon} height="100%" width="100%" />
    </Icon>
  );
};

const SignInSide = () => {
  const dispatch = useDispatch();
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [signInFn] = useSignInMutation();
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const body = {
      email: data.get("email"),
      password: data.get("password"),
    };

    let validationSuccessful = true;

    await schema.validate(body).catch((error) => {
      error.errors.map((error) => {
        setErrorAlert(true);
        setErrorMsg(error.data.msg);
      });
      validationSuccessful = false;
    });
    if (validationSuccessful == false) {
      return;
    }

    await signInFn(body)
      .unwrap()
      .then((payload) => {
        setSuccessAlert(true);
        dispatch(Login(payload));
        setTimeout(() => {
          navigate("/Dashboard");
        }, 2000);
      })
      .catch((error) => {
        setErrorAlert(true);
        setErrorMsg(error.data);
      });
  };

  return (
    <>
      <Snackbar
        open={successAlert}
        onClose={() => setSuccessAlert(false)}
        severity="success"
        message="Login successfully"
      />

      <Snackbar
        open={errorAlert}
        onClose={() => setErrorAlert(false)}
        severity="error"
        message={errorMsg}
      />

      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: `url(${Ropstam})`,
              backgroundRepeat: "no-repeat",
              backgroundColor: "#025dfc",
              backgroundSize: "auto",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  placeholder="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  InputProps={{
                    startAdornment: <EmailStart />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "400px",
                      boxShadow: "0px 4px 14px 0px #C9CFCD",
                    },
                    "& .MuiOutlinedInput-input": {
                      borderTopLeftRadius: "0px !important",
                      borderBottomLeftRadius: "0px !important",
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  placeholder="password"
                  type="password"
                  id="password"
                  autoComplete="password"
                  InputProps={{
                    startAdornment: <PasswordStart />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "400px",
                      boxShadow: "0px 4px 14px 0px #C9CFCD",
                    },
                    "& .MuiOutlinedInput-input": {
                      borderTopLeftRadius: "0px",
                      borderBottomLeftRadius: "0px",
                    },
                  }}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs={7}></Grid>
                  <Grid item xs={5}>
                    <Link href="/sign-up" variant="body2">
                      {"Dont have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default SignInSide;
