import React from "react";
import { Box, CircularProgress } from "@mui/material";
import MealList from "./MealList";
import NearestDatesCard from "./NearestDatesCard";

export default function CardContainer({ meals, loading, nearestPastDate, nearestFutureDate, handleDateSelect }) {
  return (
    <Box sx={{ my: 4, width: "100%", pt: 8 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : meals.length > 0 ? (
        <MealList meals={meals} />
      ) : (
        <NearestDatesCard
          pastDate={nearestPastDate}
          futureDate={nearestFutureDate}
          onDateSelect={handleDateSelect}
        />
      )}
    </Box>
  );
}
