import axios from "axios";

const API_KEY = "d643b90e054b4ebab9e1ce4809ca5cab";

const findNearestDates = async (formattedDate) => {
  const pastDate = await findNearestDate(formattedDate, "past");
  const futureDate = await findNearestDate(formattedDate, "future");
  return { pastDate, futureDate };
};

const findNearestDate = async (formattedDate, direction) => {
  const currentDate = new Date(
    `${formattedDate.substring(0, 4)}-${formattedDate.substring(4, 6)}-${formattedDate.substring(6, 8)}`
  );

  let startDate, endDate;

  if (direction === "past") {
    startDate = new Date(currentDate);
    startDate.setMonth(startDate.getMonth() - 1);
    endDate = new Date(currentDate);
  } else {
    startDate = new Date(currentDate);
    endDate = new Date(currentDate);
    endDate.setMonth(endDate.getMonth() + 1);
  }

  startDate = new Date(startDate);
  endDate = new Date(endDate);

  const formattedStartDate = `${startDate.getFullYear()}${(startDate.getMonth() + 1).toString().padStart(2, "0")}${startDate.getDate().toString().padStart(2, "0")}`;
  const formattedEndDate = `${endDate.getFullYear()}${(endDate.getMonth() + 1).toString().padStart(2, "0")}${endDate.getDate().toString().padStart(2, "0")}`;

  try {
    const response = await axios.get(
      `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=I10&SD_SCHUL_CODE=9300181&MLSV_FROM_YMD=${formattedStartDate}&MLSV_TO_YMD=${formattedEndDate}&Type=json&KEY=${API_KEY}`
    );
    if (response.data.mealServiceDietInfo && response.data.mealServiceDietInfo[1]) {
      const mealData = response.data.mealServiceDietInfo[1].row;
      if (direction === "past") return mealData[mealData.length - 1].MLSV_YMD;
      else return mealData[0].MLSV_YMD;
    }
  } catch (error) {
    console.error("Failed to fetch meals:", error);
  }
  return null;
};

export { findNearestDates, findNearestDate };
