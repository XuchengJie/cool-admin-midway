import { Application as SocketApplication } from '@midwayjs/socketio';
import { Provide, Controller, App, Get } from '@midwayjs/core';
import { BaseController, CoolController } from '@cool-midway/core';

@CoolController()
export class AdminMedicalProxyController extends BaseController {
  @App('socketIO')
  socketApp: SocketApplication;

  @Get('/list')
  async invoke() {
    const list = [];
    const sockets = await this.socketApp.fetchSockets();
    sockets.forEach(socket => {
      list.push({ id: socket.id, data: socket.data });
    });
    return this.ok(list);
  }
}
