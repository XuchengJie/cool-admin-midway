import { Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/socketio';

@Middleware()
export class SocketMiddleware {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      if (ctx.handshake.auth.token != 'a3bzxrxmp4fi7vw5m19vxa458f1y4w28') {
        return new Error('unauthorized');
      }
      return await next();
    };
  }
}
