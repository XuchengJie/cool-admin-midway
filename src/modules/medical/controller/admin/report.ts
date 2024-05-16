import { CoolController, BaseController } from '@cool-midway/core';
import { MedicalReportEntity } from '../../entity/report';
import { MedicalReportService } from '../../service/report';
import { MedicalUserEntity } from '../../entity/user';
import { MedicalDoctorEntity } from '../../entity/doctor';

/**
 * 测试模块-报告信息
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: MedicalReportEntity,
  service: MedicalReportService,
  pageQueryOp: {
    keyWordLikeFields: ['b.nickName', 'c.name'],
    select: ['a.*', 'b.nickName as nickName', 'c.name as doctorName'],
    join: [
      {
        entity: MedicalUserEntity,
        alias: 'b',
        condition: 'a.userId = b.id',
        type: 'leftJoin',
      },
      {
        entity: MedicalDoctorEntity,
        alias: 'c',
        condition: 'a.doctorId = c.id',
        type: 'leftJoin',
      },
    ],
  },
})
export class AdminMedicalReportController extends BaseController {}
