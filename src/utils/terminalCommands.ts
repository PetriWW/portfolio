import { Terminal } from '@xterm/xterm'
// Remove unused imports
// import { writeWithFadeIn } from './terminalEffects'

// Fix the help text formatting - use consistent spacing and no special characters
const HELP_TEXT = [
  'Available commands:',
  'exit          - Switch to GUI mode',
  'cls           - Clear terminal screen',
  'echo          - Display a message',
  'date          - Display the current date and time',
  'search        - Search terminal content for text',
  'export        - Export terminal content',
  'github        - Open GitHub profile',
  'whoami        - Display current user',
  'ver           - Display terminal version information',
  'fontsize      - Change terminal font size',
  'help          - Show this help message'
];

// Create a reference to store the terminal component instance
let terminalComponentInstance: any = null;

// Function to set the terminal component instance
export function setTerminalInstance(instance: any) {
  terminalComponentInstance = instance;
}

// Update the emit type to be more specific (only accepting 'exit')
export async function handleCommand(cmd: string, term: Terminal, emit: (event: 'exit') => void) {
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
        term.writeln('Press Ctrl+F to open search or use search with keywords')
      } else {
        term.writeln('Usage: search [keywords]')
      }
      break
    
    case 'export':
      term.writeln('Exporting terminal content...')
      try {
        if (terminalComponentInstance && terminalComponentInstance.exportTerminalContent) {
          const content = terminalComponentInstance.exportTerminalContent()
          navigator.clipboard.writeText(content)
            .then(() => {
              term.writeln('Terminal content copied to clipboard')
            })
            .catch(err => {
              term.writeln('Failed to copy: ' + err)
              term.writeln('Try selecting text and using Ctrl+C to copy manually')
            })
        } else {
          term.writeln('Export functionality not available')
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
      term.writeln('Powered by xterm.js and Vue 3')
      break
    
    case 'fontsize':
      if (args.length > 0) {
        const size = parseInt(args[0])
        if (!isNaN(size) && size > 0 && size < 100) {
          if (terminalComponentInstance && terminalComponentInstance.setFontSize) {
            terminalComponentInstance.setFontSize(size)
            term.writeln(`Font size set to ${size}px`)
          } else {
            term.writeln('Font size change not available')
          }
        } else {
          term.writeln('Please provide a valid font size (1-99)')
        }
      } else {
        term.writeln('Usage: fontsize [size]')
        term.writeln('Example: fontsize 18')
      }
      break;
    
    case 'help':
      // Write help text line by line, without any special effects
      for (const line of HELP_TEXT) {
        term.writeln(line);
      }
      break
    
    default:
      term.writeln(`'${command}' is not recognized as an internal or external command.`)
      break
  }
}
