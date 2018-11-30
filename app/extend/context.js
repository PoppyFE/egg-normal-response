/**
 * Created by alex on 2017/9/16.
 */

'use strict';

const SUCCESS_RESPCODE = 'S0001';

module.exports = {

  findRespMessage(respCode) {
    const respCfg = this.app.config.normalResponse.CODES;
    if (!respCfg) return;

    const respCodeItem = respCfg[respCode];
    if (!respCodeItem) return;

    return respCodeItem.message;
  },

  findRespStatus(respCode) {
    const respCfg = this.app.config.normalResponse.CODES;
    if (!respCfg) return;

    const respCodeItem = respCfg[respCode];
    if (!respCodeItem) return;

    return respCodeItem.status;
  },

  formatSuccessResp({data, msg, status} = {}) {
    const respCode = SUCCESS_RESPCODE;
    const respMessage = msg || this.findRespMessage(respCode) || '成功';

    this.body = {
      respCode,
      data,
      respMessage,
    };

    if (status) {
      this.status = status;
    }
  },

  throwError(err) {
    if (typeof err === 'string') {
      err = new Error(err);
    }

    if (!err.hasOwnProperty('errCode')) {
      err.errCode = 'F500';
    }
    err.normalResponse = true;
    throw err;
  },

  formatFailResp({errCode, respErrorDetails, msg, status}) {
    if (status && !errCode) {
      errCode = 'F' + status;
    }

    errCode = errCode || 'F500';
    respErrorDetails = this.app.config.normalResponse.respErrorDetails ? respErrorDetails : undefined;
    let respMessage = msg || this.findRespMessage(errCode) || '服务异常';
    status = status || this.findRespStatus(errCode) || 500;// 默认

    if (typeof this.app.config.normalResponse.formatFailRespHook === "function") {
      const result = this.app.config.normalResponse.formatFailRespHook({errCode, respErrorDetails, respMessage, status});
      errCode = result.errCode;
      respMessage = result.respMessage;
      respErrorDetails = result.respErrorDetails;
      status = result.status;
    }

    this.body = {
      respCode: errCode,
      respMessage,
      respErrorDetails,
    };

    if (status) {
      this.status = status;
    }
  },

  formatFailRespWithError(err) {
    if (err instanceof  Error) {

      if (err.name === 'ConnectionTimeoutError') {
        this.formatFailResp({
          errCode: 'F408',
        });
        return;
      }

      if (err.name === 'PayloadTooLargeError') {
        this.formatFailResp({
          errCode: 'F413',
        });
        return;
      }

      // normal logic error.
      if (err.normalResponse) {
        const response = {};

        response.errCode = err.hasOwnProperty('errCode') ? err.errCode : 'F500';
        response.msg = err.message || '';

        if (err.hasOwnProperty('respErrorDetails')) {
          response.respErrorDetails = err.respErrorDetails;
        }

        if (err.hasOwnProperty('status')) {
          response.status = err.status;
        }

        this.formatFailResp(response);

        this.logger.info(`业务错误: Message: ${response.msg}`);

        return;
      }
    }

    this.formatFailResp({
      errCode: 'F500'
    });
  },

  isSuccessResp() {
    return this.body && this.body.respCode === SUCCESS_RESPCODE;
  },

  isFailResp() {
    return this.status >= 400 || (this.body && this.body.respCode !== SUCCESS_RESPCODE);
  },

  isNormalResp() {
    return this.body && this.body.hasOwnProperty('respCode');
  },
};
