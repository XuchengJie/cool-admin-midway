import { BaseCoolQueue, CoolQueue } from '@cool-midway/task';
import { IMidwayApplication, sleep } from '@midwayjs/core';
import { App } from '@midwayjs/decorator';

@CoolQueue()
export class ProxySingleQueue extends BaseCoolQueue {
  @App()
  app: IMidwayApplication;

  async data(job: any, done: any): Promise<void> {
    await sleep(10000);
    console.log('数据', job.data);
    done();
  }
}
