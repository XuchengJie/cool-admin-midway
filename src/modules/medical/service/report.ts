import { BaseService } from '@cool-midway/core';
import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { MedicalReportEntity } from '../entity/report';
import { Repository } from 'typeorm';
import * as _ from 'lodash';

/**
 * 系统用户
 */
@Provide()
export class MedicalReportService extends BaseService {
  @InjectEntityModel(MedicalReportEntity)
  baseSysUserEntity: Repository<MedicalReportEntity>;

  /**
   * 分页查询
   * @param query
   */
  async page(query: any) {
    const { keyWord, status, doctorIds = [] } = query;
    const sql = `
        SELECT
            a.id,a.userId,a.doctorId,a.viewDate,a.createTime,a.updateTime,
            b.nickName as "nickName",
            c.name as "doctorName"
        FROM
            medical_report a
        LEFT JOIN user_info b ON a.userId = b.unionid
        LEFT JOIN medical_doctor c ON a.doctorId = c.id
        WHERE 1 = 1
            ${this.setSql(!_.isEmpty(doctorIds), 'and a.doctorId in (?)', [
              doctorIds,
            ])}
        `;
    const result = await this.sqlRenderPage(sql, query);
    return result;
  }
}
