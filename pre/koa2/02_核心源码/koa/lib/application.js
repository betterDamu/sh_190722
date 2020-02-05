const isGeneratorFunction = require('is-generator-function');
const debug = require('debug')('koa:application');
const onFinished = require('on-finished');
const response = require('./response');
const compose = require('koa-compose');
const context = require('./context');
const request = require('./request');
const statuses = require('statuses');
const Emitter = require('events');
const util = require('util');
const Stream = require('stream');
const http = require('http');
const only = require('only');
const convert = require('koa-convert');
const deprecate = require('depd')('koa');
const { HttpError } = require('http-errors');


module.exports = class Application extends Emitter {
  // 在new Koa()时, 当前的constructor会被执行
  constructor(options) {
    super();
    options = options || {};
    this.proxy = options.proxy || false;
    this.subdomainOffset = options.subdomainOffset || 2;
    this.proxyIpHeader = options.proxyIpHeader || 'X-Forwarded-For';
    this.maxIpsCount = options.maxIpsCount || 0;
    this.env = options.env || process.env.NODE_ENV || 'development';
    if (options.keys) this.keys = options.keys;

    /*
    * 为每个Koa的实例对象新增一个middleware属性, 用来存放对应的中间件（一个中间件本质就是一个回调函数）
    * 为每个Koa的实例对象新增一个context属性 该属性继承context (由 lib/context.js暴露出来的模块)
    * 为每个Koa的实例对象新增一个request属性 该属性继承request (由 lib/request.js暴露出来的模块)
    * 为每个Koa的实例对象新增一个response属性 该属性继承request(由 lib/response.js暴露出来的模块)
    * */
    this.middleware = [];
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);

    if (util.inspect.custom) {
      this[util.inspect.custom] = this.inspect;
    }
  }
  //为每个Koa的实例对象新增一个listen方法
  listen(...args) {
    debug('listen');
    // 创建http服务,并进行监听  监听http请求的回调来自于callback函数的返回值
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
  toJSON() {
    return only(this, [
      'subdomainOffset',
      'proxy',
      'env'
    ]);
  }
  inspect() {
    return this.toJSON();
  }
  //为每个Koa的实例对象新增一个use方法
  use(fn) {
    // 确保传入的fn是一个函数
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    // 支持GeneratorFunction 向下兼容
    if (isGeneratorFunction(fn)) {
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
      fn = convert(fn);
    }
    debug('use %s', fn._name || fn.name || '-');

    // use方法只负责收集中间件 逼格高一点的描述就是: 中间件的注册
    this.middleware.push(fn);
    return this;
  }
  // 监听http请求的回调 来自于callback的返回值
  callback() {
    /*
      compose函数来自于koa-compose包暴露的模块 其接收了对应koa实例的中间件数组
      compose函数的执行结果: 一个预备对中间件数组进行大量操作的函数
    */

    const fn = compose(this.middleware);

    if (!this.listenerCount('error')) this.on('error', this.onerror);

    //监听http请求的回调
    const handleRequest = (req, res) => {
      // 调用createContext创建上下文对象,传入的是http请求对象和http响应对象
      const ctx = this.createContext(req, res);
      // 执行handleRequest 来处理请求, 传入的是上下文 和 一个对中间件进行处理的预备函数
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }

  //处理http请求 传入的是上下文 和 一个对中间件进行处理的预备函数
  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);

    //调用fnMiddleware 实现koa的洋葱模型
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
  //创建上下文对象
  createContext(req, res) {

    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);

    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;

    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;

    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }
  onerror(err) {
    if (!(err instanceof Error)) throw new TypeError(util.format('non-error thrown: %j', err));

    if (404 == err.status || err.expose) return;
    if (this.silent) return;

    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, '  '));
    console.error();
  }
};


function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;

  if (!ctx.writable) return;

  const res = ctx.res;
  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }

  if ('HEAD' === ctx.method) {
    if (!res.headersSent && !ctx.response.has('Content-Length')) {
      const { length } = ctx.response;
      if (Number.isInteger(length)) ctx.length = length;
    }
    return res.end();
  }

  // status body
  if (null == body) {
    if (ctx.req.httpVersionMajor >= 2) {
      body = String(code);
    } else {
      body = ctx.message || String(code);
    }
    if (!res.headersSent) {
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}


module.exports.HttpError = HttpError;
