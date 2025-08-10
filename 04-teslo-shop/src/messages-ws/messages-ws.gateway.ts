import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server
  constructor(private readonly messagesWsService: MessagesWsService) { }

  handleConnection(client: Socket) {
    this.messagesWsService.registerClient(client);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectClients());
  }


  handleDisconnect(client: Socket) {
    this.messagesWsService.unregisterClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectClients());
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Emite unicamente al cliente
    /* client.emit('message-from-server', { fullName: client.id, message: payload.message || 'No message provided' }); */

    //! Emite a todos los clientes, menos al que emitio
   /*  client.broadcast.emit('message-from-server', { fullName: client.id, message: payload.message || 'No message provided' }) */;

    //! Emite a todos los clientes
    this.wss.emit('message-from-server', { fullName: client.id, message: payload.message || 'No message provided' });

  }




}
