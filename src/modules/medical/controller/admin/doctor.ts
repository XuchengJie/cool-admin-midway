import { CoolController, BaseController } from '@cool-midway/core';
import { MedicalDoctorEntity } from '../../entity/doctor';

/**
 * 医疗模块-医生信息
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: MedicalDoctorEntity,
})
export class AdminMedicalDoctorController extends BaseController {}
