const babel = require('@babel/core');
const babelPluginTransformGlobals = require('.');

function test (name, sourceCode, expectCode, options) {
	/* eslint-disable no-console */

	console.log(name);

	const resultCode = babel.transformSync(sourceCode, {
		plugins: [
			[ babelPluginTransformGlobals, options ]
		]
	}).code;

	if (expectCode === resultCode) {
		console.log('  PASSED');
	} else {
		console.log('  FAILED');
		console.log('Expected:', JSON.stringify(expectCode));
		console.log('Recieved:', JSON.stringify(resultCode));

		process.exit(1);
	}
}

test(
	'babel-plugin-transform-globals: replace',
	`window.addEventListener('click', () => {\n  document.createElement('div');\n});`,
	`window.addEventListener('click', () => {\n  window.document.createElement('div');\n});`,
	{
		replace: {
			document: 'window.document'
		}
	}
);

test(
	'babel-plugin-transform-globals: replace',
	`const exportToWindowGlobal = tinymce => {\n  window.tinymce = tinymce;\n  window.tinyMCE = tinymce;\n};`,
	`const exportToWindowGlobal = tinymce => {\n  window.myGlobal.tinymce = tinymce;\n  window.myGlobal.tinyMCE = tinymce;\n};`,
	{
		replace: {
			tinymce: 'myGlobal.tinymce',
			tinyMCE: 'myGlobal.tinyMCE'
		}
	}
);

test(
	'babel-plugin-transform-globals: require',
	`window.addEventListener('click', () => {\n  document.createElement('div');\n});`,
	`const window = require("./window");\n\nconst {\n  document\n} = window;\nwindow.addEventListener('click', () => {\n  document.createElement('div');\n});`,
	{
		require: {
			'./window': {
				window: 'default',
				document: 'document'
			}
		}
	}
);

test(
	'babel-plugin-transform-globals: require (no default)',
	`window.addEventListener('click', () => {\n  document.createElement('div');\n});`,
	`const {\n  window,\n  document\n} = require("./window");\n\nwindow.addEventListener('click', () => {\n  document.createElement('div');\n});`,
	{
		require: {
			'./window': {
				window: 'window',
				document: 'document'
			}
		}
	}
);

test(
	'babel-plugin-transform-globals: replace + require',
	`window.addEventListener('click', () => {\n  document.createElement('div');\n});`,
	`const window = require("./window");\n\nwindow.addEventListener('click', () => {\n  window.document.createElement('div');\n});`,
	{
		replace: {
			document: 'window.document'
		},
		require: {
			'./window': {
				window: 'default'
			}
		}
	}
);

test(
	'babel-plugin-transform-globals: import',
	`window.addEventListener('click', () => {\n  document.createElement('div');\n});`,
	`import window, { document } from "./window";\nwindow.addEventListener('click', () => {\n  document.createElement('div');\n});`,
	{
		import: {
			'./window': {
				window: 'default',
				document: 'document'
			}
		}
	}
);

test(
	'babel-plugin-transform-globals: replace + import',
	`window.addEventListener('click', () => {\n  document.createElement('div');\n});`,
	`import window from "./window";\nwindow.addEventListener('click', () => {\n  window.document.createElement('div');\n});`,
	{
		replace: {
			document: 'window.document'
		},
		import: {
			'./window': {
				window: 'default'
			}
		}
	}
);

test(
	'babel-plugin-transform-globals: scoped + replace',

	`window.addEventListener('click', () => {\n  const document = window.document;\n  document.createElement('div');\n});\n` +
	`window.addEventListener('click', () => {\n  document.createElement('div');\n});`,

	`window.addEventListener('click', () => {\n  const document = window.document;\n  document.createElement('div');\n});\n` +
	`window.addEventListener('click', () => {\n  window.document.createElement('div');\n});`,

	{
		replace: {
			document: 'window.document'
		}
	}
);

test(
	'babel-plugin-transform-globals: { replace: "browser" }',

	`window.addEventListener('click', () => {\n  const document = window.document;\n  document.createElement('div');\n});\n` +
	`window.addEventListener('click', () => {\n  document.createElement('div') instanceof Node;\n});`,

	`window.addEventListener('click', () => {\n  const document = window.document;\n  document.createElement('div');\n});\n` +
	`window.addEventListener('click', () => {\n  window.document.createElement('div') instanceof window.Node;\n});`,

	{
		replace: 'browser'
	}
);

process.exit(0);
