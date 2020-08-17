import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


//import Config from '../../services/config';
import Utility from '../../services/utility';

const useStyles = makeStyles(theme => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 600,
      margin: 'auto'
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    dividerH: {
      height: 20,
      margin: 4,
    },
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
      },
      formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        marginRight: 10
      },
  }));

function QueryForm({ callQueryHandler }) {
const classes = useStyles();

  //const [infoMessage, setInfoMessage] = React.useState("Query Page")
  const idOptions = Utility.getQueryIDOptions();
  const defaultOption = idOptions[0];
  const [searchDetail, setSearchDetail]= React.useState({ type: defaultOption.value, searchID: ''})
  const [selectedIDType, setSelectedIDType] = React.useState(defaultOption);
  const [open, setOpen] = React.useState(false);



  const handleChange = event => {
      const val = event.target.value
      const selected = idOptions.find(x=>x.value ===val)
      console.log(val,idOptions.find(x=>x.value ===event.target.value))
    setSelectedIDType(selected);
    setSearchDetail(e=>setSearchDetail(c=>({ ...c, type: val})))
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleInputChange = (event)=>{
    event.preventDefault();
    console.log('Text: ', searchDetail)
    searchDetail.searchID && searchDetail.searchID.length && callQueryHandler(searchDetail)
    //setSearchID(s)
  }

  return (
      <div style={{ padding: '0 10'}}>
    <Paper component="form" className={classes.root}>
    <FormControl className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label">ID Type</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={searchDetail && searchDetail.type}
          onChange={handleChange}
        >
          <MenuItem selected value={'requestid'}>Request ID</MenuItem>
          <MenuItem value={'reference'}>Reference</MenuItem>
        </Select>
      </FormControl>
    <Divider className={classes.divider} orientation="vertical" />

      <InputBase
        className={classes.input}
        placeholder="Enter requestid or reference"
        inputProps={{ 'aria-label': 'search google maps' }} 
        onChange={e=>setSearchDetail(c=>({ ...c, searchID: e && e.target && e.target.value}))}
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search" onClick={handleInputChange}>
        <SearchIcon />
      </IconButton>
    </Paper>
      <Divider className={classes.dividerH} orientation="horizontal" />
    </div>
  );
}

export default QueryForm;
