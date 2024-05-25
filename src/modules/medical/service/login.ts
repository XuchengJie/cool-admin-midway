import { Config, Inject, Provide } from '@midwayjs/decorator';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { v1 as uuid } from 'uuid';
import * as md5 from 'md5';
import { MedicalUserEntity } from '../entity/user';
import axios from 'axios';
import { PluginService } from '../../plugin/service/info';

/**
 * 登录
 */
@Provide()
export class MedicalUserLoginService extends BaseService {
  @InjectEntityModel(MedicalUserEntity)
  medicalUserEntity: Repository<MedicalUserEntity>;

  @Config('module.user.jwt')
  jwtConfig;

  @Inject()
  pluginService: PluginService;


  /**
   * 保存微信信息
   * @param wxUserInfo
   * @param type
   * @returns
   */
  async saveWxInfo(wxUserInfo: any, type: any) {
    const find: any = { unionid: wxUserInfo.openid };
    let wxInfo: any = await this.medicalUserEntity.findOneBy(find);
    if (wxInfo) {
      wxUserInfo.id = wxInfo.id;
    }
    await this.medicalUserEntity.save({
      ...wxUserInfo,
      type,
    });
    return wxUserInfo;
  }

  /**
   * 小程序登录
   * @param code
   * @param encryptedData
   * @param iv
   */
  async mini(code: string) {
    let wxUserInfo = await this.openOrMpToken(code);
    console.log(wxUserInfo);
    if (wxUserInfo) {
      // 保存
      // wxUserInfo = await this.saveWxInfo(wxUserInfo, 0);
      return await this.wxLoginToken(wxUserInfo);
    }
  }

  /**
   * 获得token嗯
   * @param code
   * @param type
   */
  async openOrMpToken(code: string) {
    const result = await axios.get(
      'https://api.weixin.qq.com/sns/jscode2session',
      {
        params: {
          appid: "wxeb44fc4d5f5ee868",
          secret: "ef1885e621424b37cd1973261b5672ac",
          js_code: code,
          grant_type: 'authorization_code',
        },
      }
    );
    return result.data;
  }

  /**
   * 微信登录 获得token
   * @param wxUserInfo 微信用户信息
   * @returns
   */
  async wxLoginToken(wxUserInfo) {
    const unionid = wxUserInfo.unionid ? wxUserInfo.unionid : wxUserInfo.openid;
    let userInfo: any = await this.medicalUserEntity.findOneBy({ unionid });
    if (!userInfo) {
      // const file = await this.pluginService.getInstance('upload');
      // const avatarUrl = await file.downAndUpload(
      //   wxUserInfo.avatarUrl,
      //   uuid() + '.png'
      // );
      userInfo = {
        unionid,
        nickName: wxUserInfo.nickName,
        avatarUrl: "",
        gender: wxUserInfo.gender,
      };
      await this.medicalUserEntity.insert(userInfo);
    }
    return this.token({ id: userInfo.id });
  }

  /**
   * 刷新token
   * @param refreshToken
   */
  async refreshToken(refreshToken) {
    try {
      const info = jwt.verify(refreshToken, this.jwtConfig.secret);
      if (!info['isRefresh']) {
        throw new CoolCommException('token类型非refreshToken');
      }
      const userInfo = await this.medicalUserEntity.findOneBy({
        id: info['id'],
      });
      return this.token({ id: userInfo.id });
    } catch (e) {
      throw new CoolCommException(
        '刷新token失败，请检查refreshToken是否正确或过期'
      );
    }
  }

  /**
   * 密码登录
   * @param phone
   * @param password
   */
  async password(phone, password) {
    const user = await this.medicalUserEntity.findOneBy({ phone });

    if (user && user.password == md5(password)) {
      return this.token({
        id: user.id,
      });
    } else {
      throw new CoolCommException('账号或密码错误');
    }
  }

  /**
   * 获得token
   * @param info
   * @returns
   */
  async token(info) {
    const { expire, refreshExpire } = this.jwtConfig;
    return {
      expire,
      token: await this.generateToken(info),
      refreshExpire,
      refreshToken: await this.generateToken(info, true),
    };
  }

  /**
   * 生成token
   * @param tokenInfo 信息
   * @param roleIds 角色集合
   */
  async generateToken(info, isRefresh = false) {
    const { expire, refreshExpire, secret } = this.jwtConfig;
    const tokenInfo = {
      isRefresh,
      ...info,
    };
    return jwt.sign(tokenInfo, secret, {
      expiresIn: isRefresh ? refreshExpire : expire,
    });
  }
}
