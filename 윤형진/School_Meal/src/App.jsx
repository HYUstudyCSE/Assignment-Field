import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Box } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { ko } from "date-fns/locale";
import DateSelector from "./DateSelector";
import AppBarHeader from "./AppBarHeader";
import CardContainer from "./CardContainer";
import { findNearestDates } from "./findingDates";

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nearestPastDate, setNearestPastDate] = useState(null);
  const [nearestFutureDate, setNearestFutureDate] = useState(null);
  const API_KEY = "d643b90e054b4ebab9e1ce4809ca5cab";

  const fetchData = async (formattedDate) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=I10&SD_SCHUL_CODE=9300181&MLSV_YMD=${formattedDate}&Type=json&KEY=${API_KEY}`
      );
      if (response.data.mealServiceDietInfo && response.data.mealServiceDietInfo[1]) {
        const mealData = response.data.mealServiceDietInfo[1].row;
        setMeals(mealData);
        setNearestPastDate(null);
        setNearestFutureDate(null);
      } else {
        setMeals([]);
        const { pastDate, futureDate } = await findNearestDates(formattedDate);
        setNearestPastDate(pastDate);
        setNearestFutureDate(futureDate);
      }
    } catch (error) {
      console.error("Failed to fetch meals:", error);
      setMeals([]);
      const { pastDate, futureDate } = await findNearestDates(formattedDate);
      setNearestPastDate(pastDate);
      setNearestFutureDate(futureDate);
    } finally {
      setLoading(false);
    }
  };

  const updateDate = (newDate) => {
    setSelectedDate(newDate);
  };

  useEffect(() => {
    const formattedDate = `${selectedDate.getFullYear()}${(selectedDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${selectedDate.getDate().toString().padStart(2, "0")}`;
    fetchData(formattedDate);
  }, [selectedDate]);

  const handleDateSelect = (dateStr) => {
    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10) - 1; // 월은 0부터 시작
    const day = parseInt(dateStr.substring(6, 8), 10);
    setSelectedDate(new Date(year, month, day));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
      <AppBarHeader />
      <Box sx={{ position: 'fixed', top: 64, width: '100%', zIndex: 10, backgroundColor: 'white', padding: 2 }}>
        <DateSelector selectedDate={selectedDate} updateDate={updateDate} />
      </Box>
      <Container sx={{ maxWidth: "100%", mt: 12 }}>
        <CardContainer
          meals={meals}
          loading={loading}
          nearestPastDate={nearestPastDate}
          nearestFutureDate={nearestFutureDate}
          handleDateSelect={handleDateSelect}
        />
      </Container>
    </LocalizationProvider>
  );
}
