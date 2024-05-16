import { BaseEntity } from '@cool-midway/core';
import { Column, Entity } from 'typeorm';

/**
 * 医疗模块-文件信息
 */
@Entity('medical_files')
export class MedicalFilesEntity extends BaseEntity {
  @Column({ comment: '报告ID' })
  reportId: number;

  @Column({ comment: '文件地址' })
  file: string;
}
