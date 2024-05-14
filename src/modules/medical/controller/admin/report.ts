import { CoolController, BaseController } from '@cool-midway/core';
import { MedicalReportEntity } from '../../entity/report';

/**
 * 测试模块-报告信息
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: MedicalReportEntity,
})
export class AdminMedicalReportController extends BaseController {}
