import React from "react";
import ReactDOM from "react-dom/client";
import Presentation from "./Presentation.tsx";
import { RecoilRoot } from "recoil";
import "./index.css";
import { ChainlitAPI, ChainlitContext } from "@chainlit/react-client";

const CHAINLIT_SERVER = "http://localhost:8080/chainlit";

const apiClient = new ChainlitAPI(CHAINLIT_SERVER, "webapp");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChainlitContext.Provider value={apiClient}>
      <RecoilRoot>
        <Presentation />
      </RecoilRoot>
    </ChainlitContext.Provider>
  </React.StrictMode>
);