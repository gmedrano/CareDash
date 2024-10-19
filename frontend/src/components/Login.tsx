import React, { useState } from 'react';
//import { div, button, div, label, input, div } from '@chakra-ui/react';
import { login } from '../api';



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
    <div >
      <form onSubmit={handleSubmit}>
        <div >
          <div>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e: any) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

