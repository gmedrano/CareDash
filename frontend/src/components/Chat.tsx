import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { clearMessages } from '../api'

import {
  useChatInteract,
  useChatMessages,
  IStep,
} from "@chainlit/react-client";
import { useState } from "react";
import Question  from "./Question";
import caredashLogoWhite from '../../public/images/caredash-logo-white.svg';
import userAvatar from '../../public/images/user-avatar.png';
import dashboardIcon from '../../public/images/dashboard-icon.svg';
import patientsIcon from '../../public/images/patients-icon.svg';
import docsIcon from '../../public/images/docs-icon.svg';

function extractJSON(message: string) {
  try {
    message = message.replace(/```json\s*|```/g, '')
    return JSON.parse(message.trim());
  } catch (error) {
    return null;
  }
}
  
export function Chat({token, onLogout}: {token: string, onLogout: () => void}) {
  const [inputValue, setInputValue] = useState("");
  const { sendMessage } = useChatInteract();
  const { messages } = useChatMessages();

  const handleChatAnswer = (id:string, answer:any) => {
    if (id && answer) {
      if (Array.isArray(answer)) {
        const message = {
          name: "user",
          type: "user_message" as const,
          output: answer.join(", "),
        };
        sendMessage(message, []);
      } else {
        const message = {
          name: "user",
          type: "user_message" as const,
          output: answer,
        };
        sendMessage(message, []);
      }
      setInputValue("");
    }
  }

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
    console.log('Message****', message)
    const splitData = message.output.split('%%');
    let outputMessage = splitData[0];
    let content: any = null;
    if (splitData.length > 1) {
      const _json = extractJSON(splitData[1]);
      console.log('Extracted JSON', _json);
      if (_json) {
        content = <Question question={_json} onAnswer={handleChatAnswer } />
      }
    }
    return (
      <div key={message.id} className={(message.type == 'user_message' ? 'user-avatar' : 'chatbot-avatar')+" flex items-start space-x-2"}>
        <div className="user-label">{message.name}</div>
        <div className="conversation-bubble">
          <p className="text-black dark:text-white">{outputMessage} {content}</p>
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
                <span className="user-name">Tom Smith</span>
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

            <div className="view-content-chat">
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
     
      <div className="flex-1 overflow-auto chatbot-viewport">
        <div className="space-y-4">
          {messages.map((message) => renderMessage(message))}
        </div>
      </div>
      <div className="border-t p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <Input
            autoFocus
            className="flex-1 user-input"
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
          <Button onClick={handleSendMessage} type="submit" className="large-button">
            Send
          </Button>
          <Button onClick={() => clearMessages(token)} type="submit" className="large-button">
            Reset
          </Button>
          <Button onClick={onLogout} className="large-button">Logout</Button>
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


