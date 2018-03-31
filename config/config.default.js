'use strict';

/**
 * egg-normal-response default config
 * @member Config#normalResponse
 * @property {String} SOME_KEY - some description
 */

const CODES = {
  S0001: {
    status: 200,
    msg: '成功',
  },

  F400: {
    status: 400,
    message: '参数错误'
  },

  F401: {
    status: 401,
    message: '未授权'
  },

  'F401-1': {
    status: 401,
    message: '未授权'
  },

  F403: {
    status: 403,
    message: '禁止访问'
  },

  F404: {
    status: 404,
    message: '资源不存在'
  },

  F408: {
    status: 408,
    message: '系统响应超时，请稍后尝试'
  },

  F424: {
    status: 424,
    message: '系统繁忙，请稍后尝试'
  },

  F429: {
    status: 429,
    message: '频繁请求，请稍后尝试'
  },

  F500: {
    status: 500,
    message: '服务异常'
  }
};

exports.normalResponse = {
  CODES,
  respErrorDetails: false,
};
