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
import { V0Service } from './v0.service';

@WebSocketGateway({ namespace: 'v0', transports: ['websocket'] })
export class V0Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log('Hessab Client Connected: ' + client.id);
    const { versionExists } = await this.v0Service.versionValid(
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

  constructor(private v0Service: V0Service) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('update_exists')
  async updateExists(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const { update } = await this.v0Service.updateExists(
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
  async getInfo(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    this.server.emit('get_info', await this.v0Service.getInfo(payload));
  }

  @SubscribeMessage('user_info')
  async userSession(
    @ConnectedSocket() client: Socket,
    @MessageBody('user_id') user_id: string,
  ) {
    const user = await this.v0Service.getUserInfoById(user_id);
    this.server.emit('user_info', user);
    console.log({ user });
  }
}
