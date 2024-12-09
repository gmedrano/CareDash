import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { sessionState, useChatSession } from "@chainlit/react-client";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { useRecoilValue } from "recoil";
import DocumentManagement from './components/DocumentManagement';
import PatientRecords from './components/PatientRecords';
import PatientManagement from './components/PatientDetails';

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
    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
    }
  }, []);

  const handleLogin = (newToken: string) => {
    setIsLoggedIn(true);
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken('');
    localStorage.removeItem('token');
  };
  const Main = () => {
    return (
      <>
        <div>
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : 
          <Chat token={token} onLogout={handleLogout} />
        }
      </div>
      </>
    )
  }

  return (
    <Router>
      <Routes>
       <Route path="/" element={<Main />} />
        <Route path="/document-management" element={<DocumentManagement token={token}/>} />
        <Route path="/patient-records" element={<PatientRecords />} />
        <Route path="/patient-management" element={<PatientManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
