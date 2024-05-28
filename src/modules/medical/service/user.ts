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
  medicalUserEntity: Repository<MedicalUserEntity>;

  /**
   * 查询用户
   */
  async search(name: string) {
    const menus = this.medicalUserEntity
      .createQueryBuilder('user')
      .select(['user.id', 'user.nickName'])
      .where('user.nickName like :searchName', { searchName: `%${name}%` })
      .limit(10)
      .getMany();
    return menus;
  }

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
