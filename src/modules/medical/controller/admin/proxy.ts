import { Application as SocketApplication } from '@midwayjs/socketio';
import { App, Get, Body, Post, Inject, InjectClient } from '@midwayjs/core';
import {
  BaseController,
  CoolCommException,
  CoolController,
} from '@cool-midway/core';
import { MedicalFilesEntity } from '../../entity/files';
import { ProxySingleQueue } from '../../queue/single';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';
import { v4 as uuidv4 } from 'uuid';

@CoolController({
  api: [],
  entity: MedicalFilesEntity,
})
export class AdminMedicalProxyController extends BaseController {
  @App('socketIO')
  socketApp: SocketApplication;

  @InjectClient(CachingFactory, 'default')
  midwayCache: MidwayCache;

  // 普通队列
  @Inject()
  proxySingleQueue: ProxySingleQueue;

  @Get('/list', { summary: '代理列表' })
  async list() {
    const list = [];
    const sockets = await this.socketApp.fetchSockets();
    sockets.forEach(socket => {
      list.push({
        id: socket.id,
        url: socket.data.url,
        ip: socket.data.remoteip,
        startTime: socket.data.startTime,
        medical: socket.data.medical,
        insurance: socket.data.insurance,
      });
    });
    return this.ok(list);
  }

  @Get('/info', { summary: '代理详情' })
  async proxyInfo(@Body('id') id: string) {
    const list = [];
    const sockets = await this.socketApp.in(id).fetchSockets();
    sockets.forEach(socket => {
      list.push({ id: socket.id, data: socket.data });
    });
    return this.ok(list);
  }

  @Get('/status', { summary: '同步状态' })
  async status(@Body('id') id: string) {
    const status = await this.midwayCache.get(`task_${id}`);
    return this.ok({ status: status });
  }

  @Post('/proxyStatus', { summary: '获取代理状态' })
  async proxyStatus(@Body('id') id: string) {
    const sockets = await this.socketApp.in(id).fetchSockets();
    if (sockets.length == 0)
      throw new CoolCommException('代理不在线，请刷新列表');
    const socket = sockets[0];
    socket.data.medical = false;
    socket.data.insurance = false;
    this.socketApp.in(id).emit('proxy.rsync');
    return this.ok();
  }

  /**
   * 发送任务到代理
   */
  @Post('/add', { summary: '发送任务' })
  async queue(@Body('id') id: string, @Body('params') params: any) {
    const sockets = await this.socketApp.in(id).fetchSockets();
    if (sockets.length == 0)
      throw new CoolCommException('代理不在线，请刷新列表');

    const taskKey = 'proxy:tasks:task_running_id';
    const taskId = await this.midwayCache.get(taskKey);
    if (taskId) throw new CoolCommException('正在同步，请稍候重试');

    const uuid = uuidv4();
    let response = null;
    try {
      response = await this.socketApp
        .in(id)
        .timeout(5000)
        .emitWithAck('rsync-medical', { id: uuid, params: params });
    } catch (err) {
      throw new CoolCommException('同步失败，请检查代理是否正常');
    }

    if (response[0].status != 'ok')
      throw new CoolCommException('同步失败，代理收到任务但返回了错误的信息');
    // 任务ID写入缓存
    await this.midwayCache.set(taskKey, uuid, 600 * 1000);
    return this.ok();
  }
}
