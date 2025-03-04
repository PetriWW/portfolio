import { Terminal } from '@xterm/xterm'

// Update the emit type to be more specific (only accepting 'exit')
export function handleCommand(cmd: string, term: Terminal, emit: (event: 'exit') => void) {
  switch (cmd) {
    case 'exit':
      term.writeln('Switching to GUI mode...')
      setTimeout(() => emit('exit'), 800)
      break
    case 'cls':
      term.clear()
      break
    case 'help':
      term.writeln('Available commands:')
      term.writeln('  exit       - Switch to GUI mode')
      term.writeln('  cls        - Clear terminal screen')
      term.writeln('  help       - Show this help message')
      break
    default:
      term.writeln(`'${cmd}' is not recognized as an internal or external command.`)
      break
  }
}
