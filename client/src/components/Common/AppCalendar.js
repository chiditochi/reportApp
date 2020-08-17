import "date-fns";
import React from "react";
import Grid from "@material-ui/core/Grid";
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
// import Utility from '../../services/utility'

export function CalendarUIPicker({
  handleCalendarChange,
  fieldSetter,
  targetDate,
}) {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  //console.log("selectedDate in : CalendarUIPicker component: ", targetDate);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const d = targetDate
      ? targetDate
      : `${date.year()}-${(date.month() + 1)
          .toString()
          .padStart(2, "0")}-${date.date().toString().padStart(2, "0")}`;
    //console.log('Calendar date: ', d)
    fieldSetter(d);
  };

  const chosenDate = targetDate ? targetDate : selectedDate;

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <KeyboardDatePicker
        style={{ margin: 0, color: "white" }}
        margin="normal"
        id="date-picker-dialog"
        label="Pick day"
        format="DD/MM/YYYY"
        value={chosenDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />
    </MuiPickersUtilsProvider>
  );
}

export function TimeUIPicker() {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      {/* <Grid container justify="space-around"> */}
      <KeyboardTimePicker
        margin="normal"
        id="time-picker"
        label="Time picker"
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change time",
        }}
      />
      {/* </Grid> */}
    </MuiPickersUtilsProvider>
  );
}

export default function MaterialUIPickers() {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/DD/YYYY"
          margin="normal"
          id="date-picker-inline"
          label="Date picker inline"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Date picker dialog"
          format="MM/DD/YYYY"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
        <KeyboardTimePicker
          margin="normal"
          id="time-picker"
          label="Time picker"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change time",
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
