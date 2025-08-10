import { connectToServer } from './socket-client'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h2>WebSocket Client</h2>
    <div style="display: flex; flex-direction: row; gap: 10px;">
    <input id="jwt-token" placeholder="JWT Token">
    <button id="btn-connect">Connect</button>
    </div>
    <br/>
    <span id='server-status'>Offline</span>
    <ul id='clients-ul'></ul>

    <form id="message-form">
      <input type="text" id="message-input" placeholder="Type a message...">
    </form>

    <h3>Messages:</h3>
    <ul id="messages-ul"></ul>
  </div>
`

const jwtTokenInput = document.querySelector<HTMLInputElement>('#jwt-token')!
const btnConnect = document.querySelector<HTMLButtonElement>('#btn-connect')!

btnConnect.addEventListener('click', () => {
  if (jwtTokenInput.value.trim().length <= 0) return alert('Please enter a JWT token')
  connectToServer(jwtTokenInput.value.trim())
})