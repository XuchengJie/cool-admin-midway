import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 医疗模块-报告信息
 */
@Entity('medical_report')
export class MedicalReportEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { comment: '报告ID' })
  id: number;

  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '医生ID' })
  doctorId: number;

  @Column({ comment: '查看日期', type: 'date' })
  viewDate: Date;

  // 文件列表
  files: string[];
  // 用户姓名
  nickName: string;
  // 医生姓名
  doctorName: string;
}
