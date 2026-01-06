# Sidebar Manager Pattern

A pattern for managing multiple sidebars from anywhere in your application.

## Overview

The Sidebar Manager provides a way to register, track, and control multiple sidebars with unique names. This is particularly useful when:

- You have multiple sidebars that need to be controlled from different parts of the app
- You want to toggle a sidebar from a component that isn't a direct child of that sidebar's `SidebarProvider`
- You need coordinated control over multiple sidebars (e.g., close one when opening another)

## Components

| Component | Description |
|-----------|-------------|
| `SidebarManagerProvider` | Top-level provider that holds the registry of all sidebars |
| `SidebarManager` | Registers a sidebar with a unique name |
| `SidebarManagerTrigger` | A button to toggle a sidebar by name from anywhere |
| `useSidebarManager()` | Hook to access the sidebar registry |

## Basic Usage

### 1. Wrap your app with `SidebarManagerProvider`

```tsx
import {
  SidebarManagerProvider,
  SidebarProvider,
  SidebarManager,
  SidebarInset,
  Sidebar,
} from "@/components/ui/sidebar";

function App() {
  return (
    <SidebarManagerProvider>
      {/* Your sidebars go here */}
    </SidebarManagerProvider>
  );
}
```

### 2. Register each sidebar with a unique name

Each sidebar needs its own `SidebarProvider` and a `SidebarManager` with a unique `name`:

```tsx
<SidebarManagerProvider>
  <SidebarProvider>
    <SidebarManager name="left">
      <Sidebar side="left">
        {/* Left sidebar content */}
      </Sidebar>
    </SidebarManager>

    <SidebarInset>
      {/* Main content */}
    </SidebarInset>
  </SidebarProvider>
</SidebarManagerProvider>
```

### 3. Control sidebars from anywhere

**Using `SidebarManagerTrigger`:**

```tsx
import { SidebarManagerTrigger } from "@/components/ui/sidebar";

function Header() {
  return (
    <header>
      <SidebarManagerTrigger name="left" />
      <SidebarManagerTrigger name="right" />
    </header>
  );
}
```

**Using the `useSidebarManager` hook:**

```tsx
import { useSidebarManager } from "@/components/ui/sidebar";

function MyComponent() {
  const manager = useSidebarManager();
  const leftSidebar = manager.use("left");
  const rightSidebar = manager.use("right");

  return (
    <div>
      <button onClick={() => leftSidebar?.toggleSidebar()}>
        Toggle Left
      </button>
      <button onClick={() => rightSidebar?.setOpen(false)}>
        Close Right
      </button>
      <span>Left is {leftSidebar?.open ? "open" : "closed"}</span>
    </div>
  );
}
```

## Left and Right Sidebars

A common layout with a left sidebar, main content, and a right sidebar:

```
[Left Sidebar] [Main Content] [Right Sidebar]
```

```tsx
<SidebarManagerProvider>
  <SidebarProvider>
    {/* Left sidebar */}
    <SidebarManager name="left">
      <Sidebar side="left">
        <SidebarContent>Left sidebar</SidebarContent>
      </Sidebar>
    </SidebarManager>

    <SidebarInset>
      {/* Nest another SidebarProvider for the right sidebar */}
      <SidebarProvider>

        {/* Main content in the middle */}
        <SidebarInset>
          <main>Middle content</main>
        </SidebarInset>

        {/* Right sidebar */}
        <SidebarManager name="right">
          <Sidebar side="right">
            <SidebarContent>Right sidebar</SidebarContent>
          </Sidebar>
        </SidebarManager>

      </SidebarProvider>
    </SidebarInset>
  </SidebarProvider>
</SidebarManagerProvider>
```

**Key points:**
- The outer `SidebarProvider` handles the left sidebar
- The inner `SidebarProvider` (inside `SidebarInset`) handles the right sidebar
- `SidebarInset` comes **before** the right `Sidebar` so content appears in the middle


**Result:**
```
[Left Sidebar] [Main Content] [Right Sidebar]
```

### Why Nesting Works

- Each `SidebarProvider` creates its own context
- Each `SidebarInset` is the "main content" area for its parent sidebar
- The nested sidebar appears inside the outer `SidebarInset`, so it flows beside the first sidebar

## Multiple Side-by-Side Sidebars

To have multiple sidebars stacked horizontally (e.g., two sidebars on the left), nest your `SidebarProvider` components:

```tsx
<SidebarManagerProvider>
  {/* First sidebar (fixed positioning, anchored to viewport) */}
  <SidebarProvider>
    <SidebarManager name="left">
      <Sidebar side="left">
        <SidebarContent>First Sidebar</SidebarContent>
      </Sidebar>
    </SidebarManager>

    <SidebarInset>
      {/* Second sidebar (relative to first sidebar's inset) */}
      <SidebarProvider>
        <SidebarManager name="second">
          <Sidebar side="left">
            <SidebarContent>Second Sidebar</SidebarContent>
          </Sidebar>
        </SidebarManager>

        <SidebarInset>
          {/* Main content area */}
          <main>Your content here</main>
        </SidebarInset>
      </SidebarProvider>
    </SidebarInset>
  </SidebarProvider>
</SidebarManagerProvider>
```

**Result:**
```
[First Sidebar] [Second Sidebar] [Main Content]
```

### Important: Positioning

The shadcn/ui sidebar component uses `position: fixed` to anchor the sidebar to the viewport. This works correctly when: With the [Left Sidebar] [Main Content] [Right Sidebar] layout. 

But when using this side-by-side Sidebars you have to use `position: absolute` otherwise the layout will be broken.

To avoid scrolling the sidebars with the main content you can wrap the main content with `ScrollArea`.

Like this:

```tsx
<SidebarInset>
  <ScrollArea className="h-screen">
    <main>Your content here</main>
  </ScrollArea>
</SidebarInset>
```

If you need truly fixed sidebars that stay visible during scroll, you may need to adjust the positioning strategy.

## API Reference

### `SidebarManagerProvider`

Top-level provider for the sidebar registry.

```tsx
<SidebarManagerProvider>
  {children}
</SidebarManagerProvider>
```

### `SidebarManager`

Registers a sidebar with a unique name.

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Unique identifier for this sidebar |
| `children` | `ReactNode` | The `Sidebar` component to register |

```tsx
<SidebarManager name="my-sidebar">
  <Sidebar>...</Sidebar>
</SidebarManager>
```

### `SidebarManagerTrigger`

A button to toggle a sidebar by name.

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Name of the sidebar to toggle |
| `...props` | `ButtonProps` | All Button component props |

```tsx
<SidebarManagerTrigger name="left" />
```

### `useSidebarManager()`

Hook to access the sidebar registry.

```tsx
const manager = useSidebarManager();

// Get a sidebar by name (returns SidebarContextProps | null)
const sidebar = manager.use("left");

// Available methods on `sidebar`:
sidebar?.open           // boolean - current open state
sidebar?.setOpen(bool)  // set open state directly
sidebar?.toggleSidebar() // toggle open/closed
sidebar?.state          // "expanded" | "collapsed"
sidebar?.isMobile       // boolean
sidebar?.openMobile     // boolean - mobile sheet open state
sidebar?.setOpenMobile(bool)
```
