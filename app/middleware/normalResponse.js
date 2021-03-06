/**
 * Created by alex on 2017/9/20.
 */

'use strict';

module.exports = () => {
  return async function (ctx, next) {
    const { logger } = ctx;

    try {
      await next();
    } catch (err) {

      ctx.formatFailRespWithError(err);

      // 这个是个业务cover的错误.
      if (err.hasOwnProperty('errCode')) {
        return;
      }

      if (ctx.app.config.normalResponse.respErrorDetails && !ctx.body.respErrorDetails) {
        ctx.body.respErrorDetails = err.message + '\n' + err.stack;
      }
      // 注意：自定义的错误统一处理函数捕捉到错误后也要 `app.emit('error', err, this)`
      // 框架会统一监听，并打印对应的错误日志
      ctx.app.emit('error', err, ctx);
      logger.error('Error: Server Internal Error \n' + err.message + '\n' + err.stack);
      return;
    }

    // 不要修改! 这里可能 body 为空字符, 所以只做未设值判断
    if (ctx.body === undefined) {
      ctx.formatFailResp({errCode: 'F404'});
      logger.error('Error: 404 NOT FOUND');
    }
  };
};
