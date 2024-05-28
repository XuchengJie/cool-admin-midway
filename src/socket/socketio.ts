import {
  WSController,
  OnWSConnection,
  Inject,
  OnWSMessage,
  OnWSDisConnection,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/socketio';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalLogEntity } from '../modules/medical/entity/log';

/**
 * 测试
 */
@WSController('/')
export class HelloController {
  @Inject()
  ctx: Context;

  @InjectEntityModel(MedicalLogEntity)
  medicalLogEntity: Repository<MedicalLogEntity>;

  // 客户端连接
  @OnWSConnection()
  async onConnectionMethod() {
    console.log('on client connect', this.ctx.id);
    this.ctx.data.remoteip = this.ctx.client.conn.remoteAddress;
    this.ctx.data.startTime = this.ctx.startTime;
    this.ctx.data.medical = false;
    this.ctx.data.insurance = false;
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
          try {
            const url = new URL(data.message);
            this.ctx.data.url = url.hostname;
          } catch (_) {}
          break;
        case 'rsync':
          break;
      }
    }
  }

  // 代理状态事件
  @OnWSMessage('proxy.rsync')
  async proxyStatusMessage(data: any) {}

  // 同步状态事件
  @OnWSMessage('rsync.status')
  async rsyncStatusMessage(data: any) {}

  // 同步进度事件
  @OnWSMessage('rsync.progress')
  async rsyncProgressMessage(data: any) {}

  // 同步数据事件
  @OnWSMessage('rsync.data')
  async rsyncDataMessage(data: any) {}

  // 同步medical服务状态事件
  @OnWSMessage('rsync.service.medical')
  async rsyncServiceMedicalMessage(status: boolean) {
    this.ctx.data.medical = status;
  }

  // 同步insurance服务状态事件
  @OnWSMessage('rsync.service.insurance')
  async rsyncServiceInsuranceMessage(status: boolean) {
    this.ctx.data.insurance = status;
  }
}

interface Message {
  type: string;
  message: string;
}

const isMessage = (arg: any): arg is Message => {
  return typeof arg.type === 'string' && typeof arg.message === 'string';
};
