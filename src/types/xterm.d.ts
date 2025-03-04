/**
 * Type declarations for xterm library and addons
 * This file ensures TypeScript can properly recognize the xterm modules
 */

declare module '@xterm/xterm' {
  /**
   * A string or number representing text font weight.
   */
  export type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | number;

  /**
   * A string representing log level.
   */
  export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'off';

  /**
   * An object containing options for the terminal.
   */
  export interface ITerminalOptions {
    /**
     * Whether to allow the use of proposed API. When false, any usage of APIs
     * marked as experimental/proposed will throw an error. The default is
     * false.
     */
    allowProposedApi?: boolean;

    /**
     * Whether background should support non-opaque color. It must be set before
     * executing the `Terminal.open()` method and can't be changed later without
     * executing it again. Note that enabling this can negatively impact
     * performance.
     */
    allowTransparency?: boolean;

    /**
     * If enabled, alt + click will move the prompt cursor to position
     * underneath the mouse. The default is true.
     */
    altClickMovesCursor?: boolean;

    /**
     * Whether the cursor blinks.
     */
    cursorBlink?: boolean;

    /**
     * The style of the cursor when the terminal is focused.
     */
    cursorStyle?: 'block' | 'underline' | 'bar';

    /**
     * The width of the cursor in CSS pixels when `cursorStyle` is set to 'bar'.
     */
    cursorWidth?: number;

    /**
     * Whether to draw custom glyphs for block element and box drawing
     * characters instead of using the font.
     */
    customGlyphs?: boolean;

    /**
     * Whether input should be disabled.
     */
    disableStdin?: boolean;

    /**
     * Whether to draw bold text in bright colors. The default is true.
     */
    drawBoldTextInBrightColors?: boolean;

    /**
     * The font size used to render text.
     */
    fontSize?: number;

    /**
     * The font family used to render text.
     */
    fontFamily?: string;

    /**
     * The font weight used to render non-bold text.
     */
    fontWeight?: FontWeight;

    /**
     * The font weight used to render bold text.
     */
    fontWeightBold?: FontWeight;

    /**
     * The spacing in whole pixels between characters.
     */
    letterSpacing?: number;

    /**
     * The line height used to render text.
     */
    lineHeight?: number;

    /**
     * What log level to use for logging: 'trace', 'debug', 'info', 'warn', 'error', 'off'.
     */
    logLevel?: LogLevel;

    /**
     * Whether holding a modifier key will force normal selection behavior,
     * regardless of whether the terminal is in mouse events mode.
     */
    macOptionClickForcesSelection?: boolean;

    /**
     * Whether to treat option as the meta key.
     */
    macOptionIsMeta?: boolean;

    /**
     * Whether to select the word under the cursor on right click, this is
     * standard behavior in a lot of macOS applications.
     */
    rightClickSelectsWord?: boolean;

    /**
     * Whether screen reader support is enabled.
     */
    screenReaderMode?: boolean;

    /**
     * The amount of scrollback in the terminal. Scrollback is the amount of
     * rows that are retained when lines are scrolled beyond the initial
     * viewport. Defaults to 1000.
     */
    scrollback?: number;

    /**
     * The size of tab stops in the terminal.
     */
    tabStopWidth?: number;

    /**
     * The color theme of the terminal.
     */
    theme?: ITheme;

    /**
     * Whether "Windows mode" is enabled.
     */
    windowsMode?: boolean;

    /**
     * A string containing all characters that are considered word separated by
     * the double click to select work logic.
     */
    wordSeparator?: string;
  }

