let Vue = null;
class HistoryRoute {
  constructor() {
    this.current = null;
  }
}
class VueRouter {
  constructor(options) {
    this.mode = options.mode || 'hash';
    this.routes = options.routes || []; //你传递的这个路由是一个数组表
    this.routesMap = this.createMap(this.routes);
    this.history = new HistoryRoute();
    this.init();
  }

  createWebHistory(base) {
    location.pathname ? '' : (location.pathname = '/');
    window.addEventListener('load', () => {
      this.history.current = location.pathname;
    });
    window.addEventListener('popstate', () => {
      this.history.current = location.pathname;
    });
  }
  init() {
    // vue3 中不再监听 hashChange，原理都是使用history
    let base = location.host ? base || location.pathname + location.search : '';
    if (!base.includes('#')) base += '#';
    this.createWebHistory(base);
  }

  createMap(routes) {
    return routes.reduce((pre, current) => {
      pre[current.path] = current.component;
      return pre;
    }, {});
  }
}
VueRouter.install = function (v) {
  Vue = v;
  Vue.mixin({
    beforeCreate() {
      if (this.$options && this.$options.router) {
        // 如果是根组件
        this._root = this; //把当前实例挂载到_root上
        this._router = this.$options.router;
        Vue.util.defineReactive(this, 'xxx', this._router.history);
      } else {
        //如果是子组件
        this._root = this.$parent && this.$parent._root;
      }
      Object.defineProperty(this, '$router', {
        get() {
          return this._root._router;
        },
      });
      Object.defineProperty(this, '$route', {
        get() {
          return this._root._router.history.current;
        },
      });
    },
  });
  Vue.component('router-link', {
    props: {
      to: String,
    },
    render(h) {
      let mode = this._self._root._router.mode;
      let to = mode === 'hash' ? '#' + this.to : this.to;
      return h('a', { attrs: { href: to } }, this.$slots.default);
    },
  });
  Vue.component('router-view', {
    render(h) {
      let current = this._self._root._router.history.current;
      let routeMap = this._self._root._router.routesMap;
      return h(routeMap[current]);
    },
  });
};

export default VueRouter;