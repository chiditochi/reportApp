import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

import Config from "../../services/config";
import Utility from "../../services/utility";
import SubHeader from "../App/SubHeader";

const useStyles = makeStyles({
  root: {
    width: "inherit",
  },
  container: {
    maxHeight: "75vh",
    overflowY: "scroll",
  },
});

export default function StickyHeadTable({
  records,
  handleSetters,
  selectedDate,
  selectedBank,
  useStorage,
  bankData,
  infoMessage,
  setInfoMessage,
  sessionName,
}) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const tableRecords = (records) => {
    //setInfoMessage('Daily Transfer')
    const data = records.reduce((a, c, i) => {
      const index = i + 1;
      let {
        requestid,
        requesttime,
        sourcebank,
        destbank,
        route,
        accountno,
        amount,
        remark,
        responsetime,
        statuscode,
        statusmessage,
        approved,
        requerycount,
        reversed,
        reversible,
        reference,
      } = c;
      //format data here
      requesttime = requesttime && Utility.formatDate(requesttime);
      responsetime = responsetime && Utility.formatDate(responsetime);
      amount = amount && Utility.formatCurrency(amount);
      approved = approved ? "true" : "false";
      reversed = approved ? "true" : "false";
      reversible = approved ? "true" : "false";
      a.push({
        index,
        requestid,
        requesttime,
        sourcebank,
        destbank,
        route,
        accountno,
        amount,
        remark,
        responsetime,
        statuscode,
        statusmessage,
        approved,
        requerycount,
        reversed,
        reversible,
        reference,
      });
      return a;
    }, []);

    return data;
  };
  const tableHeaders = () => {
    const list = [
      {
        uid: "index",
        label: "#",
        minWidth: 10,
      },
    ];
    const fields = Config.transferFields;
    const field = Config.tranferColumn;
    fields.forEach((v) => {
      let f = { ...field };
      f.uid = v;
      f.label = Utility.capitalize(v);
      list.push(f);
    });
    return list;
  };

  const columns = tableHeaders();
  const rows = tableRecords(records);
  //console.log("selectedDate in : TransferTable component: ", selectedDate);

  return (
    <Paper className={classes.root}>
      <SubHeader
        showBanks={true}
        bankData={bankData}
        showCalendar={true}
        infoMessage={infoMessage}
        setInfoMessage={setInfoMessage}
        handleSetters={handleSetters}
        useStorage={useStorage}
        selectedBank={selectedBank}
        sessionName={sessionName}
        targetDate={selectedDate}
      />
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.uid}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.index}>
                    {columns.map((column, i) => {
                      const value = row[column.uid];
                      return (
                        <TableCell key={column.uid} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
