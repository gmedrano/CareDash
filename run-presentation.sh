#!/bin/bash
cd ./backend 
uvicorn app.main_presentation:app --host 0.0.0.0 --port 8081 & 
cd ../frontend 
npm run dev:presentation &  
tail -f /dev/null