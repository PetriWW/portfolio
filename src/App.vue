<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Terminal from './components/Terminal.vue'
import HelloWorld from './components/HelloWorld.vue'
import { setTerminalInstance } from './utils/terminalCommands'
import './assets/fonts.css' // Import the fonts CSS file

const showTerminal = ref(true)
const terminalRef = ref(null)

onMounted(() => {
  // Set the terminal instance for command usage
  if (terminalRef.value) {
    setTerminalInstance(terminalRef.value)
  }
})

const handleExit = () => {
  showTerminal.value = false
}

const switchToTerminal = () => {
  showTerminal.value = true
}
</script>

<template>
  <Terminal v-if="showTerminal" ref="terminalRef" @exit="handleExit" />
  <div v-else class="gui-content">
    <div class="header">
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    
    <HelloWorld msg="Portfolio testpage" />
    
    <div class="terminal-button-container">
      <button @click="switchToTerminal" class="terminal-button">
        Open Terminal
      </button>
    </div>
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

.gui-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

.header {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.terminal-button-container {
  margin-top: 2rem;
}

.terminal-button {
  background-color: #333;
  color: white;
  border: 1px solid #555;
  padding: 10px 20px;
  font-family: 'Consolas', monospace;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

.terminal-button:hover {
  background-color: #444;
  border-color: #888;
}

.terminal-button:active {
  transform: translateY(2px);
}
</style>
