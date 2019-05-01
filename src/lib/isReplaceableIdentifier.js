export default function isReplaceableIdentifier (path, identifiers) {
	return identifiers.hasOwnProperty(path.node.name) &&
	!path.scope.hasBinding(path.node.name) &&
	!path.parentPath.isMemberExpression({ property: path.node })
}
