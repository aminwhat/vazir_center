import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { HessabService } from './hessab.service';

@WebSocketGateway({ namespace: 'hessab.v0', transports: ['websocket'] })
export class HessabGateway implements OnGatewayConnection, OnGatewayDisconnect {
  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log('Hessab Client Connected: ' + client.id);
    const { versionExists } = await this.hessabService.versionValid(
      client.handshake.auth.version,
      client.handshake.auth.token,
    );
    this.server.emit('status', versionExists);

    if (!versionExists) {
      client.disconnect(true);
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('Hessab Client Disconnect: ' + client.id);
  }

  constructor(private hessabService: HessabService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('update_exists')
  async updateExists(
    @ConnectedSocket() client: any,
    @MessageBody() payload: any,
  ) {
    const { update } = await this.hessabService.updateExists(
      client.handshake.auth.version,
      client.handshake.auth.token,
    );
    let exists = false;
    if (update) {
      exists = true;
    }
    this.server.emit('update_exists', { exists: exists, update: update });
  }

  @SubscribeMessage('get_info')
  async getInfo(@ConnectedSocket() client: any, @MessageBody() payload: any) {
    this.server.emit('get_info', await this.hessabService.getInfo(payload));
  }
}
