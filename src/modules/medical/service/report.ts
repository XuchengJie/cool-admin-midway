import { BaseService, CoolCommException } from '@cool-midway/core';
import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { MedicalReportEntity } from '../entity/report';
import { MedicalFilesEntity } from '../entity/files';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { MedicalUserEntity } from '../entity/user';
import { MedicalDoctorEntity } from '../entity/doctor';

/**
 * 系统用户
 */
@Provide()
export class MedicalReportService extends BaseService {
  @InjectEntityModel(MedicalReportEntity)
  medicalReportEntity: Repository<MedicalReportEntity>;

  @InjectEntityModel(MedicalFilesEntity)
  medicalFilesEntity: Repository<MedicalFilesEntity>;

  @InjectEntityModel(MedicalUserEntity)
  medicalUserEntity: Repository<MedicalUserEntity>;

  @InjectEntityModel(MedicalDoctorEntity)
  medicalDoctorEntity: Repository<MedicalDoctorEntity>;

  /**
   * 新增
   * @param param
   */
  async add(param: any) {
    const userInfo = await this.medicalUserEntity.findOneBy({
      id: param.userId,
    });
    if (!userInfo) {
      throw new CoolCommException('用户不存在');
    }
    const doctorInfo = await this.medicalDoctorEntity.findOneBy({
      id: param.doctorId,
    });
    if (!doctorInfo) {
      throw new CoolCommException('XX不存在');
    }
    await this.medicalReportEntity.save(param);
    await this.updateReportFiles(param);
    return param.id;
  }

  /**
   * 保存报告文件
   * @param report
   */
  async updateReportFiles(report: MedicalReportEntity) {
    if (_.isEmpty(report.files)) {
      return;
    }

    for (const file of report.files) {
      await this.medicalFilesEntity.save({ reportId: report.id, file });
    }
  }
}
