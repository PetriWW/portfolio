<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import '../xterm.css' // Ensure this path is correct
import { handleCommand } from '../utils/terminalCommands' // Ensure this path is correct

const emit = defineEmits<{
  (event: 'exit'): void
}>()
const terminalRef = ref<HTMLDivElement|null>(null)

onMounted(() => {
  if (!terminalRef.value) return

  // Create terminal with settings to match CMD
  const term = new Terminal({
    cursorBlink: true,
    cursorStyle: 'block',
    fontSize: 16, // Increased font size
    fontFamily: 'Consolas, monospace',
    cols: 80,
    rows: 24,
    scrollback: 1000,
    convertEol: true,
    theme: {
      background: '#000000',
      foreground: '#FFFFFF',
      cursor: '#FFFFFF',
      selectionBackground: 'rgba(255, 255, 255, 0.3)'
    }
  })

  term.open(terminalRef.value)
  term.focus()

  // Ensure terminal gets focus on click
  terminalRef.value.addEventListener('click', () => term.focus())

  // Windows CMD-like greeting and prompt
  term.writeln('Welcome to my terminal@olavi.dev')
  term.writeln('This site is currently under construction.')
  term.writeln('Type HELP for a list of available commands.\r\n')
  const PROMPT = 'user@olavi.dev> '
  const PROMPT_LENGTH = PROMPT.length
  term.write(PROMPT)

  let currentCommand = ''
  let isSelected = false

  term.attachCustomKeyEventHandler((ev: KeyboardEvent) => {
    if (ev.ctrlKey && ev.key.toLowerCase() === 'a') {
      ev.preventDefault()
      // Select the entire user input
      const row = term.buffer.active.cursorY
      term.select(PROMPT_LENGTH, row, currentCommand.length)
      isSelected = true
      return false
    }
    if (ev.ctrlKey && ev.key.toLowerCase() === 'v') {
      ev.preventDefault()
      navigator.clipboard.readText().then(text => {
        currentCommand += text
        term.write(text)
      })
      return false
    }
    return true
  })

  term.onData(data => {
    const code = data.charCodeAt(0)
    if (isSelected && (data === '\x7F' || code >= 32)) {
      // If user typed backspace or another key, clear the entire line
      for (let i = 0; i < currentCommand.length; i++) {
        term.write('\b \b')
      }
      currentCommand = ''
      isSelected = false
      // If it's a normal character, append it after clearing
      if (code >= 32) {
        currentCommand += data
        term.write(data)
      }
      return
    }
    if (data === '\r') { // Enter key
      term.writeln('')
      const cmd = currentCommand.trim().toLowerCase()
      handleCommand(cmd, term, emit)
      currentCommand = ''
      term.write(PROMPT)
    }
    else if (data === '\x7F') { // Backspace key
      if (currentCommand.length > 0) {
        if (term.buffer.active.cursorX > PROMPT_LENGTH) {
          currentCommand = currentCommand.slice(0, -1)
          term.write('\b \b')
        }
      }
    }
    else if (code === 27 && data.length > 1) {
      // Ignore arrow keys and escape sequences
    }
    else if (code >= 32) { // Printable characters
      currentCommand += data
      term.write(data)
    }
  })

  // Handle window resize to adjust terminal dimensions
  const resizeHandler = () => {
    if (!terminalRef.value) return
    const width = window.innerWidth
    const height = window.innerHeight
    const fontSize = 16
    const charWidth = fontSize * 0.6  // Approximate character width
    const lineHeight = fontSize * 1.5 // Approximate line height
    const cols = Math.floor(width / charWidth)
    const rows = Math.floor(height / lineHeight)
    if (cols > 10 && rows > 5) {
      term.resize(cols, rows)
    }
  }

  window.addEventListener('resize', resizeHandler)
  setTimeout(resizeHandler, 100)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
  })
})
</script>

<template>
  <div class="terminal-wrapper">
    <div ref="terminalRef" class="terminal-container"></div>
  </div>
</template>

<style scoped>
/* No styles needed here, all styles are in src/xterm.css */
</style>