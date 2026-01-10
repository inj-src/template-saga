# Supported feature of the W3C specifications

## CSS Paged Media Module Level 3

[W3C Working Draft 14 March 2013](https://www.w3.org/TR/css3-page/)

[Editor's Draft, 9 November 2017](https://drafts.csswg.org/css-page/#marks)

### @page rules

#### Size

| Property | Support |
|----------|---------|
| `size: <length>{1,2}` | ✅ Supported |
| `size: A5 \| A4 \| A3 \| B5 \| B4 \| letter \| legal \| ledger` | ✅ Supported |
| `size: portrait \| landscape` | ✅ Supported |

#### Marks

| Property | Support |
|----------|---------|
| `marks: none \| [ crop \|\| cross ]` | ✅ Supported |

#### Bleed

| Property | Support |
|----------|---------|
| `bleed: <length>` | ✅ Supported |

#### Margins

| Property | Support |
|----------|---------|
| `margin: <length>{1,2}` | ✅ Supported |
| `margin-top: <length>` | ✅ Supported |
| `margin-bottom: <length>` | ✅ Supported |
| `margin-left: <length>` | ✅ Supported |
| `margin-right: <length>` | ✅ Supported |
| `margin-inside: <length>` | ❌ Not supported |
| `margin-outside: <length>` | ❌ Not supported |

#### Background

| Property | Support |
|----------|---------|
| `background-color: ...` | ✅ Supported |
| `background-image: url(<url>)` | ✅ Supported |
| `background-size: ...` | ✅ Supported |
| `background-repeat: ...` | ✅ Supported |
| `background-position: ...` | ✅ Supported |

### Page selectors

#### Spread

| Property | Support |
|----------|---------|
| `@page :left { }` | ✅ Supported |
| `@page :right { }` | ✅ Supported |

#### First page

| Property | Support |
|----------|---------|
| `@page :first { }` | ✅ Supported |

#### Blank page

| Property | Support |
|----------|---------|
| `@page :blank { }` | ✅ Supported |

#### nth page

| Property | Support |
|----------|---------|
| `@page :nth(n) { }` | ✅ Supported |

### Margin boxes

| Feature | Support |
|---------|---------|
| Default alignment | ✅ Supported |
| Styles (background, color, border) | ✅ Supported |
| Text alignment (`text-align: left \| center \| right`) | ✅ Supported |
| Vertical alignment (`vertical-align: top \| middle \| bottom`) | ✅ Supported |
| Computed sizing | 🔄 In progress |

### Page-based counters

| Property | Support |
|----------|---------|
| `content: counter(page)` | ✅ Supported |
| `content: counter(pages)` | ✅ Supported |

### Named page

| Property | Support |
|----------|---------|
| `@page <name> { }` with `section { page: <name> }` | ✅ Supported |

### Page group

| Property | Support |
|----------|---------|
| `@page <name> { }` with `section { page: <name> }` | ✅ Supported |

### Page selectors for page group

#### Spread

| Property | Support |
|----------|---------|
| `@page <name>:left { }` | ✅ Supported |
| `@page <name>:right { }` | ✅ Supported |

#### First page

| Property | Support |
|----------|---------|
| `@page <name>:first { }` | ✅ Supported |

#### Blank page

| Property | Support |
|----------|---------|
| `@page <name>:blank { }` | ⚠️ See [issue#30](https://gitlab.coko.foundation/pagedjs/pagedjs/issues/30) |

#### nth page

| Property | Support |
|----------|---------|
| `@page <name>:nth(n) { }` | ⚠️ See [issue#29](https://gitlab.coko.foundation/pagedjs/pagedjs/issues/29) |

---

## CSS Fragmentation Module Level 3

[W3C Candidate Recommendation, 9 February 2017](https://www.w3.org/TR/css-break-3/)

### Breaks Between Boxes

#### Breaks before

| Property | Support |
|----------|---------|
| `break-before: avoid-page \| avoid` | ❌ Not supported |
| `break-before: page` | ✅ Supported |
| `break-before: left` | ✅ Supported |
| `break-before: right` | ✅ Supported |
| `break-before: recto` | ✅ Supported |
| `break-before: verso` | ✅ Supported |
| `break-before: column \| region` | ❓ Unknown |

#### Breaks after

| Property | Support |
|----------|---------|
| `break-after: avoid-page \| avoid` | ❌ Not supported |
| `break-after: page` | ✅ Supported |
| `break-after: left` | ✅ Supported |
| `break-after: right` | ✅ Supported |
| `break-after: recto` | ✅ Supported |
| `break-after: verso` | ✅ Supported |
| `break-after: column \| region` | ❓ Unknown |

#### Avoid breaks inside

| Property | Support |
|----------|---------|
| `break-inside: avoid` | ✅ Supported |
| `break-inside: avoid-page` | ❌ Not supported |
| `break-inside: avoid-column` | ❓ Unknown |
| `break-inside: avoid-region` | ❓ Unknown |

### Breaks Between Lines

| Property | Support |
|----------|---------|
| `orphans: <integer>` | ✅ Chrome/Blink browsers support out of the box. Firefox doesn't. |
| `widows: <integer>` | ✅ Chrome/Blink browsers support out of the box. Firefox doesn't. |

### Fragmented Borders and Backgrounds

| Property | Support |
|----------|---------|
| `box-decoration-break: slice \| clone` | ❌ Not supported |

---

## CSS Generated Content for Paged Media Module

[W3C Working Draft, 13 May 2014](https://www.w3.org/TR/css-gcpm-3/)

### Named strings

#### String-set() on elements

| Property | Support |
|----------|---------|
| `string-set: [[<custom-ident> <content-list>][, <custom-ident> <content-list>]* ]` | |

**`<content-list>` values:**

| Value | Support |
|-------|---------|
| `<string>` | ✅ Supported |
| `content(text)` | ✅ Supported |
| `content(before)` | ⚠️ See [Issue#45](https://gitlab.coko.foundation/pagedjs/pagedjs/issues/45) |
| `content(after)` | ⚠️ See [Issue#45](https://gitlab.coko.foundation/pagedjs/pagedjs/issues/45) |
| `content(first-letter)` | ⚠️ See [Issue#45](https://gitlab.coko.foundation/pagedjs/pagedjs/issues/45) |
| `counter()` | ❌ Not supported |
| `counters()` | ❌ Not supported |
| `attr(<identifier>)` | ❌ Not supported |

#### String in margin-boxes

| Property | Support |
|----------|---------|
| `content: string( <custom-ident> [ , [ <keyword>] ]? )` | |

**`<keyword>` values:**

| Value | Support |
|-------|---------|
| `first` | 🔄 Pending merge request |
| `start` | 🔄 Pending merge request |
| `last` | 🔄 Pending merge request |
| `first-except` | ✅ Supported |

### Running elements

| Property | Support |
|----------|---------|
| `position: running(<custom-ident>)` | ✅ Supported |
| `content: element(...)` | ✅ Supported |

**`element()` keyword values:**

| Value | Support |
|-------|---------|
| `first` | ❌ Not supported |
| `start` | ❌ Not supported |
| `last` | ❌ Not supported |
| `first-except` | ❌ Not supported |

### Footnotes

| Property | Support |
|----------|---------|
| `@footnote{ float: bottom ; }` | ❌ Not supported |
| `.note { float: footnote ; }` | ❌ Not supported |
| `footnote-display: block \| inline \| compact` | ❌ Not supported |
| `footnote-policy: auto \| line \| block` | ❌ Not supported |
| `::footnote-call { }` | ❌ Not supported |
| `::footnote-marker { }` | ❌ Not supported |
| `@page { counter-reset: footnote ; }` | ❌ Not supported |

### Leaders

| Property | Support |
|----------|---------|
| `content: leader(<type>)` | ❌ Not supported |

**`<type>` values:** `dotted`, `solid`, `space`, `<string>` - all not supported.

### Cross-references

#### Counter type

| Property | Support |
|----------|---------|
| `content: target-counter(attr(href url), page)` | ✅ Supported (see [Issue#46](https://gitlab.coko.foundation/pagedjs/pagedjs/issues/46)) |
| `target-counters( <url> , <custom-ident> [ , <counter-style> ]? )` | ❌ Not supported |

#### Text type

| Property | Support |
|----------|---------|
| `content: target-text(attr(href))` | ✅ Supported |

**`<keyword>` values for target-text:**

| Value | Support |
|-------|---------|
| `content` | ✅ Supported |
| `before` | ✅ Supported |
| `after` | ✅ Supported |
| `first-letter` | ✅ Supported |

### PDF bookmarks

| Property | Support |
|----------|---------|
| `bookmark-level: <integer>` | ❌ Not supported |
| `bookmark-label: <content-list>` | ❌ Not supported |
| `bookmark-state: open \| close` | ❌ Not supported |
