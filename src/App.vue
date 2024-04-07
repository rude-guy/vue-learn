<template>
  <div>
    <p>所有事项</p>
    <ul>
      <li v-for="item in $store.state.todos" :key="item.id">
        {{ item.text }}
      </li>
      <li v-if="store.state.loading">loading....</li>
    </ul>
    <p>完成的事项</p>
    <ul>
      <li v-for="item in $store.getters.doneTodos" :key="item.id">
        {{ item.text }}
      </li>
    </ul>
    <input v-model="inputText" type="text" />
    <button @click="add">同步添加</button>
    <button @click="asyncAdd">异步添加</button>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
const inputText = ref('');

const store = useStore();

function add() {
  store.commit('addTodo', inputText.value);
  inputText.value = '';
}

function asyncAdd() {
  store.dispatch('asyncAddTodo', inputText.value);
  inputText.value = '';
}
</script>
