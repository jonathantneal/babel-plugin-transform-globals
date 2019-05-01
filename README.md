# babel-plugin-transform-globals [<img src="https://jonneal.dev/node-logo.svg" alt="Babel" width="90" height="90" align="right">][Babel]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[babel-plugin-transform-globals] is a [Babel] plugin that lets you transform
global variables in JavaScript. This can be helpful when working with scripts
that make assumptions about what is in the global variable space.

```js
window.addEventListener('click', {
  document.body.appendChild(
    document.createElement('div')
  )
})

/* becomes (with replace: 'browser') */

window.addEventListener('click', {
  window.document.body.appendChild(
    window.document.createElement('div')
  )
})

/* becomes (with import: { './my-dom': { window: 'default', document: 'document' }) */

import window, { document } from './my-dom'

window.addEventListener('click', {
  document.body.appendChild(
    document.createElement('div')
  )
})
```

## Usage

Add [babel-plugin-transform-globals] to your project:

```bash
npm install babel-plugin-transform-globals --save-dev
```

Add [babel-plugin-transform-globals] to your Babel configuration:

```js
// babel.config.js
module.exports = {
  plugins: [
    'transform-globals'
  ]
}
```

Alternative, configure transformations within your Babel configuration:

```js
module.exports = {
  plugins: [
    ['transform-globals', {

      /* replace global variables */

      replace: {
        // transform global `varA` into `replaceVarA`
        varA: 'replaceVarA',
        // transform global `varB` into `nest.replaceVarB`
        varB: 'nest.replaceVarB'
      },

      /* import global variables (ES Modules) */

      import: {
        'module-import-a': {
          // when `importVarA` is global,
          // write `import importVarA = from 'module-import-a'`
          importVarA: 'default'
        },
        'module-import-b': {
          // when `importVarB` is global,
          // write `import { altName as importVarB } from 'module-import-b'`
          importVarB: 'altName'
        },
        'module-import-c': {
          // when `importVarC` and `importVarD` are global,
          // write `import importVarC, { altName as importVarD } from 'module-import-c'`
          importVarC: 'default',
          importVarD: 'altName'
        }
      },

      /* require global variables (CommonJS) */

      require: {
        'module-require-a': {
          // when `requireVarA` is global,
          // write `const requireVarA = require('module-require-a')`
          requireVarA: 'default'
        },
        'module-require-b': {
          // when `requireVarB` is global,
          // write `const { altName: requireVarB } = require('module-require-b')`
          requireVarB: 'altName'
        },
        'module-require-c': {
          // when `requireVarC` and `requireVarD` are global,
          // write `const requireVarC = require('module-require-c')` and
          // write `const { altName: requireVarB } = requireVarC`
          requireVarC: 'default',
          requireVarD: 'altName'
        }
      }
    }]
  ]
}
```

## Options

### replace

The `replace` option defines an object of global variable names and the
variables that will replace them.

```js
/* would transform `window.addEventListener` into `__window.addEventListener` */
/* would transform `document.createElement` into `__window.document` */
{
  replace: {
    'document': 'window.document',
    'window': '__window'
  }
}
```

The `replace` option accepts the keyword `browsers` to automatically prefix
global browser variables with `window`.

```js
/* would transform `document` into `window.document` */
/* would transform `HTMLElement` into `window.HTMLElement` */
{
  replace: 'browser'
}
```

### import

The `import` option defines an object of modules conditionally imported when
one of their global variable names are referenced.

```js
/* on `window.addEventListener` prefix `import window from './dom'` */
/* on `document.createElement` prefix `import { document } from './dom'` */
/* on `Node.prototype` prefix `import { __Node as Node } from './dom'` */
/* on all prefix `import window, { document, __Node as Node } from './dom'` */
{
  import: {
    './dom': {
      'document': 'document',
      'Node': '__Node',
      'window': 'default'
    }
  }
}
```

### require

The `require` option defines an object of modules conditionally required when
one of their global variable names are referenced.

```js
/* on `window.addEventListener` prefix `const window = require('./dom')` */
/* on `document.createElement` prefix `const { document } = require('./dom')` */
/* on `Node.prototype` prefix `const { __Node: Node } = require('./dom')` */
/* on all prefix `const window = require('./dom'); const { document, __Node: Node } = window` */
{
  require: {
    './dom': {
      'document': 'document',
      'Node': '__Node',
      'window': 'default'
    }
  }
}
```

[cli-img]: https://img.shields.io/travis/jonathantneal/babel-plugin-transform-globals.svg
[cli-url]: https://travis-ci.org/jonathantneal/babel-plugin-transform-globals
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/babel-plugin-transform-globals.svg
[npm-url]: https://www.npmjs.com/package/babel-plugin-transform-globals

[Babel]: https://babeljs.io/
[babel-plugin-transform-globals]: https://github.com/jonathantneal/babel-plugin-transform-globals
