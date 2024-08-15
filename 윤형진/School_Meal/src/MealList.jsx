import React, { useState } from "react";
import { Grid, Card, CardContent, Typography, IconButton, Collapse, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const MealList = ({ meals }) => {
  const [expanded, setExpanded] = useState(null);

  const handleExpandClick = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 1200 }}>
        {meals.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No meals available for the selected date.
          </Typography>
        ) : (
          meals.map((meal, index) => (
            <Grid item xs={12} sm={6} md={4} key={meal.MLSV_YMD + index} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ border: '1px solid #ddd', borderRadius: '8px', width: '100%', maxWidth: 345 }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">{meal.MMEAL_SC_NM}</Typography>
                    <Typography
                      variant="body2"
                      dangerouslySetInnerHTML={{
                        __html: meal.DDISH_NM.replace(/<br\/>/g, "<br />"),
                      }}
                    />
                  </Box>
                  <IconButton
                    onClick={() => handleExpandClick(index)}
                    aria-expanded={expanded === index}
                    aria-label="show more"
                    sx={{ color: 'inherit' }}
                  >
                    {expanded === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </CardContent>
                <Collapse in={expanded === index} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography variant="body2" dangerouslySetInnerHTML={{ __html: meal.NTR_INFO.replace(/<br\/>/g, "<br />") }} />
                    <Typography variant="body2" sx={{ mt: 1 }}>칼로리: {meal.CAL_INFO}</Typography>
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default MealList;
