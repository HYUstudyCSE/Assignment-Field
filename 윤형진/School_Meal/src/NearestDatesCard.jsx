import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

const formatDateString = (dateStr) => {
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${year}년 ${month}월 ${day}일`;
};

export default function NearestDatesCard ({ pastDate, futureDate, onDateSelect }) {
    return ( 
    <Card sx={{ background: "#f8d7da", color: "#721c24", borderColor: "#f5c6cb", mt: 4, width: '100%' }}>
    <CardContent sx={{ textAlign: 'center' }}>
      <Typography variant="h7" sx={{ fontWeight: 'bold' }}>선택하신 날짜의 식단이 존재하지 않습니다.</Typography>
      <Box sx={{ mt: 2 }}>
        {pastDate && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2">
              급식이 제공되는 가장 가까운 과거: {formatDateString(pastDate)}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => onDateSelect(pastDate)}
              sx={{ mt: 1 }}
            >
              과거 날짜로 이동
            </Button>
          </Box>
        )}
        {futureDate && (
          <Box>
            <Typography variant="body2">
            급식이 제공되는 가장 가까운 미래: {formatDateString(futureDate)}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => onDateSelect(futureDate)}
              sx={{ mt: 1 }}
            >
              미래 날짜로 이동
            </Button>
          </Box>
        )}
      </Box>
    </CardContent>
  </Card>
  );
}
