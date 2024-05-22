import {
  WSController,
  OnWSConnection,
  Inject,
  OnWSMessage,
  OnWSDisConnection,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/socketio';
import { SocketMiddleware } from './middleware.auth';
/**
 * 测试
 */
@WSController('/')
export class HelloController {
  @Inject()
  ctx: Context;

  // 客户端连接
  @OnWSConnection({
    middleware: [SocketMiddleware],
  })
  async onConnectionMethod() {
    console.log('on client connect', this.ctx.id);
    this.ctx.emit('data', '连接成功');
  }

  // 客户端断开连接
  @OnWSDisConnection()
  async onDisConnectionMethod() {
    console.log('on client disconnect', this.ctx.id);
    this.ctx.emit('data', '断开连接');
  }

  // 消息事件
  @OnWSMessage('myEvent')
  async gotMessage(data: any) {
    console.log('on data got', this.ctx.id, data);
    if (isMessage(data)) {
      switch (data.type) {
        case 'url':
          this.ctx.data.url = data.message;
          break;
      }
    }
  }
}

interface Message {
  type: string;
  message: string;
}

const isMessage = (arg: any): arg is Message => {
  return typeof arg.type === 'string' && typeof arg.message === 'string';
};
