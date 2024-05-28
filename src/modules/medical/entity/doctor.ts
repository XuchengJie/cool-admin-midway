import { BaseEntity } from '@cool-midway/core';
import { Column, Entity } from 'typeorm';

/**
 * 医疗模块-医生信息
 */
@Entity('medical_doctor')
export class MedicalDoctorEntity extends BaseEntity {
  @Column({ comment: '姓名' })
  name: string;
}
