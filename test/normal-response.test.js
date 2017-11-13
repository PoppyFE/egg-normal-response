'use strict';

const request = require('supertest');
const mm = require('egg-mock');

describe('test/normal-response.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/normal-response-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mm.restore);

  it('should GET /', () => {
    return request(app.callback())
      .get('/')
      .expect('hi, normalResponse')
      .expect(200);
  });
});
