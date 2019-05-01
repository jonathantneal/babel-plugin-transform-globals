import browserGlobals from './browserGlobals';

export default function getReplacementIdentifiers (globals, t) {
	return globals === 'browser'
		? browserGlobals.reduce(
			(object, name) => Object.assign(object, {
				[name]: createMemberExpressionFromString(`window.${name}`, t)
			}),
			{}
		)
	: Object.keys(Object(globals)).reduce(
		(object, name) => Object.assign(object, {
			[name]: createMemberExpressionFromString(globals[name], t)
		}),
		{}
	);
}

function createMemberExpressionFromString (string, t) {
	return string.split('.').reduce(
		(node, identifier) => node
			? t.memberExpression(node, t.identifier(identifier))
		: t.identifier(identifier),
		null
	);
}
