#!/bin/bash
cd ./backend 
uvicorn app.main:app --host 0.0.0.0 --port 8080 & 
cd ../frontend 
npm run dev &  
tail -f /dev/null