import getImportIdentifiers from './lib/getImportIdentifiers';
import getReplacementIdentifiers from './lib/getReplacementIdentifiers';
import isImportableIdentifier from './lib/isImportableIdentifier';
import isReplaceableIdentifier from './lib/isReplaceableIdentifier';
import setImportNodes from './lib/setImportNodes';
import setRequireNodes from './lib/setRequireNodes';

export default function babelPluginTransformGlobals (api, opts) {
	const { types: t } = api;

	// options
	const replacementIdentifiers = getReplacementIdentifiers(opts.replace, t);
	const importIdentifiers = getImportIdentifiers(opts.import);
	const requireIdentifiers = getImportIdentifiers(opts.require);

	// cache
	const importNodes = {};
	const requireNodes = {};

	return {
		name: 'transform-globals',
		visitor: {
			Identifier (path) {
				if (isReplaceableIdentifier(path, replacementIdentifiers)) {
					const name = path.node.name;
					const replacementIdentifier = replacementIdentifiers[name];

					path.replaceWith(replacementIdentifier);
				}

				if (isImportableIdentifier(path, importIdentifiers)) {
					const alias = path.node.name;
					const source = importIdentifiers[alias].source;

					importNodes[source] = importNodes[source] || {};
					importNodes[source][alias] = importIdentifiers[alias].name;
				}

				if (isImportableIdentifier(path, requireIdentifiers)) {
					const alias = path.node.name;
					const source = requireIdentifiers[alias].source;

					requireNodes[source] = requireNodes[source] || {};
					requireNodes[source][alias] = requireIdentifiers[alias].name;
				}
			},
			Program: {
				exit (path, { file }) {
					setRequireNodes(requireNodes, path, file, t);
					setImportNodes(importNodes, path, file, t);
				}
			}
		}
	}
}
