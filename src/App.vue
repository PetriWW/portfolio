<script setup lang="ts">
import { ref } from 'vue'
import Terminal from './components/Terminal.vue'
import HelloWorld from './components/HelloWorld.vue'

const showTerminal = ref(true)
const handleExit = () => {
  showTerminal.value = false
}
</script>

<template>
  <Terminal v-if="showTerminal" @exit="handleExit" />
  <div v-else class="gui-content">
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <HelloWorld msg="Vite + Vue" />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
