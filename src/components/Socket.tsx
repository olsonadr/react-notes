import React from 'react';
import io from 'socket.io-client';

// Create new connection
const URL = process.env.REACT_APP_DEV_PORT
  ? `:${process.env.REACT_APP_DEV_PORT}/`
  : `${window.location.host}`;

console.log(`Trying to connect to ${URL}`);

export const Socket = io(URL, {
  reconnectionDelay: 1000,
  reconnection: true,
  transports: ["websocket"],
  agent: false,
  upgrade: false,
  rejectUnauthorized: false,
});

export const SocketContext = React.createContext(Socket);