/* eslint-disable react/prop-types */
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogActions from "@mui/material/DialogActions"
import Button from '@mui/material/Button'
import {memo} from 'react'

// eslint-disable-next-line react-refresh/only-export-components
function DialogComponent(props) {
  const { open, onClose, title, description, onAgree } = props;

  return (
    <>
    <Dialog
      PaperProps={{
        style: { borderRadius: 28 },
      }}
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ borderRadius: 40 }}
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ borderRadius: "10px" }}>
          Disagree
        </Button>
        <Button onClick={onAgree} sx={{ borderRadius: "10px" }} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default memo(DialogComponent);
