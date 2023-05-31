function isGlobalIdentifier (path, name) {
	return path.scope.getBinding(name) == null
}

function isObjectProperty (path) {
	return path.parentPath.isMemberExpression({ property: path.node })
}

export default function isReplaceableIdentifier (path, identifiers) {
	if (!identifiers.hasOwnProperty(path.node.name)) {
		return false
	}

	if (isGlobalIdentifier(path, path.node.name)) {
		return true
	}

	if (isObjectProperty(path)) {
		const {object } = path.parentPath.node

		// TODO: what about window.window.varA or window.self.window...?
		return ['window', 'self'].includes(object.name) &&
			isGlobalIdentifier(path.parentPath, object.name)
	}

	return false
}
