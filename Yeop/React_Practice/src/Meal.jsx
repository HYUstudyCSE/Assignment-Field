import { useState, useEffect } from "react";

export default function Meal(){
    const [data, setData] = useState({});

    const APIkey = "24c891ef0d014c96a7e69394fa706802";
    const ATPT_OFCDC_SC_CODE = "G10";
    const SD_SCHUL_CODE = "7430032";
    const date = new Date();
    const MLSV_YMD = `${date.getFullYear()}${(date.getMonth()+1)}${date.getDate()}`;

    const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}&MLSV_YMD=20240728`;

    useEffect(() => {
        async function fetchData(){
            const res = (await fetch(url)).json();
            setData(res);
            console.log(res);
        }
    }, []);

    return (
        <div className="Meal">
            <h1>{MLSV_YMD}</h1>
            <h2>T</h2>
        </div>
    )
}