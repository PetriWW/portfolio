<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Terminal } from '@xterm/xterm'
import type { IMarker, IDecoration } from '@xterm/xterm'

// Addon imports
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { SearchAddon } from '@xterm/addon-search'
import { WebglAddon } from '@xterm/addon-webgl'
import { ClipboardAddon } from '@xterm/addon-clipboard'
import { ImageAddon } from '@xterm/addon-image'
import { SerializeAddon } from '@xterm/addon-serialize'

import { handleCommand } from '../utils/terminalCommands'
import { loadTerminalState, saveTerminalState } from '../utils/terminalStorage'
import '../xterm.css'

const terminalElement = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const showSearch = ref(false)
const searchText = ref('')
const emit = defineEmits(['exit'])
let terminal: Terminal | null = null

// Create references to addon instances
let fitAddon: FitAddon | null = null
let searchAddon: SearchAddon | null = null
let clipboardAddon: ClipboardAddon | null = null
let serializeAddon: SerializeAddon | null = null

// Reference to store active decorations
const activeDecorations = ref<IDecoration[]>([]);

// Terminal state variables
let promptString = 'terminal@olavi.dev> '
let currentLine = ''
let commandHistory: string[] = []
let historyPosition = 0
let fontSize = 16 // Default font size, adjustable

// Save terminal state to localStorage
function saveState(): void {
  saveTerminalState({
    fontSize,
    commandHistory,
    promptString,
    timestamp: Date.now()
  });
}

// Improved keyboard shortcuts for addons
const initAddonShortcuts = () => {
  if (!terminal) return;
  
  window.addEventListener('keydown', (ev) => {
    // Ctrl+F for search
    if (ev.ctrlKey && ev.key === 'f' && searchAddon) {
      ev.preventDefault()
      // Show search UI instead of directly calling findNext
      showSearch.value = true
      // Focus search input after it becomes visible
      setTimeout(() => {
        if (searchInput.value) {
          searchInput.value.focus()
        }
      }, 10)
    }
    
    // Escape to hide search UI
    if (ev.key === 'Escape' && showSearch.value) {
      showSearch.value = false
      // Return focus to terminal
      if (terminal) {
        terminal.focus()
      }
    }
    
    // Zoom in - pass false to hide message
    if (ev.ctrlKey && ev.key === '+') {
      ev.preventDefault()
      setFontSize(fontSize + 1, false) 
      // Save state after changing font size
      saveState();
    }
    
    // Zoom out - pass false to hide message
    if (ev.ctrlKey && ev.key === '-') {
      ev.preventDefault()
      setFontSize(fontSize - 1, false)
      // Save state after changing font size
      saveState();
    }
  })
}

// Perform search when form is submitted
function performSearch(e: Event) {
  e.preventDefault()
  if (searchAddon && searchText.value) {
    searchAddon.findNext(searchText.value)
  }
}

// Find next occurrence
function findNext() {
  if (searchAddon && searchText.value) {
    searchAddon.findNext(searchText.value)
  }
}

// Find previous occurrence
function findPrevious() {
  if (searchAddon && searchText.value) {
    searchAddon.findPrevious(searchText.value)
  }
}

// Close search UI
function closeSearch() {
  showSearch.value = false
  // Return focus to terminal
  if (terminal) {
    terminal.focus()
  }
}

// Handle Ctrl+Enter to find previous
function handleSearchKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    if (e.shiftKey) {
      // Shift+Enter to find previous
      e.preventDefault()
      findPrevious()
    } else if (!e.ctrlKey) {
      // Just Enter to find next
      e.preventDefault()
      findNext()
    }
  }
}

// Initialize terminal
onMounted(() => {
  // Load saved state from localStorage
  const savedState = loadTerminalState();
  
  // Apply saved settings if available
  if (savedState) {
    fontSize = savedState.fontSize || fontSize;
    commandHistory = savedState.commandHistory || [];
    historyPosition = commandHistory.length;
    
    if (savedState.promptString) {
      promptString = savedState.promptString;
    }
  }
  
  if (terminalElement.value) {
    // Create and configure terminal with saved or default font size
    terminal = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontSize: fontSize, // Use the loaded or default font size
      fontFamily: '"JetBrains Mono", Consolas, monospace', // Update font family here
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
    
    // Display welcome message with restore hint if history exists
    displayWelcomeMessage(commandHistory.length > 0)
    
    // Set up keyboard event listeners for terminal input
    terminal.onKey(handleKeyEvent)
    
    // Initialize addon keyboard shortcuts
    initAddonShortcuts()
    
    // Handle terminal resizing
    window.addEventListener('resize', handleResize)
    
    // Focus terminal
    terminal.focus()
    
    // Save initial state
    saveState()
  }
})

// Save state when the component is unmounted
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  
  // Save the current terminal state before unmounting
  saveState()
  
  // Dispose of any active decorations
  activeDecorations.value.forEach(decoration => {
    if (!decoration.isDisposed) {
      decoration.dispose();
    }
  });
  
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

