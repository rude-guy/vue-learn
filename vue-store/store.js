import { reactive } from 'vue';

export const storyKey = Symbol('story-vue');

export function createStore(options) {
  return new Store(options);
}

class Store {
  constructor(options = {}) {
    this.initState(options);
    this.initGetters(options);
    this.initMutations(options);
    this.initActions(options);
  }

  // 异步提交
  initActions(options) {
    let actions = options.actions || {};
    this.actions = {};
    Object.keys(actions).forEach((key) => {
      this.actions[key] = (payload) => {
        actions[key](this, payload);
      };
    });
    // 注册dispatch方法
    this.dispatch = (type, payload) => {
      this.actions[type](payload);
    };
  }

  // 同步提交
  initMutations(options) {
    let mutations = options.mutations || {};
    this.mutations = {};
    Object.keys(mutations).forEach((key) => {
      this.mutations[key] = (payload) => {
        mutations[key](this.state, payload);
      };
    });
    // 注册commit方法
    this.commit = (type, payload) => {
      this.mutations[type](payload);
    };
  }

  initState(options) {
    const rawState = options.state;
    const state = (typeof rawState === 'function' ? rawState() : rawState) || {};
    this._state = reactive({
      data: state,
    });
    // 拦截state
    Object.defineProperty(this, 'state', {
      get: () => this._state.data,
    });
  }
  initGetters(options) {
    const getters = options.getters || {};
    // 初始化getters对象。getters和this.getters不相同 getters主要用于获取，this.getters主要用于拦截get操作
    this.getters = {};
    Object.keys(getters).forEach((getter) => {
      Object.defineProperty(this.getters, getter, {
        get: () => getters[getter](this.state),
      });
    });
  }
  install(app) {
    // provide全局store
    app.provide(storyKey, this);
    // 全局挂载
    app.config.globalProperties.$store = this;
  }
}
