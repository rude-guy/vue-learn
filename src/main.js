import { createApp } from 'vue';
import { createStore } from '../vue-store';
import App from './App.vue';
const store = createStore({
  state() {
    return {
      loading: false,
      todos: [
        { id: 1, text: '今天要做的事情', done: true },
        { id: 2, text: '明天要做的事情', done: false },
      ],
    };
  },
  getters: {
    doneTodos(state) {
      return state.todos.filter((todo) => todo.done);
    },
  },
  actions: {
    asyncAddTodo(context, payload) {
      context.commit('setLoading', true);
      setTimeout(() => {
        context.commit('addTodo', payload);
        context.commit('setLoading', false);
      }, 1000);
    },
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    addTodo(state, payload) {
      // 添加一个 todo 到列表
      state.todos.push({ id: Date.now(), text: payload, done: false });
    },
  },
});

createApp(App).use(store).mount('#app');
