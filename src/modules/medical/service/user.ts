import { BaseService } from '@cool-midway/core';
import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { MedicalUserEntity } from '../entity/user';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import * as md5 from 'md5';

/**
 * 系统用户
 */
@Provide()
export class MedicalUserService extends BaseService {
  @InjectEntityModel(MedicalUserEntity)
  baseSysUserEntity: Repository<MedicalUserEntity>;

  /**
   * 修改之前
   * @param data
   * @param type
   */
  async modifyBefore(data: any, type: 'update' | 'add') {
    if (!_.isEmpty(data.password)) {
      data.password = md5(data.password);
    }
  }
}
