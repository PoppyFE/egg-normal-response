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

  formatSuccessResp({data, msg, status}) {
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

  formatFailResp({errCode, respErrorDetails, msg, status}) {
    if (status && !errCode) {
      errCode = 'F' + status;
    }

    errCode = errCode || 'F500';
    respErrorDetails = this.app.config.normalResponse.respErrorDetails ? respErrorDetails : undefined;
    const respMessage = msg || this.findRespMessage(errCode) || '服务异常';
    this.body = {
      respCode: errCode,
      respMessage,
      respErrorDetails,
    };

    status = status || this.findRespStatus(errCode) || 500;// 默认

    if (status) {
      this.status = status;
    }
  },

  formatFailRespWithError(err) {
    if (err instanceof  Error) {
      const response = {};
      if (err.hasOwnProperty('errCode')) {
        response.errCode = err.errCode;
      }

      response.msg = err.message || '';

      if (err.hasOwnProperty('respErrorDetails')) {
        response.respErrorDetails = err.respErrorDetails;
      }

      if (err.hasOwnProperty('status')) {
        response.status = err.status;
      }

      this.formatFailResp(response);
    } else {
      this.formatFailResp({
        errCode: 'F500',
        msg: '未知异常'
      });
    }
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
