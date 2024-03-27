import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { jwtDecode } from 'jwt-decode';
import { FaGithub } from 'react-icons/fa';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [submittedAutomatically, setSubmittedAutomatically] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const GITHUB_CLIENT_ID = "031e7a3dffa1598e1d7f";

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwtDecode(response.credential);
    console.log(userObject);
    // Show loading before navigating to the profile page
    navigate('/loading');
    // Simulate loading with a timeout
    setTimeout(() => {
      navigate('/dashboard/profile');
    }, 2000);
  }

  useEffect(() => {
    /*global google*/
    google.accounts.id.initialize({
      client_id: "551424376539-utblai5fvatj1929pov7qicdqruoeju2.apps.googleusercontent.com",
      callback: handleCallbackResponse
    })

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );
  }, []);

  useEffect(() => {
    let timeout;
    if (email !== '' && password !== '') {
      timeout = setTimeout(() => {
        setSubmittedAutomatically(true);
        handleSignIn();
      }, 2600);
    }

    return () => clearTimeout(timeout);
  }, [email, password]);


  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://localhost:3000/users/login', {
        email,
        password,
      });
  
      console.log('SignIn response:', response.data);
     const token = response.data.token;
  
      // Inclure le token JWT dans le header de la requête axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
      localStorage.setItem('token', token);
  
      if (response.data.role === 'admin') {
        navigate('/dashboard/home');
      } else {
        navigate('/dashboard/profile');
      }
   
    } catch (error) {
      console.error('SignIn error:', error);
    }
  }
  

  function loginWithGithub() {
    window.location.assign("http://github.com/login/oauth/authorize?client_id=" + GITHUB_CLIENT_ID)
  }

  const onChange = () => {};
  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); }} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between gap-2 mt-6">
            <Typography variant="small" className="font-medium text-gray-900">
              <Link to="/auth/forgot-password">Forgot Password?</Link>
            </Typography>
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center justify-start font-medium"
                >
                  Remember me
                </Typography>
              }
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              containerProps={{ className: "-ml-2.5" }}
            />
          </div>

          <div className="flex flex-col items-center justify-center mt-6 w-full max-w-md">
            {/* Ajouter le ReCAPTCHA ici */}
            <ReCAPTCHA sitekey="6LfoFZMpAAAAAEOmkOCNdG8wXsu5FL2dCFhlQem8" onChange={onChange} />
          </div>

          <div className="flex justify-center mt-6 w-full max-w-md">
            <div id='signInDiv'>
              {/* Contenu de signInDiv */}
            </div>
          </div>

          <div className="flex justify-center mt-6 w-full max-w-md">
            <button onClick={loginWithGithub} className="bg-gray-900 text-white flex items-center justify-center space-x-2 p-2 rounded-md w-full">
              <FaGithub /> {/* Icône de GitHub */}
              <span>Login with Github</span>
            </button>
          </div>

          <Button type="submit" className="mt-6 w-full" fullWidth style={submittedAutomatically ? { backgroundColor: 'gray', cursor: 'not-allowed' } : {}}>
            {submittedAutomatically ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
          Not registered?
          <Link to="/auth/sign-up" className="text-gray-900 ml-1">Create account</Link>
        </Typography>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
          alt="Pattern"
        />
      </div>
    </section>
  );
}

export default SignIn;
