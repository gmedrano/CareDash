import React, { useState } from 'react';
//import { div, button, div, label, input, div } from '@chakra-ui/react';
import { login } from '../../api';
//import './login.css';
import loginBg from '../../../public/images/login-bg.jpg';
import logo from '../../../public/images/caredash-logo-purple.svg';


interface LoginProps {
  onLogin: (token: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await login(username, password);
      onLogin(token);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <>
      <div className="grid-container">
        <div className="column-a" style={{ backgroundImage: `url(${loginBg})` }}>
        </div>
        <div className="column-b">
          <div className="login-panel">
            <img src={logo} className="logo-medium" alt="CareDash Logo" />
            <h6>Please provide your credentials to get you started on your health journey:</h6>
            <input className="textbox" type="text" placeholder="User" onChange={(e: any) => setUsername(e.target.value)} />
            <input className="textbox" type="password" placeholder="Password" onChange={(e: any) => setPassword(e.target.value)} />
            <button onClick={handleSubmit}>Sign In</button>
          </div>
        </div>
      </div>
    </>
  );
};

