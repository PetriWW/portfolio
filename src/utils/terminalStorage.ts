/**
 * Utility for saving and loading terminal state from localStorage
 */

// Define the terminal state interface
export interface TerminalState {
  fontSize: number;
  commandHistory: string[];
  promptString?: string;
  lastOutput?: string[];
  timestamp: number;
}

// Storage key for the terminal state
const STORAGE_KEY = 'terminal_state';

/**
 * Save the current terminal state to localStorage
 */
export function saveTerminalState(state: TerminalState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
    if (!savedState) return null;
    
    const state = JSON.parse(savedState) as TerminalState;
    
    // Validate the state to ensure it has the expected structure
    if (!state || typeof state !== 'object' || !state.timestamp) {
      return null;
    }
    
    // Check if the state is older than 30 days (in milliseconds)
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - state.timestamp > thirtyDaysMs) {
      // State is too old, clear it and return null
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
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
  } catch (error) {
    console.error('Failed to clear terminal state from localStorage:', error);
  }
}