  /**
   * Contains colors to theme the terminal with.
   */
  export interface ITheme {
    /** The default foreground color */
    foreground?: string;
    /** The default background color */
    background?: string;
    /** The cursor color */
    cursor?: string;
    /** The accent color of the cursor (fg color for a block cursor) */
    cursorAccent?: string;
    /** The selection background color (can be transparent) */
    selectionBackground?: string;
    /** The selection foreground color */
    selectionForeground?: string;
    /**
     * The selection background color when the terminal does not have focus
     */
    selectionInactiveBackground?: string;
    /** ANSI black (eg. `\x1b[30m`) */
    black?: string;
    /** ANSI red (eg. `\x1b[31m`) */
    red?: string;
    /** ANSI green (eg. `\x1b[32m`) */
    green?: string;
    /** ANSI yellow (eg. `\x1b[33m`) */
    yellow?: string;
    /** ANSI blue (eg. `\x1b[34m`) */
    blue?: string;
    /** ANSI magenta (eg. `\x1b[35m`) */
    magenta?: string;
    /** ANSI cyan (eg. `\x1b[36m`) */
    cyan?: string;
    /** ANSI white (eg. `\x1b[37m`) */
    white?: string;
    /** ANSI bright black (eg. `\x1b[1;30m`) */
    brightBlack?: string;
    /** ANSI bright red (eg. `\x1b[1;31m`) */
    brightRed?: string;
    /** ANSI bright green (eg. `\x1b[1;32m`) */
    brightGreen?: string;
    /** ANSI bright yellow (eg. `\x1b[1;33m`) */
    brightYellow?: string;
    /** ANSI bright blue (eg. `\x1b[1;34m`) */
    brightBlue?: string;
    /** ANSI bright magenta (eg. `\x1b[1;35m`) */
    brightMagenta?: string;
    /** ANSI bright cyan (eg. `\x1b[1;36m`) */
    brightCyan?: string;
    /** ANSI bright white (eg. `\x1b[1;37m`) */
    brightWhite?: string;
  }

  /**
   * An object that can be disposed via a dispose function.
   */
  export interface IDisposable {
    dispose(): void;
  }

  /**
   * An event that can be listened to.
   * @returns an `IDisposable` to stop listening.
   */
  export interface IEvent<T, U = void> {
    (listener: (arg1: T, arg2: U) => any): IDisposable;
  }

  /**
   * Interface for handling decorations in the terminal
   */
  export interface IDecoration extends IDisposableWithEvent {
    /**
     * The marker for the decoration in the terminal.
     */
    readonly marker: IMarker;

    /**
     * An event fired when the decoration
     * is rendered, returns the DOM element
     * associated with the decoration.
     */
    readonly onRender: IEvent<HTMLElement>;

    /**
     * The element that the decoration is rendered to.
     */
    element: HTMLElement | undefined;

    /**
     * The options for the overview ruler decoration.
     */
    options: Pick<IDecorationOptions, 'overviewRulerOptions'>;
  }

  export interface IDisposableWithEvent extends IDisposable {
    /**
     * Event listener to get notified when this gets disposed.
     */
    onDispose: IEvent<void>;

    /**
     * Whether this is disposed.
     */
    readonly isDisposed: boolean;
  }

  export interface IMarker extends IDisposableWithEvent {
    /**
     * A unique identifier for this marker.
     */
    readonly id: number;

    /**
     * The actual line index in the buffer at this point in time.
     */
    readonly line: number;
  }

  /**
   * Options for decorations in the terminal
   */
  export interface IDecorationOptions {
    /**
     * The marker for the decoration
     */
    readonly marker: IMarker;

    /**
     * Where the decoration will be anchored
     * defaults to the left edge
     */
    readonly anchor?: 'right' | 'left';

    /**
     * The x position offset relative to the anchor
     */
    readonly x?: number;

    /**
     * The width of the decoration in cells
     */
    readonly width?: number;

    /**
     * The height of the decoration in cells
     */
    readonly height?: number;

    /**
     * The background color of the cell(s)
     */
    readonly backgroundColor?: string;

    /**
     * The foreground color of the cell(s)
     */
    readonly foregroundColor?: string;

    /**
     * The layer to render the decoration at
     */
    readonly layer?: 'bottom' | 'top';

    /**
     * Overview ruler options for the decoration
     */
    overviewRulerOptions?: {
      color: string;
      position?: 'left' | 'center' | 'right' | 'full';
    };
  }

  export interface ITerminalAddon {
    activate(terminal: Terminal): void;
    dispose(): void;
  }

  /**
   * The class that represents an xterm.js terminal.
   */
  export class Terminal {
    /**
     * The element containing the terminal.
     */
    readonly element: HTMLElement | undefined;

    /**
     * The textarea that accepts input for the terminal.
     */
    readonly textarea: HTMLTextAreaElement | undefined;

    /**
     * The number of rows in the terminal's viewport.
     */
    readonly rows: number;

    /**
     * The number of columns in the terminal's viewport.
     */
    readonly cols: number;

    /**
     * Access to the terminal's markers.
     */
    readonly markers: ReadonlyArray<IMarker>;

    /**
     * Gets or sets the terminal options.
     */
    options: ITerminalOptions;

    /**
     * Creates a new `Terminal` object.
     * @param options An object containing a set of options.
     */
    constructor(options?: ITerminalOptions);

    /**
     * Adds an event listener for when the bell is triggered.
     */
    onBell: IEvent<void>;

