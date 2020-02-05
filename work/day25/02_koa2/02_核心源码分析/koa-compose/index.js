module.exports = compose

//middleware : 存放中间件的数组
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }


  //context:ctx  next:undefined
    //请求过来时 当前方法要被调用一次!
  return function (context, next) {
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      //处理边界情况!!!
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))

        //从中间件数组中提取出第一个!
      index = i
      let fn = middleware[i]

      //处理边界情况!!!
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()

      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
