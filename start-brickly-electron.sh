#!/bin/bash

echo "🚀 Avvio backend..."
cd apps/backend
npm run dev &
BACKEND_PID=$!
cd ../..

echo "🚀 Avvio frontend..."
cd apps/frontend
npm run dev &
FRONTEND_PID=$!
cd ../..

echo "🪟 Avvio Electron in modalità headless..."
cd apps/electron
xvfb-run -a npm run start &
ELECTRON_PID=$!
cd ../..

# Chiudi tutto con CTRL+C
trap "kill $BACKEND_PID $FRONTEND_PID $ELECTRON_PID; echo '🛑 Terminato'; exit" INT

wait