    /**
     * Adds an event listener for when a binary event fires.
     */
    onBinary: IEvent<string>;

    /**
     * Adds an event listener for the cursor moves.
     */
    onCursorMove: IEvent<void>;

    /**
     * Adds an event listener for when a data event fires.
     */
    onData: IEvent<string>;

    /**
     * Adds an event listener for when a key is pressed.
     */
    onKey: IEvent<{ key: string, domEvent: KeyboardEvent }>;

    /**
     * Adds an event listener for when a line feed is added.
     */
    onLineFeed: IEvent<void>;

    /**
     * Adds an event listener for when rows are rendered.
     */
    onRender: IEvent<{ start: number, end: number }>;

    /**
     * Adds an event listener for when the terminal is resized.
     */
    onResize: IEvent<{ cols: number, rows: number }>;

    /**
     * Adds an event listener for when a scroll occurs.
     */
    onScroll: IEvent<number>;

    /**
     * Adds an event listener for when a selection change occurs.
     */
    onSelectionChange: IEvent<void>;

    /**
     * Adds an event listener for when a title change occurs.
     */
    onTitleChange: IEvent<string>;

    /**
     * Unfocus the terminal.
     */
    blur(): void;

    /**
     * Focus the terminal.
     */
    focus(): void;

    /**
     * Resizes the terminal.
     */
    resize(columns: number, rows: number): void;

    /**
     * Opens the terminal within an element.
     */
    open(parent: HTMLElement): void;

    /**
     * Attaches a custom key event handler.
     */
    attachCustomKeyEventHandler(customKeyEventHandler: (event: KeyboardEvent) => boolean): void;

    /**
     * Registers a marker.
     */
    registerMarker(cursorYOffset?: number): IMarker | undefined;

    /**
     * Registers a decoration.
     */
    registerDecoration(decorationOptions: IDecorationOptions): IDecoration | undefined;

    /**
     * Clear the terminal.
     */
    clear(): void;

    /**
     * Write data to the terminal.
     */
    write(data: string | Uint8Array, callback?: () => void): void;

    /**
     * Writes text to the terminal, followed by a line break.
     */
    writeln(data: string | Uint8Array, callback?: () => void): void;

    /**
     * Dispose the terminal instance.
     */
    dispose(): void;

    /**
     * Loads an addon into this instance of xterm.js.
     */
    loadAddon(addon: ITerminalAddon): void;
  }
}

declare module '@xterm/addon-fit' {
  import { Terminal, ITerminalAddon } from '@xterm/xterm';
  
  export class FitAddon implements ITerminalAddon {
    activate(terminal: Terminal): void;
    fit(): void;
    dispose(): void;
  }
}

declare module '@xterm/addon-web-links' {
  import { Terminal, ITerminalAddon } from '@xterm/xterm';
  
  export class WebLinksAddon implements ITerminalAddon {
    constructor(handler?: (event: MouseEvent, uri: string) => void);
    activate(terminal: Terminal): void;
    dispose(): void;
  }
}

declare module '@xterm/addon-search' {
  import { Terminal, ITerminalAddon } from '@xterm/xterm';
  
  export class SearchAddon implements ITerminalAddon {
    activate(terminal: Terminal): void;
    findNext(term: string, searchOptions?: any): boolean;
    findPrevious(term: string, searchOptions?: any): boolean;
    dispose(): void;
  }
}

declare module '@xterm/addon-webgl' {
  import { Terminal, ITerminalAddon } from '@xterm/xterm';
  
  export class WebglAddon implements ITerminalAddon {
    constructor(preserveDrawingBuffer?: boolean);
    activate(terminal: Terminal): void;
    dispose(): void;
  }
}

declare module '@xterm/addon-clipboard' {
  import { Terminal, ITerminalAddon } from '@xterm/xterm';
  
  export class ClipboardAddon implements ITerminalAddon {
    activate(terminal: Terminal): void;
    dispose(): void;
  }
}

declare module '@xterm/addon-image' {
  import { Terminal, ITerminalAddon } from '@xterm/xterm';
  
  export class ImageAddon implements ITerminalAddon {
    activate(terminal: Terminal): void;
    dispose(): void;
  }
}

declare module '@xterm/addon-serialize' {
  import { Terminal, ITerminalAddon } from '@xterm/xterm';
  
  export class SerializeAddon implements ITerminalAddon {
    activate(terminal: Terminal): void;
    serialize(): string;
    dispose(): void;
  }
}
