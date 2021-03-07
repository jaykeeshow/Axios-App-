import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Checkbox from "@material-ui/core/Checkbox";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const App = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState([]); //init array of bool in app state

  const getUserData = async () => {
    try {
      const data = await axios.get(
        "https://teacode-recruitment-challenge.s3.eu-central-1.amazonaws.com/users.json"
      );
      console.log(data.data);
      //after retrieving users
      let checkedCB = [];
      for (let i = 0; i < users.length; i++) checkedCB[i] = false; //<- at default all checkBoxes unselected.
      setChecked(checkedCB);

      setUsers(data.data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  const handleRowClick = (userId) => {
    let checkedRes = checked;
    checkedRes[userId] = !checkedRes[userId];
    console.log(userId); //->display user.id
    setChecked(checkedRes); // toggle checkBox
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="App">
      <input
        type="text"
        placeholder="search here..."
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <TableContainer component={Paper} justify="center">
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow></TableRow>
          </TableHead>
          <TableBody>
            {users
              .sort(function (a, b) {
                if (a.last_name < b.last_name) {
                  return -1;
                }
                if (a.last_name > b.last_name) {
                  return 1;
                }
                return 0;
              })
              .filter((user) => {
                if (search == "") {
                  return user;
                } else if (
                  user.first_name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  user.last_name.toLowerCase().includes(search.toLowerCase())
                ) {
                  return user;
                }
              })
              .map((user) => {
                return (
                  <StyledTableRow
                    onSubmit={(e) => handleSubmit}
                    key={user.id}
                    onClick={() => {
                      handleRowClick(user.id); ///this will change checkbox value
                    }}
                  >
                    <StyledTableCell component="th" scope="row" align="left">
                      <Avatar>{user.avatar}</Avatar>
                    </StyledTableCell>
                    <StyledTableCell>
                      {user.first_name} {user.last_name}{" "}
                    </StyledTableCell>
                    <StyledTableCell>
                    {checked[user.id] ? user.email : ""}
                    </StyledTableCell>
                    <Checkbox
                      checked={checked[user.id]} //asking checked[user.id] to checkbox checked prop
                    />
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default App;
