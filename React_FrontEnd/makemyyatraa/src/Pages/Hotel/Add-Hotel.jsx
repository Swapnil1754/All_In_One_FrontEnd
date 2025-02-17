// AddHotelForm.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Paper, InputLabel, FormControl, Input } from '@mui/material';
import { css } from '@emotion/react';
import {
  containerStyles,
  paperStyles,
  inputStyles,
  buttonStyles,
  formStyles,
} from '../CSS/AddHotelForm.styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddHotelForm = () => {
  const navigate = useNavigate();
    const [formData, setFormData] = useState({
        ownerName: '',
        hotelName: '',
        rating: '',
        city: '',
        rooms: [],
      });
      const [imgData1, setImgData1] = useState([]);
      const url = process.env.REACT_APP_ADD_HOTEL_URL;
      
      const handleChange = (event) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value,
        });
      };
      const form = new FormData();
      const handleSubmit = async (event) => {
        event.preventDefault();
        if(imgData1) {
        form.append('file', imgData1);
        form.append('data', JSON.stringify(formData));
          const responseData = await callApi(form);
          navigate('/add-room');
      } else {
        console.log("Error found...")
      }
    }
      
      const callApi = async (data) => {
        
        try {
          await axios.post(url, data, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }).then(async (response) => {
            console.log("call", response.data.registrationId);
            localStorage.setItem('registrationId', response.data.registrationId);
            return response;
          })
        } catch (error) {
          console.log("Error", error);
        }
      };
      
      const imageLoader = (e) => {
        const imgData = e.target.files[0];
       return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        reader.onerror = (err) => {
            reject(err)
        };
        reader.readAsDataURL(imgData);
       setImgData1(imgData)
      
      })
    }
    useEffect(() => {
      const getOwnerName = async () => {
       const value = localStorage.getItem('ownerName');
       if(value) {
          setFormData({...formData,
          ownerName: value});
       }
      }
      getOwnerName();
    }, [])
      

  return (
    <Container maxWidth="sm">
      <Paper elevation={3}>
        <Typography variant="h4" align="center" gutterBottom>
          Add New Hotel
        </Typography>
        <form onSubmit={handleSubmit} css={formStyles}>
          <TextField
            label="Owner Name"
            variant="outlined"
            fullWidth
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            css={inputStyles}
          />
          <TextField
            label="Hotel Name"
            variant="outlined"
            fullWidth
            name="hotelName"
            value={formData.hotelName}
            onChange={handleChange}
            css={inputStyles}
          />
          <TextField
            label="Ratings"
            variant="outlined"
            fullWidth
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            css={inputStyles}
          />
          <TextField
            label="City"
            variant="outlined"
            fullWidth
            name="city"
            value={formData.city}
            onChange={handleChange}
            css={inputStyles}
          />
          <FormControl fullWidth css={inputStyles}>
            {/* <InputLabel>Upload Image</InputLabel> */}
            <Input type="file" fullWidth  onChange={(e) => imageLoader(e)}/>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            css={buttonStyles}
          >
            Add New Hotel
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddHotelForm;
