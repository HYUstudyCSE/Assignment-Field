import React, { useState } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function DateSelector({ selectedDate, updateDate }) {
  const [open, setOpen] = useState(false);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();

  const years = Array.from(
    new Array(10),
    (val, index) => new Date().getFullYear() - index
  );
  const months = Array.from({ length: 12 }, (v, k) => k + 1);
  const days = Array.from({ length: 31 }, (v, k) => k + 1);

  const handleCalendarChange = (date) => {
    updateDate(date);
    setOpen(false);
  };

  const dateComponents = [
    {
      label: "Year",
      value: year,
      onChange: (e) => {
        const newDate = new Date(e.target.value, month - 1, day);
        updateDate(newDate);
      },
      options: years,
    },
    {
      label: "Month",
      value: month,
      onChange: (e) => {
        const newDate = new Date(year, e.target.value - 1, day);
        updateDate(newDate);
      },
      options: months,
    },
    {
      label: "Day",
      value: day,
      onChange: (e) => {
        const newDate = new Date(year, month - 1, e.target.value);
        updateDate(newDate);
      },
      options: days,
    },
  ];

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        {dateComponents.map((component) => (
          <Grid item key={component.label}>
            <FormControl variant="outlined" sx={{ minWidth: 80 }}>
              <InputLabel id={`${component.label}-label`}>
                {component.label}
              </InputLabel>
              <Select
                labelId={`${component.label}-label`}
                value={component.value}
                onChange={component.onChange}
                label={component.label}
              >
                {component.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.toString().padStart(2, "0")}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}
        <Grid item>
          <div>
            <IconButton color="inherit" onClick={() => setOpen(true)}>
              <CalendarTodayIcon />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>날짜 선택</DialogTitle>
        <DialogContent>
          <DateCalendar value={selectedDate} onChange={handleCalendarChange} />
        </DialogContent>
      </Dialog>
    </>
  );
};
