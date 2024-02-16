import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { NoktehService } from './nokteh.service';

@WebSocketGateway()
export class NoktehGateway {
  constructor(private noktehService: NoktehService) {}

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
