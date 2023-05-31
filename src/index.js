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

					if (!path.parentPath.isMemberExpression({ property: path.node }) ||
						!t.isMemberExpression(replacementIdentifier)) {
						path.replaceWith(replacementIdentifier);
						path.skip();
					} else {
						const { object: replacementObject, property: replacementProperty } = replacementIdentifier;
						const newObject = mergeMemberExpressionObjects(
							path.parent.object,
							replacementObject,
							t
						);

						path.parentPath.replaceWith(
							t.memberExpression(newObject, replacementProperty)
						);
						path.parentPath.skip()
					}
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

function mergeMemberExpressionObjects (object1, object2, t) {
	const windowGlobalNames = ['window', 'self'];

	if (t.isIdentifier(object2)) {
		const name2 = object2.name;
		const name1 = t.isIdentifier(object1)
			? object1.name
			: object1.property.name;

		const hasDUplicateWindowGlobal = [name1, name2].every(name => windowGlobalNames.includes(name))

		return hasDUplicateWindowGlobal
			? object1 // drop object2
			: t.memberExpression(object1, object2)
	} else {
		return t.memberExpression(
			mergeMemberExpressionObjects(object1, object2.object),
			object2.property
		)
	}

}
