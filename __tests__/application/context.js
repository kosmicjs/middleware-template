'use strict';

const assert = require('node:assert');
const request = require('supertest');
const Koa = require('../../dist/application');

describe('app.context', () => {
  const app1 = new Koa();
  app1.context.msg = 'hello';
  const app2 = new Koa();

  it('should merge properties', () => {
    app1.use((ctx, next) => {
      assert.strictEqual(ctx.msg, 'hello');
      ctx.status = 204;
    });

    return request(app1.listen()).get('/').expect(204);
  });

  it('should not affect the original prototype', () => {
    app2.use((ctx, next) => {
      assert.strictEqual(ctx.msg, undefined);
      ctx.status = 204;
    });

    return request(app2.listen()).get('/').expect(204);
  });
});
