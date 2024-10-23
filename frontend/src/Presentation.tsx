import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sessionState, useChatSession } from "@chainlit/react-client";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import DocumentManagement from './components/DocumentManagement';
import PatientRecords from './components/PatientRecords';
import PatientManagement from './components/PatientDetails';
import { useRecoilValue } from "recoil";

const userEnv = {};
// Sample pages/slides components


const Presentation = () => {
  const [currentPage, setCurrentPage] = useState(0);
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
  handleLogout
  // Array of page components
  const pages = [
    <Login onLogin={handleLogin} />,
    <DocumentManagement token={token} />,
    <PatientRecords />,
    <PatientManagement />,
    <PatientRecords />,
    <Chat token={token} onLogout={handleLogout} />
  ];

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  console.log('isLoggedIn', isLoggedIn)

  return (
    <div className="relative h-screen bg-gray-100">
      {/* Main content area */}
      <div className="h-full">
        <div className="relative h-full bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Page content with transition */}
          <div className="h-full transition-opacity duration-300 ease-in-out">
            {pages[currentPage]}
          </div>

          {/* Navigation buttons */}
          <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
            <button
              onClick={goToPreviousPage}
              className={`p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-opacity duration-200 pointer-events-auto ${
                currentPage === 0 ? 'opacity-0' : 'opacity-70 hover:opacity-100'
              }`}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={goToNextPage}
              className={`p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-opacity duration-200 pointer-events-auto ${
                currentPage === pages.length - 1 ? 'opacity-0' : 'opacity-70 hover:opacity-100'
              }`}
              disabled={currentPage === pages.length - 1}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Page indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {pages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                currentPage === index ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Presentation;