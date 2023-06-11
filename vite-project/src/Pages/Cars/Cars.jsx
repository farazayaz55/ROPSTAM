import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Autocomplete,
  Button,
  Fade,
  Modal,
  TextField,
  styled,
} from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import PropTypes from "prop-types";
import * as React from "react";
import { useState } from "react";
import Snackbar from "../../Components/Snackbar";
import {
  useCreateMutation,
  useDeleteMutation,
  useGetQuery,
  useUpdateMutation,
} from "../../RTK_QUERY/carsApi";
import { useGetQuery as Categories } from "../../RTK_QUERY/categoriesApi";
import * as yup from "yup";

const editSchema = yup.object().shape({
  id: yup.string().required("ID is required"),
  name: yup.string().required("Name is required"),
  categories: yup.string().required("Categories is required"),
  color: yup.string().required("Color is required"),
  model: yup.number().required("Model is required"),
  registrationNumber: yup.string().required("Registration number is required"),
  make: yup.string().required("Make is required"),
});

const deleteSchema = yup.object().shape({
  id: yup.string().required("ID is required"),
});

const addSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  color: yup.string().required("Color is required"),
  model: yup.number().required("Model is required"),
  registrationNumber: yup.string().required("Registration number is required"),
  make: yup.string().required("Make is required"),
  categories: yup.string().required("Categories is required"),
});

