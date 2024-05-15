import { BaseEntity } from '@cool-midway/core';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SpaceInfoEntity } from '../../space/entity/info';

/**
 * 医疗模块-报告信息
 */
@Entity('medical_report')
export class MedicalReportEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: '报告ID' })
  id: number;

  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '医生ID' })
  doctorId: number;

  @Column({ comment: '查看日期', type: 'date' })
  viewDate: Date;

  @ManyToMany(() => SpaceInfoEntity)
  @JoinTable({
    name: 'medical_report_files',
    joinColumn: { name: 'reportId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'fileId', referencedColumnName: 'fileId' },
  })
  files: SpaceInfoEntity[];
}
