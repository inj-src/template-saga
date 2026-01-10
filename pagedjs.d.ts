/**
 * TypeScript type definitions for pagedjs
 * @see https://pagedmedia.org
 */

// ============================================================================
// Hook System
// ============================================================================

declare module "pagedjs" {


   /**
    * A hook that allows registering callbacks to be executed at specific points.
    */
   export interface Hook<T = unknown> {
      /**
       * Register a callback function for this hook.
       */
      register(callback: (...args: unknown[]) => T | Promise<T>): void;

      /**
       * Trigger all registered callbacks with the provided arguments.
       */
      trigger(...args: unknown[]): Promise<T[]>;
   }

   // ============================================================================
   // Chunker
   // ============================================================================

   export interface ChunkerHooks {
      beforeParsed: Hook;
      filter: Hook;
      afterParsed: Hook;
      beforePageLayout: Hook;
      onPageLayout: Hook;
      afterPageLayout: Hook;
      finalizePage: Hook;
      afterRendered: Hook;
      onOverflow: Hook;
      onUnderflow: Hook;
      onBreakToken: Hook;
      beforeRenderResult: Hook;
      afterOverflowRemoved: Hook;
      layoutNode: Hook;
      renderNode: Hook;
   }

   export interface ChunkerSettings {
      /** Maximum number of pages to render */
      maxPages?: number;
      /** Enable layout debugging */
      debug?: boolean;
   }

   export interface Page {
      /** Page number (1-indexed) */
      position: number;
      /** The page element */
      element: HTMLElement;
      /** Page ID */
      id: string;
      /** Page width in pixels */
      width: number;
      /** Page height in pixels */
      height: number;
   }

   /**
    * The Chunker class is responsible for processing and paginating HTML content
    * into individual page layouts. It manages rendering, page flow, break handling,
    * overflow detection, and layout cycles.
    */
   export class Chunker {
      hooks: ChunkerHooks;
      settings: ChunkerSettings;
      pages: Page[];
      total: number;
      content: HTMLElement | Document;
      pagesArea: HTMLElement;

      constructor(
         content?: HTMLElement | Document,
         renderTo?: HTMLElement,
         options?: ChunkerSettings
      );

      /**
       * Sets up the page container and page template structure.
       */
      setup(renderTo: HTMLElement): void;

      /**
       * Starts the chunking and rendering process for the given content.
       * @returns Promise that resolves to the Chunker instance once rendering is complete.
       */
      flow(content: HTMLElement | Document, renderTo?: HTMLElement): Promise<this>;

      /**
       * Renders the parsed HTML into paginated content and adds references.
       */
      render(
         parsed: DocumentFragment,
         startAt?: HTMLElement
      ): Promise<{ pages: Page[] }>;

      /**
       * Resets the rendering state.
       */
      start(): void;

      /**
       * Stops the rendering process.
       */
      stop(): void;

      /**
       * Waits for all fonts to load before rendering starts.
       */
      loadFonts(): Promise<string[]>;

      /**
       * Cleans up and removes all rendered elements and templates.
       */
      destroy(): void;

      // Event emitter methods
      on(event: "page", callback: (page: Page) => void): this;
      on(event: "rendering", callback: () => void): this;
      on(event: string, callback: (...args: unknown[]) => void): this;
      off(event: string, callback?: (...args: unknown[]) => void): this;
      emit(event: string, ...args: unknown[]): void;
   }

   // ============================================================================
   // Polisher
   // ============================================================================

   export interface PolisherHooks {
      onUrl: Hook;
      onAtPage: Hook;
      onAtMedia: Hook;
      onRule: Hook;
      onDeclaration: Hook;
      onContent: Hook;
      onSelector: Hook;
      onPseudoSelector: Hook;
      onImport: Hook;
      beforeTreeParse: Hook;
      beforeTreeWalk: Hook;
      afterTreeWalk: Hook;
   }

   /**
    * The Polisher class handles the parsing and insertion of CSS stylesheets,
    * including remote resources and special hooks for processing CSS content.
    */
   export class Polisher {
      hooks: PolisherHooks;
      sheets: unknown[];
      inserted: HTMLStyleElement[];
      width?: string;
      height?: string;
      orientation?: string;

      constructor(setup?: boolean);

      /**
       * Sets up the base stylesheet and injects a <style> element into the document head.
       */
      setup(): CSSStyleSheet;

      /**
       * Adds and processes one or more CSS sources (URLs or inline CSS).
       * @param sources - URLs or object maps of URLs to CSS strings.
       * @returns The final processed CSS text.
       */
      add(
         ...sources: Array<string | Record<string, string>>
      ): Promise<string>;

      /**
       * Converts raw CSS into a Sheet object, parses it, handles imports,
       * and returns the processed CSS string.
       */
      convertViaSheet(cssStr: string, href: string): Promise<string>;

      /**
       * Inserts a CSS string into the document inside a <style> tag.
       */
      insert(text: string): HTMLStyleElement;

      /**
       * Cleans up all inserted styles and resets the polisher.
       */
      destroy(): void;
   }

