import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Grid, Checkbox } from '@mui/material';
import '../CSS/Login.css';
import axios from "axios";
import Toaster from "../../Common/Toaster/Toaster";
import { useNavigate } from "react-router-dom";
import { ReactComponent as GoogleIcon } from '../../Common/Assets/google.svg';
import { ReactComponent as FacebookIcon } from '../../Common/Assets/facebook.svg';
import { ReactComponent as InstagramIcon } from '../../Common/Assets/instagram.svg';
import { ReactComponent as AppleIcon } from '../../Common/Assets/apple-logo.svg'
import { ReactComponent as SmileyIcon } from '../../Common/Assets/smiley.svg';
import { useSelector, useDispatch } from 'react-redux';
import { updateLoginToken } from "../../Redux/actions";
const Login = () => {
  const url = process.env.REACT_APP_LOGIN_URL;
  const googleUrl = process.env.REACT_APP_GOOGLE_URL;
  const facebookUrl = process.env.REACT_APP_FACEBOOK_URL;
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [logInit, setLogInit] = useState(false);
  const [appleInit, setAppleInit] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    rememberMe: false
  });
  const params = {
    password: formData.password
  }
  const loginToken = useSelector((state) => state.loginToken);
  const dispatch = useDispatch();


  useEffect(() => {
    const fun = async () => {
      if (window.location.hash) {
        const urlParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = urlParams.get('access_token');
        const idToken = urlParams.get('id_token');
        dispatch({ type: 'UPDATE_LOGIN_TOKEN', payload: accessToken });
        const googleLogin = await googleApi(idToken);
        console.log("login", googleLogin);
        const fullName = await googleLogin.data.name1;
        const firstName = fullName.split(' ')[0];
        dispatch({ type: 'UPDATE_IS_OWNER', payload: googleLogin.data.isOwner});
        dispatch({type: 'UPDATE_USER', payload: googleLogin.data});
        if(googleLogin.data.isOwner){
          console.log("fb", fullName);
          // await localStorage.setItem('ownerName', fullName).then((value) => console.log("data Saved", value)).catch((err) => console.log("error", err))
          try {
            localStorage.setItem('ownerName', fullName);
            console.log("data saves", fullName);
          } catch (error) {
            console.log("error", error);
          }
        }
        setMessage(
          <div>
            <span>Welcome Back {firstName}...!!! Have a Nice Day  <SmileyIcon className="smiley" /></span>
          </div>
        );
        setTimeout(() => {
          navigate('/city')
        }, 6000);
        window.location.hash = '';
      }
    }
    fun();
  }, []);
  useEffect(() => {
    const loadFacebookSDK = () => {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: '996296225146506',
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v10.0',
        });
      };
      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    };
    loadFacebookSDK();
  }, []);

  useEffect(() => {
    if (logInit) {
      const handleSubmit = async (e) => {
        try {
          const login = await callApi(formData.userId);
          console.log("log", login);
          dispatch({ type: 'UPDATE_LOGIN_TOKEN', payload: login.token });
          dispatch({type: 'UPDATE_USER', payload: login});
          const fullName = await login.Name;
          const firstName = fullName.split(' ')[0];
          if(login.isOwner){
            await localStorage.setItem('ownerName', fullName);
          }
          dispatch({ type: 'UPDATE_IS_OWNER', payload: login.isOwner});
          setMessage(
            <div>
              <span>Welcome Back {firstName}...!!! Have a Nice Day  <SmileyIcon className="smiley" /></span>
            </div>
          );
          setTimeout(() => {
            navigate('/city')
          }, 6000);
        } catch (error) {
          console.log("error", error);
        }
      }
      handleSubmit();
    }
  }, [logInit]);


  useEffect(() => {
    if (appleInit) {
      console.log("Apple")
    }
  }, [appleInit])

  const googleApi = async (gToken) => {
    try {
      const response = await axios.get(googleUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        params: {
          token: gToken
        }
      });
      console.log("google", response)
      return response;
    } catch (error) {
      console.log("Error", error);
    }
  }
  const facebookApi = async (userId) => {
    try {
      const response = await axios.get(facebookUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        params: {
          email: userId
        }
      })
      return response;
    } catch (error) {
      console.log("error", error);
    }
  }
  const callApi = async (userId) => {
    try {
      const response = await axios.post(url + `${userId}?password=${formData.password}`, null, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  }
  const responseGoogle = async () => {
    const clientId = '578349732074-ddo6roou2d4o05trh2ajmevnngudc39n.apps.googleusercontent.com';
    const redirectUri = 'http://localhost:3000/login';
    const scope = 'openid profile email';
    const responseType = 'id_token token';
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;
    window.location.href = authUrl;
  }

  const handleFacebookLogin = () => {
    window.FB.login(function (response) {
      if (response.status === 'connected') {
        const fbToken = response.authResponse.accessToken;
        dispatch({ type: 'UPDATE_LOGIN_TOKEN', payload: fbToken });
        window.FB.api('/me?fields=email', async function (userResponse) {
          const emailId = userResponse.email;
          const fbResponse = await facebookApi(emailId);
          const fullName = fbResponse.data.name1;
          const firstName = fullName.split(' ')[0];
        dispatch({ type: 'UPDATE_IS_OWNER', payload: fbResponse.data.isOwner});
        dispatch({type: 'UPDATE_USER', payload: fbResponse.data});
        if(fbResponse.data.isOwner){
          await localStorage.setItem('ownerName', fullName).then((value) => console.log("data Saved", value)).catch((err) => console.log("error", err))
        }
          setMessage(
            <div>
              <span>Welcome Back {firstName}...!!! Have a Nice Day  <SmileyIcon className="smiley" /></span>
            </div>
          );
          setTimeout(() => {
            navigate('/city')
          }, 6000);
        });
      }
    }, { scope: 'public_profile,email' });
  };
const forgetPassword = () => {
  navigate('/forget-password');
}


  return (
    <div className="x">
      <div className="y">
        <Typography variant="h3" align="center" gutterBottom>Welcome...!!!</Typography>
      </div>
      <Grid className="z">
        <Typography variant="h5" align="center" gutterBottom>LOGIN</Typography>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="UserId" variant="outlined" fullWidth name="userId" value={formData.userId} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Password" variant="outlined" type="password" fullWidth name="password" value={formData.password} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <Checkbox
                variant="outlined" fullWidth name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />Remember Me
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth onClick={() => setLogInit(true)} variant="contained">LOGIN</Button>
            </Grid>
            <Grid container justifyContent="center" className="forgot-password-container">
            <a href="" className="forgot-password-link" onClick={forgetPassword}>
             Forget Password ?
            </a>
            </Grid>


            <Grid className="v">
            <Grid container alignItems="center" justifyContent="center" className="or-divider">
              <hr className="t" />
              <span className="or-text"> OR </span>
               <hr className="t" />
            </Grid>

              <div className="icon">
                <div>
                  <a href="#" onClick={handleFacebookLogin} target="_blank" rel="noopener noreferrer">
                    <FacebookIcon className="social-icon" />    </a>
                </div>

                <div style={{ 'margin-left': '30px', 'marginRight': '30px' }}>
                  <a href="javascript:void(0)" onClick={responseGoogle} target="_blank" rel="noopener noreferrer">
                    <GoogleIcon className="social-icon" />
                  </a>
                </div>
                <div>
                  <a href="#" rel="noopener noreferrer">
                    <AppleIcon className="social-icon" /></a>
                </div>
              </div>
              <Grid><span>Don't Have Account yet ? <a href="/register">Sign Up</a> here </span></Grid>
            </Grid>
            <Toaster message={message} />
          </Grid>
        </form>
      </Grid>
    </div>
  )
}
export default Login;