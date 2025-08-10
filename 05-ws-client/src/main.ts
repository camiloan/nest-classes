import { connectToServer } from './socket-client'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>WebSocket Client</h1>
    <span id='server-status'>Offline</span>
    <ul id='clients-ul'></ul>

    <form id="message-form">
      <input type="text" id="message-input" placeholder="Type a message...">
    </form>
  </div>
`

connectToServer()