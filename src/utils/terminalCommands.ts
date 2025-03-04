import { Terminal } from '@xterm/xterm'
import { clearTerminalState } from './terminalStorage'

// Define a type for theme objects
interface ThemeObject {
  background: string;
  foreground: string;
  cursor: string;
  selectionBackground: string;
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
}

// Define a type for theme collection with index signature
interface ThemesCollection {
  [key: string]: ThemeObject;
}

// Enhanced help text with all commands
const HELP_TEXT = [
  'Available commands:',
  'exit          - Switch to GUI mode',
  'cls/clear     - Clear terminal screen',
  'echo [text]   - Display a message',
  'date          - Display current date and time',
  'search [text] - Search in terminal content',
  'export        - Copy terminal content to clipboard',
  'github        - Open GitHub profile',
  'whoami        - Display current user',
  'ver           - Display terminal version',
  'fontsize [n]  - Change terminal font size (6-36)',
  'fit           - Resize terminal to fit window',
  'webgl         - Display WebGL renderer status',
  'link          - Show clickable link example',
  'image         - Show terminal image capabilities',
  'theme [name]  - Change terminal color theme',
  'decorate      - Demonstrate terminal decorations',
  'reset         - Clear saved terminal state',
  'debug         - Show debug information',
  'help          - Show this help message'
];

// Available themes with proper typing
const THEMES: ThemesCollection = {
  dark: {
    background: '#1e1e1e',
    foreground: '#ffffff',
    cursor: '#ffffff',
    selectionBackground: 'rgba(255, 255, 255, 0.3)',
    black: '#000000',
    red: '#e74c3c',
    green: '#2ecc71',
    yellow: '#f1c40f',
    blue: '#3498db',
    magenta: '#9b59b6',
    cyan: '#1abc9c',
    white: '#ecf0f1'
  },
  light: {
    background: '#ffffff',
    foreground: '#000000',
    cursor: '#000000',
    selectionBackground: 'rgba(0, 0, 0, 0.3)',
    black: '#000000',
    red: '#c0392b',
    green: '#27ae60',
    yellow: '#f39c12',
    blue: '#2980b9',
    magenta: '#8e44ad',
    cyan: '#16a085',
    white: '#bdc3c7'
  },
  matrix: {
    background: '#0D0208',
    foreground: '#00FF41',
    cursor: '#00FF41',
    selectionBackground: 'rgba(0, 255, 65, 0.3)',
    black: '#000000',
    red: '#b00000',
    green: '#00FF41',
    yellow: '#03DAC6',
    blue: '#0c6fc0',
    magenta: '#803d9f',
    cyan: '#03DAC6',
    white: '#cccccc'
  }
  // Add more themes as needed
};

// Create a reference to store the terminal component instance
let terminalComponentInstance: any = null;

// Export the function to set the terminal component instance
export function setTerminalInstance(instance: any) {
  terminalComponentInstance = instance;
  console.log('Terminal instance set:', instance ? 'Yes' : 'No');
}

