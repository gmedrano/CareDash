import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { clearMessages } from '../api'

import {
  useChatInteract,
  useChatMessages,
  IStep,
} from "@chainlit/react-client";
import { useState } from "react";
import caredashLogoWhite from '../../public/images/caredash-logo-white.svg';
import userAvatar from '../../public/images/user-avatar.png';
import dashboardIcon from '../../public/images/dashboard-icon.svg';
import patientsIcon from '../../public/images/patients-icon.svg';
import docsIcon from '../../public/images/docs-icon.svg';


export function Chat({token, onLogout}: {token: string, onLogout: () => void}) {
  const [inputValue, setInputValue] = useState("");
  const { sendMessage } = useChatInteract();
  const { messages } = useChatMessages();

  const handleSendMessage = () => {
    const content = inputValue.trim();
    if (content) {
      const message = {
        name: "user",
        type: "user_message" as const,
        output: content,
      };
      sendMessage(message, []);
      setInputValue("");
    }
  };

  const renderMessage = (message: IStep) => {
    const dateOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(message.createdAt).toLocaleTimeString(
      undefined,
      dateOptions
    );
    return (
      <div key={message.id} className="flex items-start space-x-2">
        <div className="w-20 text-sm text-green-500">{message.name}</div>
        <div className="flex-1 border rounded-lg p-2">
          <p className="text-black dark:text-white">{message.output}</p>
          <small className="text-xs text-gray-500">{date}</small>
        </div>
      </div>
    );
  };

  return (
    <>
    <div className="dashboard-container">
        <div className="top-bar">
            <div className="menu-toggle">
                &#9776;
            </div>
            <div className="logo-small">
                <img src={caredashLogoWhite} alt="CareDash Logo" />
            </div>
            <div className="user-info">
                <img src={userAvatar} alt="User Avatar" className="avatar" />
                <span className="user-name">Tony Stark</span>
            </div>
        </div>

        <div className="main-content">

            <nav className="nav-panel">
                <ul>
                    <li>
                        <a href="#">
                            <i className="nav-icon">
                                <img src={dashboardIcon} alt="Dashboard Icon" />
                            </i>
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="nav-icon">
                                <img src={patientsIcon} alt="Patients Icon" />
                            </i>
                            Patient Records
                        </a>
                    </li>
                    <li>
                        <a href="#" className="active">
                            <i className="nav-icon">
                                <img src={docsIcon} alt="Docs Icon" />
                            </i>
                            Document Management
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="nav-icon">
                                <img src={docsIcon} alt="Docs Icon" />
                            </i>
                            Settings
                        </a>
                    </li>
                </ul>
            </nav>

            <div className="view-content">
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Button onClick={onLogout}>Logout</Button>
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {messages.map((message) => renderMessage(message))}
        </div>
      </div>
      <div className="border-t p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <Input
            autoFocus
            className="flex-1"
            id="message-input"
            placeholder="Type a message"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} type="submit">
            Send
          </Button>
          <Button onClick={() => clearMessages(token)} type="submit">
            Reset
          </Button>
        </div>
      </div>
    </div>
  
            </div>
        </div>
    </div>

    <input type="checkbox" id="modal-toggle" className="modal-toggle" style={{ visibility: "hidden" }} />


    <dialog className="modal" open>
        <form method="dialog" className="upload-form">
            <h2>Upload Document</h2>
            <input type="file" name="document" />
            <div className="modal-buttons">
                <button type="submit">Upload</button>
                <label htmlFor="modal-toggle" className="close-button">Cancel</label>
            </div>
        </form>
    </dialog>


    <div className="overlay"></div>
</>
  );
}
