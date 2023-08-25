export type Next = () => Promise<unknown>;

/**
 * Composeable middleware.
 *
 * @param context - The Koa extended context object
 * @param next - The next function to be call the next next middleware in the middleware chain.
 */
export type Middleware<C = Context> = (
  /**
   * The Koa extended context object
   */
  context: C,
  /**
   * The next function to be call the next next middleware in the middleware chain.
   * Always returns a promise and allows for fine grained middleware control flow.
   *
   */
  next: Next,
) => Promise<unknown>;

/**
 * Expose compositor
 *
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 */

function compose(middleware: Middleware[]) {
  if (!Array.isArray(middleware))
    throw new TypeError('Middleware stack must be an array!');
  for (const fn of middleware) {
    if (typeof fn !== 'function')
      throw new TypeError('Middleware must be composed of functions!');
  }

  return function (context: Context, next?: Next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch(i: number): Promise<unknown> {
      if (i <= index) Promise.reject(new Error('next() called multiple times'));
      index = i;
      let fn: Middleware | undefined = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (error) {
        return Promise.reject(error);
      }
    }
  };
}

export default compose;