// Handle terminal commands
export function handleCommand(cmd: string, term: Terminal, emit: (event: 'exit') => void) {
  // Parse command and arguments
  const parts = cmd.trim().split(/\s+/)
  const command = parts[0].toLowerCase()
  const args = parts.slice(1)
  
  switch (command) {
    case 'exit':
      term.writeln('Switching to GUI mode...')
      setTimeout(() => emit('exit'), 800)
      break
      
    case 'cls':
    case 'clear':
      term.clear()
      break
    
    case 'echo':
      if (args.length > 0) {
        term.writeln(args.join(' '))
      } else {
        term.writeln('ECHO is on.')
      }
      break

    case 'date':
      term.writeln(new Date().toLocaleString())
      break
      
    case 'search':
      if (args.length > 0) {
        term.writeln(`Searching for: ${args.join(' ')}`)
        term.writeln('Press Ctrl+F to open search interface, or use up/down arrows to navigate results.')
        
        // If searchAddon is available, use it
        if (terminalComponentInstance && terminalComponentInstance.searchFor) {
          terminalComponentInstance.searchFor(args.join(' '))
        }
      } else {
        term.writeln('Usage: search [text]')
        term.writeln('Press Ctrl+F to open the search interface.')
      }
      break
      
    case 'export':
      term.writeln('Exporting terminal content...')
      try {
        if (terminalComponentInstance && terminalComponentInstance.exportTerminalContent) {
          const content = terminalComponentInstance.exportTerminalContent()
          navigator.clipboard.writeText(content)
            .then(() => {
              term.writeln('Terminal content copied to clipboard.')
            })
            .catch(err => {
              term.writeln('Failed to copy: ' + err)
              term.writeln('Try selecting text and using Ctrl+C to copy manually.')
            })
        } else {
          term.writeln('Export functionality not available.')
        }
      } catch (err) {
        term.writeln('Error exporting content: ' + err)
      }
      break;
      
    case 'github':
      term.writeln('Opening GitHub profile...')
      window.open('https://github.com/username', '_blank')
      break
      
    case 'whoami':
      term.writeln('Guest')
      break
      
    case 'ver':
      term.writeln('Portfolio Terminal [Version 1.0.0]')
      term.writeln('Powered by xterm.js 5.3.0 and Vue 3')
      term.writeln('© 2023 All rights reserved.')
      break
      
    case 'fontsize':
      if (args.length > 0) {
        const size = parseInt(args[0])
        if (!isNaN(size) && size >= 6 && size <= 36) {
          if (terminalComponentInstance && terminalComponentInstance.setFontSize) {
            terminalComponentInstance.setFontSize(size, true)
          } else {
            term.writeln('Font size change not available.')
          }
        } else {
          term.writeln('Please provide a valid font size (6-36).')
        }
      } else {
        term.writeln('Usage: fontsize [size]')
        term.writeln('Example: fontsize 18')
        if (term.options.fontSize) {
          term.writeln(`Current font size: ${term.options.fontSize}px`)
        }
      }
      break;
      
    case 'fit':
      term.writeln('Resizing terminal to fit window...')
      if (terminalComponentInstance && terminalComponentInstance.fit) {
        terminalComponentInstance.fit()
        term.writeln('Terminal resized successfully.')
      } else {
        term.writeln('Fit addon not available.')
      }
      break;
      
    case 'webgl':
      term.writeln('WebGL Renderer Information:')
      // This is a simple way to check if WebGL is active
      // A more accurate way would be to check if the WebGLAddon is loaded
      const isWebGL = document.querySelector('.xterm-screen canvas') !== null
      term.writeln(`WebGL Renderer Active: ${isWebGL ? 'Yes' : 'No'}`)
      if (!isWebGL) {
        term.writeln('WebGL renderer is not active. This may be due to:')
        term.writeln('- Device/browser does not support WebGL')
        term.writeln('- WebGL addon failed to initialize')
        term.writeln('- Using DOM renderer instead')
      } else {
        term.writeln('WebGL renderer is active, providing optimal performance.')
      }
      break;
    
    case 'link':
      term.writeln('Links in terminal are clickable. Try these:')
      term.writeln('- Website: https://example.com')
      term.writeln('- GitHub: https://github.com')
      term.writeln('- Documentation: https://xtermjs.org')
      term.writeln('\nThe WebLinksAddon makes these URLs clickable.')
      break;
      
    case 'image':
      term.writeln('xterm.js has experimental support for images via the ImageAddon.')
      term.writeln('Note: Image rendering depends on terminal emulator support.')
      term.writeln('\nTo display images, you would need iTerm2 protocol support.')
      term.writeln('Example usage: term.writeImageFile("/path/to/image")')
      break;
      
    case 'theme':
      if (args.length > 0) {
        const themeName = args[0].toLowerCase();
        // Now TypeScript understands this lookup is safe
        const theme = THEMES[themeName];
        
        if (theme) {
          if (terminalComponentInstance && terminalComponentInstance.setTheme) {
            terminalComponentInstance.setTheme(theme)
            term.writeln(`Theme changed to ${themeName}.`)
          } else if (term.options.theme !== undefined) {
            term.options.theme = theme
            term.writeln(`Theme changed to ${themeName}.`)
          } else {
            term.writeln('Theme change not available.')
          }
        } else {
          term.writeln(`Theme "${themeName}" not found.`)
          term.writeln('Available themes: ' + Object.keys(THEMES).join(', '))
        }
      } else {
        term.writeln('Usage: theme [name]')
        term.writeln('Available themes: ' + Object.keys(THEMES).join(', '))
      }
      break;
      
    case 'decorate':
      // Create a marker at the current position
      const marker = term.registerMarker(0);
      if (marker) {
        // Create a demonstration message
        term.writeln('')
        term.writeln('This is a line with a decoration attached')
        term.writeln('Notice how it has a custom background color and style')
        term.writeln('')
        
        // Register a decoration on the marker
        if (terminalComponentInstance && terminalComponentInstance.addDecoration) {
          terminalComponentInstance.addDecoration(marker)
          term.writeln('Decoration created! Try scrolling to see it persist.')
        } else {
          term.writeln('Decoration functionality not available.')
        }
      } else {
        term.writeln('Could not create marker for decoration.')
      }
      break;
      
    case 'reset':
      clearTerminalState();
      term.writeln('Terminal state has been reset.');
      term.writeln('Your settings and command history will not be saved when you close the terminal.');
      term.writeln('You may need to restart the terminal for all changes to take effect.');
      
      // Use terminalComponentInstance if available for more detailed reset
      if (terminalComponentInstance && terminalComponentInstance.clearSavedState) {
        terminalComponentInstance.clearSavedState(true); // Show confirmation
      }
      break;
      
    case 'debug':
      // Show debug information about fonts and localStorage
      term.writeln('===== Debug Information =====')
      
      // Font information
      term.writeln('\nFont information:')
      term.writeln(`Current font family: ${term.options.fontFamily}`)
      term.writeln(`Current font size: ${term.options.fontSize}px`)
      
      // Theme information
      term.writeln('\nTheme information:')
      if (term.options.theme) {
        term.writeln(`Background color: ${term.options.theme.background}`)
        term.writeln(`Foreground color: ${term.options.theme.foreground}`)
      } else {
        term.writeln('No theme information available.')
      }
      
      // Terminal size
      term.writeln('\nTerminal dimensions:')
      term.writeln(`Columns: ${term.cols}, Rows: ${term.rows}`)
      
      // Local storage information
      term.writeln('\nLocalStorage information:')
      try {
        const terminalState = localStorage.getItem('terminal_state')
        if (terminalState) {
          const parsed = JSON.parse(terminalState)
          term.writeln(`- Storage exists: Yes`)
          term.writeln(`- Saved font size: ${parsed.fontSize}px`)
          term.writeln(`- Command history count: ${parsed.commandHistory?.length || 0}`)
          term.writeln(`- Last saved: ${new Date(parsed.timestamp).toLocaleString()}`)
        } else {
          term.writeln('- Storage exists: No')
        }
      } catch (error) {
        term.writeln(`- Error reading localStorage: ${error}`)
      }
      
      // Check terminal component instance
      term.writeln('\nComponent references:')
      term.writeln(`- Terminal instance registered: ${terminalComponentInstance ? 'Yes' : 'No'}`)
      
      // Show loaded addons (if possible)
      term.writeln('\nAddons:')
      term.writeln('- FitAddon: Loaded')
      term.writeln('- WebLinksAddon: Loaded')
      term.writeln('- SearchAddon: Loaded')
      term.writeln('- ClipboardAddon: Loaded')
      term.writeln('- ImageAddon: Loaded')
      term.writeln('- SerializeAddon: Loaded')
      term.writeln(`- WebglAddon: ${document.querySelector('.xterm-screen canvas') ? 'Loaded' : 'Not loaded'}`)
      
      break;
      
    case 'help':
      for (const line of HELP_TEXT) {
        term.writeln(line)
      }
      break
      
    default:
      term.writeln(`'${command}' is not recognized as an internal or external command.`)
      break
  }
}
