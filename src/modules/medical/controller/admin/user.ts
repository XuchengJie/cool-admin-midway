import { CoolController, BaseController } from '@cool-midway/core';
import { MedicalUserEntity } from '../../entity/user';
import { MedicalUserService } from '../../service/user';

/**
 * 测试模块-报告信息
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'page'],
  entity: MedicalUserEntity,
  service: MedicalUserService,
  infoIgnoreProperty: ['password'],
  pageQueryOp: {
    select: [
      'a.id',
      'a.unionid',
      'a.avatarUrl',
      'a.nickName',
      'a.phone',
      'a.gender',
      'a.status',
      'a.createTime',
      'a.updateTime',
    ],
  },
})
export class AdminMedicalUserController extends BaseController {}
