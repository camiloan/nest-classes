import { Manager, Socket } from 'socket.io-client'
export const connectToServer = () => {

    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js')

    const socket = manager.socket('/')

    addListeners(socket)
}


const addListeners = (socket: Socket) => {

    const clientsUl = document.querySelector<HTMLUListElement>('#clients-ul')!
    const serverStatus = document.querySelector<HTMLSpanElement>('#server-status')!
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!
    socket.on('connect', () => {
        serverStatus.innerText = 'Online'
    })
    socket.on('disconnect', () => {
        serverStatus.innerText = 'Offline'
    })
    socket.on('clients-updated', (clients: string[]) => {
        let clientsHtml = '';
        clients.forEach(clientId => {
            clientsHtml += `<li>${clientId}</li>`
        })
        clientsUl.innerHTML = clientsHtml
    })

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault()
        if (messageInput.value.trim().length <= 0) return;


        socket.emit('message-from-client', { id: socket.id, message: messageInput.value })
        messageInput.value = ''

    })
}