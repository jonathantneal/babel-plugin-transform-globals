export default function setRequireNodes (requireNodes, path, file, t) {
	Object.keys(requireNodes).forEach(source => {
		const requires = requireNodes[source];

		const aliases = Object.keys(requires);
		const defaultIndex = aliases.findIndex(alias => requires[alias] === 'default');
		const defaultKey = defaultIndex === -1
			? null
		: aliases.splice(defaultIndex, 1).pop();

		const requireCallExpression = t.callExpression( // callee, arguments
			t.identifier('require'),
			[
				t.stringLiteral(source)
			]
		);

		const variableDeclaratorInit = defaultKey
			? t.identifier(defaultKey)
		: requireCallExpression;

		if (aliases.length) {
			file.set(
				'ourPath',
				path.unshiftContainer(
					'body',
					t.variableDeclaration('const', [
						t.variableDeclarator( // id, init
							t.objectPattern( // properties
								aliases.map(
									alias => {
										const name = requires[alias];

										return t.objectProperty( // key, value, computed, shorthand, decorators
											t.identifier(name),
											t.identifier(alias),
											false,
											true
										);
									}
								)
							),
							variableDeclaratorInit
						)
					])
				)[0]
			);
		}

		if (defaultKey) {
			file.set(
				'ourPath',
				path.unshiftContainer(
					'body',
					t.variableDeclaration(
						'const',
						[
							t.variableDeclarator( // id, init
								t.identifier(defaultKey),
								requireCallExpression
							)
						]
					)
				)[0]
			);
		}
	});
}
