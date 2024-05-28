import {
    CoolController,
    BaseController,
    CoolUrlTag,
    TagTypes,
    CoolTag,
  } from '@cool-midway/core';
  import { Body, Inject, Post } from '@midwayjs/core';
  import { MedicalUserLoginService } from '../../service/login';
  
  /**
   * 登录
   */
  @CoolUrlTag()
  @CoolController()
  export class AppUserLoginController extends BaseController {
    @Inject()
    medicalUserLoginService: MedicalUserLoginService;
  
    @CoolTag(TagTypes.IGNORE_TOKEN)
    @Post('/mini', { summary: '小程序登录' })
    async mini(@Body() body: any) {
      const { code } = body;
      return this.ok(await this.medicalUserLoginService.mini(code));
    }
  
  
    @CoolTag(TagTypes.IGNORE_TOKEN)
    @Post('/refreshToken', { summary: '刷新token' })
    public async refreshToken(@Body('refreshToken') refreshToken: any) {
      return this.ok(await this.medicalUserLoginService.refreshToken(refreshToken));
    }
  
    @CoolTag(TagTypes.IGNORE_TOKEN)
    @Post('/password', { summary: '密码登录' })
    async password(
      @Body('phone') phone: string,
      @Body('password') password: string
    ) {
      return this.ok(await this.medicalUserLoginService.password(phone, password));
    }

    @Post('/test', { summary: '测试' })
    async test() {
      return this.ok();
    }
  }
  