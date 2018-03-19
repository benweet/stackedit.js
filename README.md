# stackedit.js

[![Build Status](https://img.shields.io/travis/benweet/stackedit.js.svg?style=flat)](https://travis-ci.org/benweet/stackedit.js) [![NPM version](https://img.shields.io/npm/v/stackedit-js.svg?style=flat)](https://www.npmjs.org/package/stackedit-js)

> Add StackEdit to any website

### Build setup

``` bash
# install dependencies
npm install

# watch and build for dev
npm run dev

# build for production
npm run build
```

### Quick start

Bind StackEdit to a `textarea`:

```js
// Import the lib.
import Stackedit from 'stackedit-js';

// Get the textarea.
const el = document.querySelector('textarea');

// Create the Stackedit object.
const stackedit = new Stackedit();

// Open the iframe
stackedit.openFile({
  name: 'Filename', // with a filename
  content: {
    text: el.value // and the Markdown content.
  }
});

// Listen to StackEdit events and apply the changes to the textarea.
stackedit.on('fileChange', (file) => {
  el.value = file.content.text;
});
```

### Documentation

Full documentation can be found at https://benweet.github.io/stackedit.js/.
