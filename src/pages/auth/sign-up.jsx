import React, { useState } from 'react';
import axios from 'axios';
import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { FaGithub } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ReCAPTCHA from "react-google-recaptcha";

export function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users/signup', {
        name,
        email,
        password,
        phoneNumber,
        role,
      });
      console.log('SignUp response:', response.data);
      navigate("/auth/sign-in");
      // Traitez la réponse ici
    } catch (error) {
      console.error('SignUp error:', error);
      setError('Error signing up. Please try again later.');
    }
  };

 /* const handleGitHubLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/auth/login/github');
      window.location.href = response.data.redirectUrl;
    } catch (error) {
      if (error.response) {
        console.error('GitHub Login error:', error.response);
        setError('Error logging in with GitHub. Please try again later.');
      } else if (error.request) {
        console.error('GitHub Login error:', error.request);
        setError('No response from server. Please check your network connection.');
      } else {
        console.error('GitHub Login error:', error.message);
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };*/

  function onChange(value) {
    console.log("Captcha value:", value);
  }



  return (
    <section className="flex items-center justify-center h-screen">
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your details to register.</Typography>
        </div>
        <form onSubmit={handleSignUp} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex flex-col items-center justify-center mt-6 w-full max-w-md">
  {/* Conteneur pour les éléments */}
  <div className="mb-6 w-full">
    {/* Input Name */}
    <div className="mb-6">
      <Input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>

    {/* Input Email */}
    <div className="mb-6">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    {/* Input Password */}
    <div className="mb-6">
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>

    {/* PhoneInput */}
    <div className="mb-4 ">
      <PhoneInput
        country={"in"}
        value={phoneNumber}
        onChange={setPhoneNumber}
      />
    </div>
  </div>

  {/* Ajouter le ReCAPTCHA ici */}
  <ReCAPTCHA sitekey="6LeQG5MpAAAAAEAcplIyVNa1WWeHnqd5TWdF98Pe" onChange={onChange} />
</div>

          
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          
          <Button type="submit" className="mt-6" fullWidth>
            Register Now
          </Button>
        
         {/* <div className="flex justify-center space-x-4 mt-6">
            <Button onClick={handleGitHubLogin} className="flex items-center justify-center space-x-2 bg-gray-800 text-white hover:bg-gray-900 px-4 py-2 rounded-lg transition-colors">
              <FaGithub className="w-5 h-5" />
              <span>Login with GitHub</span>
            </Button>
          </div>*/}
        </form>
        <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
          Already have an account?
          <Link to="/auth/sign-in" className="text-gray-900 ml-1">Sign in</Link>
        </Typography>
      </div>
      <div className="w-2/5 h-full lg:block hidden">
        <img src="/img/pattern.png" className="h-auto w-full object-cover rounded-3xl" alt="Background pattern" />
      </div>
    </section>
  );
}