function displayWelcomeMessage(hasHistory: boolean = false) {
  if (!terminal) return;
  
  // Standard welcome message
  terminal.writeln('');
  terminal.writeln('Welcome to terminal! [Prototype version]');
  terminal.writeln('');
  terminal.writeln('Type "help" for available commands');
  
  // Show history hint if we have saved history
  if (hasHistory) {
    terminal.writeln('');
    terminal.writeln('Your command history has been restored.');
    terminal.writeln('Use the up arrow key to access previous commands.');
  }
  
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
      
      // Save state after executing a command
      saveState()
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

// Updated function with showMessage parameter and state saving
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
    
    // Save the updated font size to localStorage
    saveState();
  }
}

// Add a command to clear saved state
function clearSavedState() {
  if (!terminal) return;
  
  try {
    localStorage.removeItem('terminal_state');
    terminal.writeln('Saved terminal state has been cleared.');
  } catch (error) {
    terminal.writeln('Failed to clear saved state: ' + error);
  }
}

// Function to add a decoration around a marker
function addDecoration(marker: IMarker): void {
  if (!terminal) return;
  
  try {
    // Create a decoration - you can customize these properties
    const decoration = terminal.registerDecoration({
      marker,
      backgroundColor: 'rgba(45, 114, 210, 0.3)',
      width: terminal.cols,  // Full-width decoration
      height: 3,  // Cover 3 lines
      layer: 'bottom'  // Render below selection
    });
    
    if (decoration) {
      // Store the decoration so we don't lose reference
      activeDecorations.value.push(decoration);
      
      // Set up an event for when the decoration is rendered
      decoration.onRender(element => {
        // You can modify the element once it's rendered
        if (element) {
          element.style.borderLeft = '3px solid #4287f5';
          element.style.borderRadius = '3px';
        }
      });
      
      // Optional: Set up a listener for when the decoration is disposed
      decoration.onDispose(() => {
        // Remove from our array when disposed
        const index = activeDecorations.value.indexOf(decoration);
        if (index !== -1) {
          activeDecorations.value.splice(index, 1);
        }
      });
    }
  } catch (error) {
    console.error('Error creating decoration:', error);
    if (terminal) {
      terminal.writeln('Error creating decoration: ' + error);
    }
  }
}

// Function to set theme
function setTheme(theme: any): void {
  if (!terminal) return;
  
  terminal.options.theme = theme;
  
  // Save theme preference to localStorage
  saveState();
}

// Function to perform search
function searchFor(text: string): void {
  if (!searchAddon || !text) return;
  
  searchText.value = text;
  showSearch.value = true;
  setTimeout(() => {
    if (searchInput.value) {
      searchInput.value.focus();
      searchAddon.findNext(text);
    }
  }, 10);
}

// Function to manually fit terminal
function fit(): void {
  if (fitAddon) {
    fitAddon.fit();
  }
}

// Expose functions to be used by other components
defineExpose({
  exportTerminalContent,
  setFontSize,
  clearSavedState,
  addDecoration,
  setTheme,
  searchFor,
  fit
})
</script>

<template>
  <div class="terminal-wrapper">
    <div ref="terminalElement" class="terminal-container"></div>
    
    <!-- Search UI -->
    <div v-if="showSearch" class="search-ui">
      <form @submit="performSearch" class="search-form">
        <input 
          ref="searchInput"
          v-model="searchText" 
          @keydown="handleSearchKeydown"
          type="text" 
          placeholder="Search..." 
          class="search-input"
        />
        <div class="search-buttons">
          <button type="button" @click="findPrevious" class="search-btn" title="Previous (Shift+Enter)">
            ↑
          </button>
          <button type="submit" class="search-btn" title="Next (Enter)">
            ↓
          </button>
          <button type="button" @click="closeSearch" class="close-btn" title="Close (Esc)">
            ×
          </button>
        </div>
      </form>
    </div>
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

.search-ui {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #333;
  padding: 8px;
  border-radius: 4px;
  z-index: 2000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.search-form {
  display: flex;
  align-items: center;
}

.search-input {
  background-color: #222;
  color: white;
  border: 1px solid #555;
  padding: 6px 10px;
  border-radius: 3px;
  font-family: 'JetBrains Mono', Consolas, monospace;
  min-width: 200px;
}

.search-buttons {
  display: flex;
  margin-left: 5px;
}

.search-btn, .close-btn {
  background-color: #444;
  color: white;
  border: 1px solid #555;
  border-radius: 3px;
  padding: 5px 10px;
  margin-left: 2px;
  cursor: pointer;
  font-family: 'JetBrains Mono', Consolas, monospace;
}

.search-btn:hover, .close-btn:hover {
  background-color: #666;
}

.close-btn {
  font-size: 16px;
  line-height: 1;
  padding: 5px 8px;
}
</style>

