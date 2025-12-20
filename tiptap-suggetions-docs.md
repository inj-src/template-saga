# Suggestion utility

This utility helps with all kinds of suggestions in the editor. Have a look at the [`Mention`](/docs/editor/extensions/nodes/mention) or [`Emoji`](/docs/editor/extensions/nodes/emoji) node to see it in action.

## [](#settings)Settings

### [](#char)char

The character that triggers the autocomplete popup.

Default: `'@'`

### [](#pluginkey)pluginKey

A ProseMirror PluginKey.

Default: `SuggestionPluginKey`

### [](#allow)allow

A function that returns a boolean to indicate if the suggestion should be active.

Default: `(props: { editor: Editor; state: EditorState; range: Range, isActive?: boolean }) => true`

### [](#allowspaces)allowSpaces

Allows or disallows spaces in suggested items.

Default: `false`

### [](#allowedprefixes)allowedPrefixes

The prefix characters that are allowed to trigger a suggestion. Set to `null` to allow any prefix character.

Default: `[' ']`

### [](#startofline)startOfLine

Trigger the autocomplete popup at the start of a line only.

Default: `false`

### [](#decorationtag)decorationTag

The HTML tag that should be rendered for the suggestion.

Default: `'span'`

### [](#decorationclass)decorationClass

A CSS class that should be added to the suggestion.

Default: `'suggestion'`

### [](#decorationcontent)decorationContent

The content that should be rendered in the suggestion decoration.

Default: `''`

### [](#decorationemptyclass)decorationEmptyClass

A CSS class that should be added to the suggestion when it is empty.

Default: `'is-empty'`

### [](#command)command

Executed when a suggestion is selected.

Default: `() => {}`

### [](#items)items

Pass an array of filtered suggestions, can be async.

Default: `({ editor, query }) => []`

### [](#render)render

A render function for the autocomplete popup.

Default: `() => ({})`

### [](#findsuggestionmatch)findSuggestionMatch

Optional param to replace the built-in regex matching of editor content that triggers a suggestion. See [the source](https://github.com/ueberdosis/tiptap/blob/main/packages/suggestion/src/findSuggestionMatch.ts#L18) for more detail.

Default: `findSuggestionMatch(config: Trigger): SuggestionMatch`

## [](#exiting-open-suggestions)Exiting open suggestions

Sometimes you want your users to be able to exit an an open suggestion without selecting an item. To achieve this, users can either press Escape which will close the open suggestion. If you want to manually trigger the closing of the suggestion, you can use use `exitSuggestion` utility function to close existing suggestions on your view.

```
import { exitSuggestion } from '@tiptap/suggestion'
import { PluginKey } from 'prosemirror-state' // optional, if you need to create a custom key

const MySuggestionPluginKey = new PluginKey('my-suggestions') // or use the default 'suggestion'

exitSuggestion(editor.view, MySuggestionPluginKey)

// Alternatively, use the default plugin key:
// exitSuggestion(editor.view, 'suggestion')
```

## [](#source-code)Source code

[packages/suggestion/](https://github.com/ueberdosis/tiptap/blob/main/packages/suggestion/)