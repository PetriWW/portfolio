/**
 * Utility for saving and loading terminal state from localStorage
 */

// Enhanced terminal state interface to store more settings
export interface TerminalState {
  fontSize: number;
  commandHistory: string[];
  promptString?: string;
  lastOutput?: string[];
  theme?: any;  // Store the current terminal theme
  timestamp: number;
}

// Storage key for the terminal state
const STORAGE_KEY = 'terminal_state';

/**
 * Save the current terminal state to localStorage
 */
export function saveTerminalState(state: TerminalState): void {
  try {
    // Remove very long entries from command history (> 500 chars)
    const cleanHistory = state.commandHistory.filter(cmd => cmd.length <= 500);
    
    // Limit history size to 100 entries
    if (cleanHistory.length > 100) {
      cleanHistory.splice(0, cleanHistory.length - 100);
    }
    
    // Create clean state object for storage
    const stateToStore = {
      ...state,
      commandHistory: cleanHistory,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
    console.log('Terminal state saved, history length:', cleanHistory.length);
  } catch (error) {
    console.error('Failed to save terminal state to localStorage:', error);
  }
}

/**
 * Load the terminal state from localStorage
 * @returns The saved terminal state or null if not found
 */
export function loadTerminalState(): TerminalState | null {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (!savedState) {
      console.log('No saved terminal state found'); // Debug logging
      return null;
    }
    
    const state = JSON.parse(savedState) as TerminalState;
    
    // Validate the state to ensure it has the expected structure
    if (!state || typeof state !== 'object' || !state.timestamp) {
      console.log('Invalid saved terminal state'); // Debug logging
      return null;
    }
    
    // Check if the state is older than 30 days (in milliseconds)
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - state.timestamp > thirtyDaysMs) {
      // State is too old, clear it and return null
      localStorage.removeItem(STORAGE_KEY);
      console.log('Terminal state was too old, cleared'); // Debug logging
      return null;
    }
    
    console.log('Terminal state loaded successfully:', state); // Debug logging
    return state;
  } catch (error) {
    console.error('Failed to load terminal state from localStorage:', error);
    return null;
  }
}

/**
 * Clear the saved terminal state from localStorage
 */
export function clearTerminalState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Terminal state cleared'); // Debug logging
  } catch (error) {
    console.error('Failed to clear terminal state from localStorage:', error);
  }
}
