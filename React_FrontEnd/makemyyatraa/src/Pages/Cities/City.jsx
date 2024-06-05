import axios from "axios";
import React, { useEffect, useState } from "react";
import Cards from "../../Common/Cards/Cards";
import { Typography, TextField, Button, Grid, Checkbox } from '@mui/material';
import '../CSS/City.css';
import { useNavigate } from "react-router-dom";
import CityCards from "../../Common/Cards/City-Cards";
const City = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
    const cityUrl = process.env.REACT_APP_GET_ALL_CITIES_URL;
    const callApi = async () => {
        try {
        const response = await axios.get(cityUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        setData(response.data);
        data.forEach((e) => {
            console.log("e", e.cityName);
        })
        return response;
    } catch(error) {
        console.log("Error", error);
    }
    }
    callApi();
}, []);
const hotelsByCity = (e) => {
    localStorage.setItem("cityName", e.cityName);
console.log("e", e.cityName);
navigate("/city-hotels")
}
    return(
        <Grid>
        <Typography variant="h5" align="center" gutterBottom>Trending Destinations In India...</Typography>
        <div className="card-container">
            {data.map((item, index) => (
                <div key={index} onClick={(e) => hotelsByCity(item)}>
                    <CityCards title={item.cityName} imgUrl={item.cityImage} disc={item.state} />
                </div>
            ))}
        </div>
        </Grid>
    )
}
export default City;