import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Box,
  Button,
  Fade,
  IconButton,
  ListItemIcon,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import DialogComponent from "../../Components/DialogBox";
import Snackbar from "../../Components/Snackbar";
import {
  useCreateMutation,
  useDeleteMutation,
  useGetQuery,
  useUpdateMutation,
} from "../../RTK_QUERY/categoriesApi";
import * as yup from "yup";


const deleteSchema = yup.object().shape({
  id: yup.string().required("ID is required"),
});

const addSchema = yup.object().shape({
  name:yup.string().required("Name is required")
});

const editSchema = yup.object().shape({
  id: yup.string().required("ID is required"),
  name:yup.string().required("Name is required")
});


const Categories = () => {
  // eslint-disable-next-line no-unused-vars
  const { data, isLoading } = useGetQuery();
  const [screenDialog, setScreenDialog] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [itemEditing, setItemEditing] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteFn] = useDeleteMutation();
  const [editFn] = useUpdateMutation();
  const [addFn] = useCreateMutation();
  const [itemUpdated, setItemUpdated] = useState(false);
  const [itemDeleted, setItemDeleted] = useState(false);
  const [itemAdded, setItemAdded] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [addModal, setAddModal] = useState(false);

  const deleteScreen = async () => {
    setScreenDialog(false);
    let validationSuccessful = true;
    const obj ={ id:itemToDelete._id };

    deleteSchema.validate(obj).catch((error) => {
      error.errors.map((error) => {
        setErrorAlert(true);
        setErrorMsg(error);
      });
      validationSuccessful = false;
    });
    if (validationSuccessful == false) {
      return;
    }
    await deleteFn(itemToDelete._id)
      .unwrap()
      .then(() => {
        setItemDeleted(true);
      })
      .catch((error) => {
        setErrorAlert(true);
        setErrorMsg(error.data.msg);
      });
  };

  const handleSubmitADD = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!data.get("Name")) {
      alert("Add name");
    }
    const name = data.get("Name");


    let validationSuccessful = true;
    const obj ={ name };

    addSchema.validate(obj).catch((error) => {
      error.errors.map((error) => {
        setErrorAlert(true);
        setErrorMsg(error);
      });
      validationSuccessful = false;
    });
    if (validationSuccessful == false) {
      return;
    }
    
    await addFn(obj)
      .unwrap()
      .then(() => {
        setItemAdded(true);
        handleCancelAdd();
      })
      .catch((error) => {
        setErrorAlert(true);
        setErrorMsg(error.data.msg);
        handleCancel();
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!data.get("Name")) {
      alert("Add name");
    }
    const name = itemEditing.name;
    const id = itemEditing._id;


    let validationSuccessful = true;
    const obj ={ id, name };

    editSchema.validate(obj).catch((error) => {
      error.errors.map((error) => {
        setErrorAlert(true);
        setErrorMsg(error);
      });
      validationSuccessful = false;
    });
    if (validationSuccessful == false) {
      return;
    }

    await editFn(obj)
      .unwrap()
      .then(() => {
        setItemUpdated(true);
        handleCancel();
      })
      .catch((error) => {
        setErrorAlert(true);
        setErrorMsg(error.data.msg);
        handleCancel();
      });
  };

  const handleCancel = () => {
    setEditModal(false);
    setItemEditing(null);
  };

  const handleCancelAdd = () => {
    setAddModal(false);
  };

  const deleteScreenClose = () => {
    setScreenDialog(false);
    setItemToDelete(false);
  };

  return (
    <>
      <Snackbar
        open={itemAdded}
        onClose={() => setItemAdded(false)}
        severity="success"
        message="Category Added"
      />

      <Snackbar
        open={itemUpdated}
        onClose={() => setItemUpdated(false)}
        severity="success"
        message="Category Updated"
      />

      <Snackbar
        open={itemDeleted}
        onClose={() => setItemDeleted(false)}
        severity="success"
        message="Category Deleted"
      />

      <Snackbar
        open={errorAlert}
        onClose={() => setErrorAlert(false)}
        severity="error"
        message={errorMsg}
      />
      <Modal
        open={addModal}
        onClose={handleCancelAdd}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
      >
        <Fade in={addModal}>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmitADD}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "600px",
              height: "400px",
              bgcolor: "white",
              boxShadow: 24,
              p: 4,
              borderRadius: 10,
            }}
          >
            <Typography variant="h6" gutterBottom>
              ADD Category
            </Typography>
            <TextField placeholder="Name" name="Name" fullWidth />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="contained" type="submit" sx={{ mr: 2 }}>
                ADD
              </Button>
              <Button variant="outlined" onClick={handleCancelAdd}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Modal
        open={editModal}
        onClose={handleCancel}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
      >
        <Fade in={editModal}>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "600px",
              height: "400px",
              bgcolor: "white",
              boxShadow: 24,
              p: 4,
              borderRadius: 10,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Update Category
            </Typography>
            <TextField placeholder="Name" name="Name" fullWidth  value={itemEditing?.name} onChange={(e)=>{
              setItemEditing((obj)=>({
                ...obj,
                name:e.target.value
              }))
            }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="contained" type="submit" sx={{ mr: 2 }}>
                Update
              </Button>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <DialogComponent
        open={screenDialog}
        onClose={deleteScreenClose}
        title={"Delete Category?"}
        description={"Are you sure you want to delete the Category?"}
        onAgree={deleteScreen}
      />
      {isLoading == false && (
        <List dense sx={{ width: "100%", bgColor: "white" }}>
          {data.map((category) => {
            return (
              <ListItem key={category._id} disablePadding>
                <ListItemButton sx={{ display: "flex", alignItems: "center" }}>
                  <ListItemIcon>
                    <Avatar>{category.name[0]}</Avatar>
                  </ListItemIcon>
                  <ListItemText primary={category.name} />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    size="small"
                    onClick={() => {
                      setScreenDialog(true);
                      setItemToDelete(category);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    size="small"
                    onClick={() => {
                      setItemEditing(category);
                      setEditModal(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            );
          })}

          <ListItem key={"ADD"} disablePadding>
            <ListItemButton sx={{ display: "flex", alignItems: "center" }}>
              <ListItemIcon>
                <Avatar>+</Avatar>
              </ListItemIcon>
              <ListItemText primary={"ADD CATEGORY"} />
              <IconButton
                edge="end"
                aria-label="delete"
                size="small"
                onClick={() => {
                  setAddModal(true);
                }}
              >
                <AddIcon />
              </IconButton>
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </>
  );
};

export default Categories;