const ColorButton = styled(Button)(() => ({
  color: "red",
  backgroundColor: "blue",
  "&:hover": {
    backgroundColor: "lightblue",
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "Categories",
    numeric: false,
    disablePadding: true,
    label: "Categories",
  },
  {
    id: "Color",
    numeric: true,
    disablePadding: false,
    label: "Color",
  },
  {
    id: "Make",
    numeric: true,
    disablePadding: false,
    label: "Make",
  },
  {
    id: "Model",
    numeric: true,
    disablePadding: false,
    label: "Model",
  },
  {
    id: "Name",
    numeric: true,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "Registration Number",
    numeric: true,
    disablePadding: false,
    label: "Registration Number",
  },
];

function EnhancedTableHead(props) {
  // eslint-disable-next-line no-unused-vars
  const { data } = useGetQuery();
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  // eslint-disable-next-line react/prop-types
  const { numSelected, selected, setSelected } = props;
  const [editAlert, setEditAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [addAlert, setAddAlert] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const { data: categories } = Categories();
  const [groupsConst, setgroupsConst] = useState([]);
  const [addGroupValue, setAddGroupValue] = useState();
  React.useEffect(() => {
    if (categories) {
      const arr = [];
      categories.map((category) => {
        arr.push({
          label: category.name,
          value: category._id,
        });
      });
      setgroupsConst([...arr]);
    }
  }, [categories]);
  const [editFn] = useUpdateMutation();
  const [deleteFn] = useDeleteMutation();
  const [addFn] = useCreateMutation();
  // eslint-disable-next-line no-unused-vars
  const [carToEdit, setCarToEdit] = useState({});
  const [carEditModal, setCarEditModal] = useState(false);
  const [addCarModal, setAddCarModal] = useState(false);

  const handleEditClick = () => {
    // eslint-disable-next-line react/prop-types
    if (selected.length > 1) {
      alert("We can edit only 1 item at a time");
    }
    // eslint-disable-next-line react/prop-types
    selected.map((car) => {
      setCarToEdit(car);
      setCarEditModal(true);
    });
  };

  const handleDeleteClick = () => {
    // Handle delete button click
    // eslint-disable-next-line react/prop-types
    selected.map((car) => {
      let validationSuccessful = true;

      let obj = { id: car._id };
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

      deleteFn(car._id)
        .unwrap()
        .then(() => {
          setSelected([]);
          setDeleteAlert(true);
        })
        .catch((error) => {
          setSelected([]);
          setErrorAlert(true);
          setErrorMsg(error.data.msg);
        });
    });
  };

  const getName = () => {
    let ret;
    categories?.map((category) => {
      if (category?._id == carToEdit?.categories) {
        ret = category.name;
      }
    });
    return ret;
  };

  const handleAutoChange = (e, newValue) => {
    setCarToEdit((oldObj) => {
      return {
        ...oldObj,
        categories: newValue.value,
      };
    });
  };

  const cancelEditModal = () => {
    setCarEditModal(false);
    setCarToEdit({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { _id, name, categories, color, model, registrationNumber, make } =
      carToEdit;

    let validationSuccessful = true;
    const obj = {
      id: _id,
      name,
      categories,
      color,
      model,
      registrationNumber,
      make,
    };

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

    editFn(obj)
      .unwrap()
      .then(() => {
        setEditAlert(true);
        setSelected([]);
      })
      .catch((error) => {
        setErrorAlert(true);
        setErrorMsg(error.data.msg);
      });
    cancelEditModal();
  };

  const cancelAddModal = () => {
    setAddCarModal(false);
    setSelected([]);
  };

  const changeGroupValue = (e, newValue) => {
    setAddGroupValue(newValue.value);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const obj = {
      name: data.get("Name"),
      color: data.get("Color"),
      model: data.get("Model"),
      registrationNumber: data.get("registrationNumber"),
      make: data.get("Make"),
      categories: addGroupValue,
    };

    let validationSuccessful = true;

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

    addFn(obj)
      .unwrap()
      .then(() => setAddAlert(true))
      .catch((error) => {
        setErrorAlert(true);
        setErrorMsg(error.data.msg);
      });
    cancelAddModal();
  };

  return (
    <>
      <Snackbar
        open={deleteAlert}
        onClose={() => setDeleteAlert(false)}
        severity="success"
        message="Car Deleted"
      />

      <Snackbar
        open={addAlert}
        onClose={() => setAddAlert(false)}
        severity="success"
        message="Car Added"
      />
      <Snackbar
        open={editAlert}
        onClose={() => setEditAlert(false)}
        severity="success"
        message="Car Updated"
      />

      <Snackbar
        open={errorAlert}
        onClose={() => setErrorAlert(false)}
        severity="error"
        message={errorMsg}
      />

      <Modal
        open={carEditModal}
        onClose={cancelEditModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
      >
        <Fade in={carEditModal}>
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
              height: "500px",
              bgcolor: "white",
              boxShadow: 24,
              p: 4,
              borderRadius: 10,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Update Car
            </Typography>
            <TextField
              placeholder="Name"
              name="Name"
              fullWidth
              value={carToEdit.name}
              onChange={(event) => {
                setCarToEdit((prevCarToEdit) => ({
                  ...prevCarToEdit,
                  name: event.target.value,
                }));
              }}
              sx={{ mb: 2 }}
            />
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={groupsConst}
              sx={{ width: "100%", mb: 2 }}
              value={getName()}
              onChange={handleAutoChange}
              renderInput={(params) => (
                <TextField {...params} label="Categories" />
              )}
            />
            <TextField
              placeholder="Color"
              name="Color"
              fullWidth
              value={carToEdit.color || ""}
              onChange={(event) => {
                setCarToEdit((prevCarToEdit) => ({
                  ...prevCarToEdit,
                  color: event.target.value,
                }));
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              placeholder="Model"
              name="Model"
              fullWidth
              value={carToEdit.model}
              onChange={(event) => {
                setCarToEdit((prevCarToEdit) => ({
                  ...prevCarToEdit,
                  model: event.target.value,
                }));
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              placeholder="Make"
              name="Make"
              fullWidth
              value={carToEdit.make}
              onChange={(event) => {
                setCarToEdit((prevCarToEdit) => ({
                  ...prevCarToEdit,
                  make: event.target.value,
                }));
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              placeholder="Registeration Number"
              name="registrationNumber"
              fullWidth
              value={carToEdit.registrationNumber}
              onChange={(event) => {
                setCarToEdit((prevCarToEdit) => ({
                  ...prevCarToEdit,
                  registrationNumber: event.target.value,
                }));
              }}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="contained" type="submit" sx={{ mr: 2 }}>
                Update
              </Button>
              <Button variant="outlined" onClick={cancelEditModal}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Modal
        open={addCarModal}
        onClose={cancelAddModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
      >
        <Fade in={addCarModal}>
          <Box
            component="form"
            noValidate
            onSubmit={handleAddSubmit}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "600px",
              height: "500px",
              bgcolor: "white",
              boxShadow: 24,
              p: 4,
              borderRadius: 10,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Add Car
            </Typography>
            <TextField
              placeholder="Name"
              name="Name"
              fullWidth
              sx={{ mb: 2 }}
            />
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={groupsConst}
              value={addGroupValue}
              onChange={changeGroupValue}
              sx={{ width: "100%", mb: 2 }}
              renderInput={(params) => (
                <TextField {...params} label="Categories" />
              )}
            />
            <TextField
              placeholder="Color"
              name="Color"
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              placeholder="Model"
              name="Model"
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              placeholder="Make"
              name="Make"
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              placeholder="Registeration Number"
              name="registrationNumber"
              fullWidth
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="contained" type="submit" sx={{ mr: 2 }}>
                Add
              </Button>
              <Button variant="outlined" onClick={cancelAddModal}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Cars
          </Typography>
        )}

        {numSelected > 0 ? (
          <>
            <Tooltip title="Edit">
              <IconButton onClick={(event) => handleEditClick(event)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={handleDeleteClick}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <ColorButton
            style={{
              backgroundColor: "#008AD2",
              borderRadius: "10px",
              margin: "0px 0px 0px 20px",
            }}
            onClick={() => setAddCarModal(true)}
          >
            <Typography sx={{ color: "#FFFFFF" }}>ADD</Typography>
          </ColorButton>
        )}
      </Toolbar>
    </>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [rows, setRows] = useState([]);
  const { data, isLoading } = useGetQuery();

  React.useEffect(() => {
    if (isLoading === false && data) {
      const array = [];
      data.map((car) => {
        array.push(car);
      });
      setRows([...array]);
    }
  }, [isLoading, data]);

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { data: categories } = Categories();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = stableSort(rows, getComparator(order, orderBy)).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          setSelected={setSelected}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row._id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {categories?.map((category) => {
                        console.log(row.categories)
                        if (category._id == row.categories) {
                          return category.name;
                        }
                      })}
                    </TableCell>
                    <TableCell align="right">{row.color}</TableCell>
                    <TableCell align="right">{row.make}</TableCell>
                    <TableCell align="right">{row.model}</TableCell>
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell align="right">
                      {row.registrationNumber}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
