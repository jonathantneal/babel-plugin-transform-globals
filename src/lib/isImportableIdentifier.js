export default function isImportableIdentifier (path, identifiers) {
	return identifiers.hasOwnProperty(path.node.name) &&
	!path.scope.hasBinding(path.node.name) &&
	!path.parentPath.isMemberExpression({ property: path.node })
}
