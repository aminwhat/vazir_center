import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { NoktehService } from './nokteh.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'nokteh.v0', transports: ['websocket'] })
export class NoktehGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private noktehService: NoktehService) {}
  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    console.log('Nokteh Client Connected: ' + client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('Nokteh Client DisConnected: ' + client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
