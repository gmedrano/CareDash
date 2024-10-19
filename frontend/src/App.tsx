import { useEffect, useState } from "react";
//import { Box, VStack } from '@chakra-ui/react';
import { sessionState, useChatSession } from "@chainlit/react-client";
import { Chat } from "./components/Chat";
import  {Login}  from "./components/Login";
import { useRecoilValue } from "recoil";

const userEnv = {};

function App() {
  const { connect } = useChatSession();
  const session = useRecoilValue(sessionState);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  
  useEffect(() => {
    if (session?.socket.connected) {
      return;
    }
    fetch("http://localhost:8080/custom-auth")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        connect({
          userEnv,
          accessToken: `Bearer: ${data.token}`,
        });
      });
  }, [connect]);


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('STORED', storedToken)
    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
    }
  }, []);

  const handleLogin = (newToken: string) => {
    setIsLoggedIn(true);
    setToken(newToken);
    console.log('NEW TOKEN', newToken)
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <>
      <div>
          {!isLoggedIn ? (
      <> <Login onLogin={handleLogin} /></>
      ) : (
        <Chat token={token} onLogout={handleLogout} />
      )}
      </div>
    </>
  );
}

export default App;
