import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Icon } from "@mui/material";
import EmailIcon from "../../assets/CarbonUser.png";
import PasswordIcon from "../../assets/CarbonPassword.png";
import Ropstam from "../../assets/ropstam.png";
import { useSignUpMutation } from "../../RTK_QUERY/authApi";
import Snackbar from "../../Components/Snackbar";
import { useState } from "react";
import * as yup from 'yup';
import {useNavigate} from 'react-router-dom'

const theme = createTheme();

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
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

const SignUpSide = () => {
  const navigate=useNavigate()
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [signupFn] = useSignUpMutation();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const body={
      email: data.get("email"),
      name: data.get("name"),
    }

    let validationSuccessful=true

    await schema.validate(body).catch((error)=>{
      error.errors.map((error)=>{
        setErrorAlert(true)
        setErrorMsg(error)
      })
      validationSuccessful=false
    });
    if(validationSuccessful==false)
    {
      return
    }


    await signupFn(body)
      .unwrap()
      .then(() => {
        setSuccessAlert(true);
        setTimeout(() => {
          navigate("/")
        }, 2000);
      })
      .catch((error) => {
        setErrorAlert(true);
        setErrorMsg(error.data.msg);
      });
  };

  return (
    <>
      <Snackbar
        open={successAlert}
        onClose={() => setSuccessAlert(false)}
        severity="success"
        message="Signup successfully"
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
                Sign Up
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
                  name="name"
                  placeholder="name"
                  type="name"
                  id="name"
                  autoComplete="name"
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
                    <Link href="/" variant="body2">
                      {"Already have an account? Sign In"}
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

export default SignUpSide;
