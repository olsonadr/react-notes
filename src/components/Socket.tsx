import React from 'react';
import io from 'socket.io-client';

// Create new connection
const port_override = 
  process.env.NODE_ENV === 'development' 
  ? window.env.REACT_APP_DEV_PORT
  : process.env.REACT_APP_DEV_PORT
  ?? undefined;
const URL = port_override ? `:${port_override}/` : `${window.location.host}`;

// console.log(`Trying to connect to ${URL}`);

export const Socket = io(URL, {
  reconnectionDelay: 1000,
  reconnection: true,
  transports: ["websocket"],
  agent: false,
  upgrade: false,
  rejectUnauthorized: false,
});

export const SocketContext = React.createContext(Socket);