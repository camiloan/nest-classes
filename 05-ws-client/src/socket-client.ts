import { Manager, Socket } from 'socket.io-client'
export const connectToServer = () => {

    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js')

    const socket = manager.socket('/')

    addListeners(socket)
}


const addListeners = (socket: Socket) => {
    const serverStatus = document.querySelector<HTMLSpanElement>('#server-status')!
    socket.on('connect', () => {
        serverStatus.innerText = 'Online'
    })
    socket.on('disconnect', () => {
        serverStatus.innerText = 'Offline'
    })
}