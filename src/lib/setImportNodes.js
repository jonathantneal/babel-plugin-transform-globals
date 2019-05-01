export default function setImportNodes (importNodes, path, file, t) {
	Object.keys(importNodes).forEach(source => {
		const importDeclaration = t.importDeclaration(
			Object.keys(importNodes[source]).map(
				name => importNodes[source][name] === 'default'
					? t.importDefaultSpecifier(
						t.identifier(name)
					)
				: t.importSpecifier(
					t.identifier(name),
					t.identifier(importNodes[source][name])
				)
			),
			t.stringLiteral(source)
		);

		file.set('ourPath', path.unshiftContainer('body', importDeclaration)[0]);
	});
}
