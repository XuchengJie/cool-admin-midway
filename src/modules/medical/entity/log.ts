import { BaseEntity } from '@cool-midway/core';
import { Column, Index, Entity } from 'typeorm';

/**
 * 同步日志
 */
@Entity('medical_log')
export class MedicalLogEntity extends BaseEntity {
  @Column({ comment: '任务ID', nullable: true })
  taskId: string;

  @Column({ comment: '代理ID', nullable: true })
  proxyId: string;

  @Column({ comment: '状态 0-失败 1-成功', default: 0 })
  status: number;

  @Column({ comment: '详情描述', nullable: true, type: 'text' })
  detail: string;

  @Column({ comment: '结束时间', type: 'datetime' })
  endTime: Date;
}
