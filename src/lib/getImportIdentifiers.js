export default function getImportIdentifiers (globals) {
	return Object.keys(Object(globals)).reduce(
		(object, source) => Object.keys(globals[source]).reduce(
			(object, alias) => {
				Object.assign(
					object[alias] = Object(object[alias]),
					{
						source: source,
						name: globals[source][alias]
					}
				);

				return object;
			},
			object
		),
		{}
	);
}