   // ============================================================================
   // Previewer
   // ============================================================================

   export interface PreviewerHooks {
      beforePreview: Hook;
      afterPreview: Hook;
   }

   export interface PageSize {
      width: {
         value: number;
         unit: string;
      };
      height: {
         value: number;
         unit: string;
      };
      format?: string;
      orientation?: string;
   }

   export interface FlowResult {
      pages: Page[];
      performance: number;
      size: PageSize;
   }

   export interface PreviewerSettings {
      [key: string]: unknown;
   }

   /**
    * The main class responsible for preparing, chunking, styling,
    * and rendering content into paginated previews.
    */
   export class Previewer {
      polisher: Polisher;
      chunker: Chunker;
      hooks: PreviewerHooks;
      size: PageSize;
      settings: PreviewerSettings;

      constructor(options?: PreviewerSettings);

      /**
       * Initializes handler modules (like footnotes, counters, etc.)
       * and sets up relevant events.
       */
      initializeHandlers(): unknown;

      /**
       * Registers handlers with custom logic or extensions.
       */
      registerHandlers(...handlers: Array<typeof Handler>): void;

      /**
       * Retrieve a query parameter from the current URL.
       */
      getParams(name: string): string | undefined;

      /**
       * Wraps the contents of the <body> in a <template> element if not already present.
       */
      wrapContent(): DocumentFragment;

      /**
       * Removes stylesheets and inline <style> elements that should not be processed.
       * @returns Array of stylesheet hrefs or inline style objects.
       */
      removeStyles(doc?: Document): Array<string | Record<string, string>>;

      /**
       * Main method for rendering content into paged preview.
       * @param content - The content to render.
       * @param stylesheets - List of stylesheet hrefs or inline styles to apply.
       * @param renderTo - Element or selector where rendered content will be inserted.
       * @returns Resolves to the rendered flow object with performance and size metadata.
       */
      preview(
         content?: HTMLElement | DocumentFragment | string,
         stylesheets?: Array<string | Record<string, string>>,
         renderTo?: HTMLElement | string
      ): Promise<FlowResult>;

      // Event emitter methods
      on(event: "page", callback: (page: Page) => void): this;
      on(event: "rendering", callback: (chunker: Chunker) => void): this;
      on(event: "rendered", callback: (flow: FlowResult) => void): this;
      on(event: "size", callback: (size: PageSize) => void): this;
      on(event: "atpages", callback: (pages: unknown) => void): this;
      on(event: string, callback: (...args: unknown[]) => void): this;
      off(event: string, callback?: (...args: unknown[]) => void): this;
      emit(event: string, ...args: unknown[]): void;
   }

   // ============================================================================
   // Handler
   // ============================================================================

   /**
    * Handler class that automatically registers methods as hook callbacks
    * based on hooks provided by chunker, polisher, and caller objects.
    * 
    * Extend this class and define methods matching hook names to automatically
    * register them as callbacks.
    */
   export class Handler {
      chunker: Chunker;
      polisher: Polisher;
      caller: Previewer;

      constructor(chunker?: Chunker, polisher?: Polisher, caller?: Previewer);

      // Event emitter methods
      on(event: string, callback: (...args: unknown[]) => void): this;
      off(event: string, callback?: (...args: unknown[]) => void): this;
      emit(event: string, ...args: unknown[]): void;
   }

   // ============================================================================
   // Handler Utilities
   // ============================================================================

   /**
    * Array of all registered handler classes, composed from different modules.
    */
   export const registeredHandlers: Array<typeof Handler>;

   /**
    * Adds new handler classes to the list of registered handlers.
    */
   export function registerHandlers(...handlers: Array<typeof Handler>): void;

   /**
    * Creates and initializes a new Handlers instance.
    */
   export function initializeHandlers(
      chunker: Chunker,
      polisher: Polisher,
      caller: Previewer
   ): unknown;

   // ============================================================================
   // Polyfill Configuration (for window.PagedConfig)
   // ============================================================================

   export interface PagedConfig {
      /** Whether to automatically render on load (default: true) */
      auto?: boolean;
      /** Function to run before rendering */
      before?: () => void | Promise<void>;
      /** Function to run after rendering, receives result */
      after?: (result?: FlowResult) => void | Promise<void>;
      /** Selector or element to render */
      content?: string | HTMLElement;
      /** Array of stylesheet URLs or paths */
      stylesheets?: string[];
      /** Where to render the output */
      renderTo?: HTMLElement | string;
      /** Additional settings passed to the Previewer */
      settings?: PreviewerSettings;
   }
}

declare global {
   interface Window {
      Paged?: {
         Chunker: typeof Chunker;
         Polisher: typeof Polisher;
         Previewer: typeof Previewer;
         Handler: typeof Handler;
         registeredHandlers: Array<typeof Handler>;
         registerHandlers: typeof registerHandlers;
         initializeHandlers: typeof initializeHandlers;
      };
      PagedConfig?: PagedConfig;
   }
}
