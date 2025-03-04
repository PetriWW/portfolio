<script setup lang="ts">
defineProps<{ msg: string }>()
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="content">
    <p class="terminal-hint">
      <span class="code">Tip:</span> Open the terminal for an interactive experience
    </p>
  </div>
</template>

<style scoped>
h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}

.terminal-hint {
  font-size: 1.1rem;
  color: #888;
  margin-top: 2rem;
}

.code {
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 2px 4px;
  border-radius: 3px;
}
</style>
