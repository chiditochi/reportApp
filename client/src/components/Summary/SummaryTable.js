import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// import Config from '../../services/config';
// import Utility from '../../services/utility';
// import SubHeader from '../App/SubHeader';


const useStyles = makeStyles({
  root: {
    width: 'inherit',
    margin: '0 10'
  },
  container: {
    maxHeight: '75vh',
    overflowY: 'scroll'
  },
});



export default function QueryResultTable( { 
  queryResult, records, columns  }) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
//console.log('queryResult: ', records, columns )
  
  

// const columns = tableHeaders()
const rows = records || []

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
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
            {rows.map(row => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.index}>
                  {columns.map((column, i)=> {
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
    </Paper>
  );
}
