import { io } from 'socket.io-client';

// Opprett socket-tilkobling
const socket = io('http://localhost:8000', {
    withCredentials: true,
});

export default socket;
