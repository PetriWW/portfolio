<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Terminal } from '@xterm/xterm'

// Addon imports
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { SearchAddon } from '@xterm/addon-search'
import { WebglAddon } from '@xterm/addon-webgl'
import { ClipboardAddon } from '@xterm/addon-clipboard'
import { ImageAddon } from '@xterm/addon-image'
import { SerializeAddon } from '@xterm/addon-serialize'

import { handleCommand } from '../utils/terminalCommands'
import '../xterm.css'

const terminalElement = ref<HTMLElement | null>(null)
const emit = defineEmits(['exit'])
let terminal: Terminal | null = null

// Create references to addon instances
let fitAddon: FitAddon | null = null
let searchAddon: SearchAddon | null = null
let clipboardAddon: ClipboardAddon | null = null
let serializeAddon: SerializeAddon | null = null

// Terminal state variables
let promptString = 'terminal@olavi.dev> '
let currentLine = ''
let commandHistory: string[] = []
let historyPosition = 0
let fontSize = 16 // Default font size, adjustable

// Initialize keyboard shortcuts for addons - keeping the zoom functionality
const initAddonShortcuts = () => {
  if (!terminal) return;
  
  window.addEventListener('keydown', (ev) => {
    // Ctrl+F for search
    if (ev.ctrlKey && ev.key === 'f' && searchAddon) {
      ev.preventDefault()
      searchAddon.findNext('')
    }
    
    // Zoom in - pass false to hide message
    if (ev.ctrlKey && ev.key === '+') {
      ev.preventDefault()
      setFontSize(fontSize + 1, false) // Don't show message for keyboard shortcut
    }
    
    // Zoom out - pass false to hide message
    if (ev.ctrlKey && ev.key === '-') {
      ev.preventDefault()
      setFontSize(fontSize - 1, false) // Don't show message for keyboard shortcut
    }
  })
}

// Initialize terminal
onMounted(() => {
  if (terminalElement.value) {
    // Create and configure terminal
    terminal = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontSize: 14,
      fontFamily: 'Consolas, monospace',
      theme: {
        background: '#000000',
        foreground: '#ffffff',
        cursor: '#ffffff',
        selectionBackground: 'rgba(255, 255, 255, 0.3)'
      },
      scrollback: 1000,
      allowProposedApi: true
    })

    // Initialize addons
    fitAddon = new FitAddon()
    searchAddon = new SearchAddon()
    clipboardAddon = new ClipboardAddon()
    serializeAddon = new SerializeAddon()
    
    // Load addons into terminal
    terminal.loadAddon(fitAddon)
    terminal.loadAddon(new WebLinksAddon())
    terminal.loadAddon(searchAddon)
    terminal.loadAddon(clipboardAddon)
    terminal.loadAddon(new ImageAddon())
    terminal.loadAddon(serializeAddon)
    
    // Open terminal in the container element
    terminal.open(terminalElement.value)
    
    // Try to load WebGL addon for performance
    try {
      terminal.loadAddon(new WebglAddon())
    } catch (e) {
      console.log('WebGL addon could not be loaded', e)
    }
    
    // Fit terminal to container
    fitAddon.fit()
    
    // Display welcome message
    displayWelcomeMessage()
    
    // Set up keyboard event listeners for terminal input
    terminal.onKey(handleKeyEvent)
    
    // Initialize addon keyboard shortcuts
    initAddonShortcuts()
    
    // Handle terminal resizing
    window.addEventListener('resize', handleResize)
    
    // Focus terminal
    terminal.focus()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (terminal) {
    terminal.dispose()
  }
})

function handleResize() {
  if (fitAddon && terminal) {
    fitAddon.fit()
  }
}

// Terminal content export function
function exportTerminalContent(): string {
  if (!terminal || !serializeAddon) return '';
  return serializeAddon.serialize();
}

function displayWelcomeMessage() {
  if (!terminal) return;
  
  // Standard welcome message
  terminal.writeln('');
  terminal.writeln('Welcome to terminal! [Prototype version]');
  terminal.writeln('');
  terminal.writeln('Type "help" for available commands');
  terminal.writeln('');
  terminal.writeln('Alternatively type "exit" to close the terminal');
  terminal.writeln('');
  terminal.write(promptString);
}

function handleKeyEvent(e: { key: string, domEvent: KeyboardEvent }) {
  if (!terminal) return;
  
  const ev = e.domEvent
  const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey
  
  if (ev.key === 'Enter') {
    // Process the command
    if (currentLine.trim()) {
      commandHistory.push(currentLine)
      historyPosition = commandHistory.length
      
      terminal.write('\r\n')
      handleCommand(currentLine, terminal, (event) => {
        if (event === 'exit') emit('exit')
      })
      currentLine = ''
      terminal.write('\r\n' + promptString)
    } else {
      // Empty command, just show a new prompt
      terminal.writeln('')
      terminal.write(promptString)
    }
  } else if (ev.key === 'Backspace') {
    if (currentLine.length > 0) {
      currentLine = currentLine.slice(0, -1)
      terminal.write('\b \b')
    }
  } else if (ev.key === 'ArrowUp') {
    if (historyPosition > 0) {
      historyPosition--
      clearCurrentLine()
      currentLine = commandHistory[historyPosition]
      terminal.write(currentLine)
    }
  } else if (ev.key === 'ArrowDown') {
    if (historyPosition < commandHistory.length - 1) {
      historyPosition++
      clearCurrentLine()
      currentLine = commandHistory[historyPosition]
      terminal.write(currentLine)
    } else if (historyPosition === commandHistory.length - 1) {
      historyPosition++
      clearCurrentLine()
      currentLine = ''
    }
  } else if (printable) {
    currentLine += e.key
    terminal.write(e.key)
  }
}

function clearCurrentLine() {
  if (!terminal) return;
  
  // Clear the current input line
  terminal.write('\r' + promptString)
  for (let i = 0; i < currentLine.length; i++) {
    terminal.write(' ')
  }
  terminal.write('\r' + promptString)
}

// Function to set font size - keeping this functionality
function setFontSize(size: number, showMessage: boolean = true) {
  if (!terminal) return;
  
  if (size >= 6 && size <= 36) {
    fontSize = size;
    terminal.options.fontSize = fontSize;
    
    if (fitAddon) {
      fitAddon.fit();
    }
    
    // Only show message if explicitly requested (command usage)
    if (showMessage) {
      terminal.writeln(`\r\nFont size set to ${fontSize}px`);
      terminal.write(promptString + currentLine);
    }
  }
}

// Expose functions to be used by other components
defineExpose({
  exportTerminalContent,
  setFontSize
})
</script>

<template>
  <div class="terminal-wrapper">
    <div ref="terminalElement" class="terminal-container"></div>
  </div>
</template>

<style scoped>
.terminal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  z-index: 1000;
}

.terminal-container {
  width: 100%;
  height: 100%;
  padding: 0;
}
</style>

