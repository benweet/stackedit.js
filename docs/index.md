# Introduction

**stackedit.js** makes it easy to bind StackEdit to a `textarea`.

> <textarea>Hello **Markdown** writer!</textarea>

Because it runs StackEdit in an iframe, **stackedit.js** is lightweight and has no dependency.

# Getting started

## Import

Add the script to your web page.

```html
<script src="https://unpkg.com/stackedit-js@1.0.0/docs/lib/stackedit.min.js"></script>
```

Or include it in your project

```bash
npm install stackedit-js
```

and import it into your script.

```javascript
// ES6 style
import Stackedit from 'stackedit-js';

// CommonJS style
const Stackedit = require('stackedit-js');
```

## Usage

To open StackEdit, create a `Stackedit` object and call `openFile()`.

```javascript
  const el = document.querySelector('textarea');
  const stackedit = new Stackedit();

  // Open the iframe
  stackedit.openFile({
    name: 'Filename', // with a filename
    content: {
      text: el.value // and the Markdown content.
    }
  });

  // Listen to StackEdit and apply the changes to the textarea.
  stackedit.on('fileChange', (file) => {
    el.value = file.content.text;
  });
```

## Events

`Stackedit` objects will emit the following events:

- `fileChange` whenever a change happens to the file and its content,

- `close` once the iframe is closed.

  **Tip:** Call `stackedit.close()` to force closing the iframe.

## Conversion service

Duly sanitized HTML will be returned as `file.content.html` in the `fileChange` event, so that you can print the formatted output into your page.

> <div class="html"></div>

**Tip:** Use the silent mode to convert Markdown to HTML on page load:

```javascript
stackedit.openFile({
  name: 'Filename',
  content: { text: 'Hello **Markdown** writer!' }
}, true /* silent mode */);

// In silent mode, the `fileChange` event is emitted only once.
stackedit.on('fileChange', (file) => {
  divEl.innerHTML = file.content.html;
});
```

## Custom properties

Pass YAML properties to enable/disable extensions. GFM as an example:

```javascript
stackedit.openFile({
  name: 'Filename',
  content: {
    text: 'Hello **Markdown** writer!',
    yamlProperties: `

extensions:
  markdown:
    abbr: false
    deflist: false
    footnote: false
    sub: false
    sup: false
    typographer: false
  katex:
    enabled: false
  mermaid:
    enabled: false

    `
  }
});
```

## Custom StackEdit URL

**stackedit.js** uses [https://stackedit.io/app](https://stackedit.io/app) as the default StackEdit URL. Though you can provide a custom URL to the `Stackedit` constructor.

```js
  const stackedit = new Stackedit({
    url: 'https://hostname/app'
  });
```



<script src="lib/stackedit.js"></script>
<script src="index.js"></script>
