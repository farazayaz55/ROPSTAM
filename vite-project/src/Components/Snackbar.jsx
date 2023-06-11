/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import Snackbar from "@mui/material/Snackbar";
import React from "react";
import MuiAlert from "@mui/material/Alert";
import {memo} from 'react'

function SnackbarComponent(props) {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const { open, onClose, severity, message } = props;

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: "100%", maxWidth: "1500px" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default memo(SnackbarComponent);
